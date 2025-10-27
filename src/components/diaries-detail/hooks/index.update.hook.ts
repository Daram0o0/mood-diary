'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmotionType, emotionKeys } from '@/commons/constants/enum';

/**
 * 일기 수정 폼 데이터 타입 정의
 */
const diaryUpdateFormSchema = z.object({
  emotion: z.enum(emotionKeys as [EmotionType, ...EmotionType[]]),
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100자 이하로 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.').max(1000, '내용은 1000자 이하로 입력해주세요.'),
});

export type DiaryUpdateFormData = z.infer<typeof diaryUpdateFormSchema>;

/**
 * 일기 데이터 인터페이스
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 수정 훅의 반환 타입
 */
export interface UseDiaryUpdateReturn {
  // 폼 관련
  form: ReturnType<typeof useForm<DiaryUpdateFormData>>;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
  
  // 상태 관리
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
}

/**
 * 일기 수정 기능을 제공하는 커스텀 훅
 * 
 * react-hook-form과 zod를 사용하여 폼 검증을 수행하고,
 * 로컬스토리지의 일기 데이터를 수정합니다.
 * 
 * @param {number} diaryId - 수정할 일기 ID
 * @param {DiaryData} initialData - 초기 일기 데이터
 * @returns {UseDiaryUpdateReturn} 훅 반환값
 * 
 * @example
 * ```tsx
 * const { form, onSubmit, onCancel, isSubmitting, isFormValid, isEditing, startEdit } = useDiaryUpdate(1, diary);
 * ```
 */
export function useDiaryUpdate(diaryId: number, initialData: DiaryData): UseDiaryUpdateReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 초기화
  const form = useForm<DiaryUpdateFormData>({
    resolver: zodResolver(diaryUpdateFormSchema),
    defaultValues: {
      emotion: initialData.emotion,
      title: initialData.title,
      content: initialData.content,
    },
    mode: 'onChange',
  });

  const { watch, reset, formState } = form;
  const { errors } = formState;
  
  // 폼 필드 값 감시
  const watchedValues = watch();
  
  // 폼 유효성 검사
  const isFormValid = 
    watchedValues.emotion && 
    watchedValues.title?.trim().length > 0 && 
    watchedValues.content?.trim().length > 0 &&
    Object.keys(errors).length === 0;

  /**
   * 로컬스토리지에서 기존 일기 데이터를 가져옵니다.
   */
  const getExistingDiaries = useCallback((): DiaryData[] => {
    try {
      const stored = localStorage.getItem('diaries');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('로컬스토리지에서 일기 데이터를 읽는 중 오류 발생:', error);
      throw new Error('일기 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  /**
   * 로컬스토리지에 일기 데이터를 저장합니다.
   */
  const saveDiaries = useCallback((diaries: DiaryData[]) => {
    try {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    } catch (error) {
      console.error('로컬스토리지에 일기 데이터를 저장하는 중 오류 발생:', error);
      throw new Error('일기 저장에 실패했습니다.');
    }
  }, []);

  /**
   * 수정 모드 시작
   */
  const startEdit = useCallback(() => {
    setIsEditing(true);
    // 폼을 초기 데이터로 리셋
    reset({
      emotion: initialData.emotion,
      title: initialData.title,
      content: initialData.content,
    });
  }, [initialData, reset]);

  /**
   * 수정 취소
   */
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    // 폼을 초기 데이터로 리셋
    reset({
      emotion: initialData.emotion,
      title: initialData.title,
      content: initialData.content,
    });
  }, [initialData, reset]);

  /**
   * 폼 제출 핸들러
   * 일기 데이터를 로컬스토리지에 저장하고 수정 모드를 종료합니다.
   */
  const onSubmit = async () => {
    const data = form.getValues();
    const validationResult = diaryUpdateFormSchema.safeParse(data);
    
    if (!validationResult.success) {
      console.error('폼 검증 실패:', validationResult.error);
      return;
    }
    
    const validData = validationResult.data;
    try {
      setIsSubmitting(true);

      // 기존 일기 데이터 가져오기
      const existingDiaries = getExistingDiaries();
      
      // 수정할 일기 찾기
      const diaryIndex = existingDiaries.findIndex(diary => diary.id === diaryId);
      
      if (diaryIndex === -1) {
        throw new Error('수정할 일기를 찾을 수 없습니다.');
      }

      // 일기 데이터 업데이트
      const updatedDiary: DiaryData = {
        ...existingDiaries[diaryIndex],
        emotion: validData.emotion,
        title: validData.title.trim(),
        content: validData.content.trim(),
        // createdAt은 수정하지 않음 (원본 작성일 유지)
      };

      // 배열 업데이트
      const updatedDiaries = [...existingDiaries];
      updatedDiaries[diaryIndex] = updatedDiary;
      
      // 로컬스토리지에 저장
      saveDiaries(updatedDiaries);
      
      // 수정 모드 종료
      setIsEditing(false);
      
      // 페이지 새로고침 (데이터 변경사항 반영)
      window.location.reload();
      
    } catch (error) {
      console.error('일기 수정 중 오류 발생:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    onCancel: cancelEdit,
    isSubmitting,
    isFormValid,
    isEditing,
    startEdit,
    cancelEdit,
  };
}

export default useDiaryUpdate;