'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { EmotionType } from '@/commons/constants/enum';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { createDiaryDetailPath } from '@/commons/constants/url';
import Modal from '@/commons/components/modal';

/**
 * 일기 폼 데이터 타입
 */
export interface DiaryFormData {
  title: string;
  content: string;
  emotion: EmotionType;
}

/**
 * 로컬스토리지에 저장될 일기 데이터 타입
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 폼 스키마 (zod 검증)
 */
const diaryFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  emotion: z.enum(['Happy', 'Sad', 'Angry', 'Surprise', 'Etc'] as const, {
    message: '감정을 선택해주세요.',
  }),
});

/**
 * 일기 폼 훅
 * 
 * react-hook-form과 zod를 활용한 일기 작성 폼 관리 훅
 * - 폼 검증 및 상태 관리
 * - 로컬스토리지 저장
 * - 등록완료 모달 표시
 * - 상세페이지 이동
 * 
 * @returns 폼 관련 상태 및 핸들러
 * 
 * @example
 * ```tsx
 * const { 
 *   register, 
 *   handleSubmit, 
 *   formState: { errors, isValid },
 *   onSubmit,
 *   watch
 * } = useDiaryForm();
 * ```
 */
export const useDiaryForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  const form = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: '',
      content: '',
      emotion: 'Happy',
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;

  /**
   * 로컬스토리지에서 기존 일기 목록 가져오기
   */
  const getExistingDiaries = (): DiaryData[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('diaries');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('로컬스토리지에서 일기 목록을 가져오는 중 오류 발생:', error);
      return [];
    }
  };

  /**
   * 로컬스토리지에 일기 목록 저장
   */
  const saveDiaries = (diaries: DiaryData[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    } catch (error) {
      console.error('로컬스토리지에 일기 목록을 저장하는 중 오류 발생:', error);
    }
  };

  /**
   * 새로운 일기 ID 생성
   */
  const generateNewId = (existingDiaries: DiaryData[]): number => {
    if (existingDiaries.length === 0) return 1;
    
    const maxId = Math.max(...existingDiaries.map(diary => diary.id));
    return maxId + 1;
  };

  /**
   * 등록완료 모달 표시
   */
  const showSuccessModal = (diaryId: number): void => {
    const modalContent = (
      <Modal
        variant="info"
        actions="single"
        title="등록 완료"
        description="일기가 성공적으로 등록되었습니다."
        onConfirm={() => {
          closeAllModals();
          router.push(createDiaryDetailPath(diaryId));
        }}
      />
    );

    openModal(modalContent);
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: DiaryFormData): void => {
    try {
      // 기존 일기 목록 가져오기
      const existingDiaries = getExistingDiaries();
      
      // 새로운 일기 데이터 생성
      const newDiary: DiaryData = {
        id: generateNewId(existingDiaries),
        title: data.title,
        content: data.content,
        emotion: data.emotion,
        createdAt: new Date().toISOString(),
      };

      // 일기 목록에 추가
      const updatedDiaries = [...existingDiaries, newDiary];
      
      // 로컬스토리지에 저장
      saveDiaries(updatedDiaries);

      // 등록완료 모달 표시
      showSuccessModal(newDiary.id);

    } catch (error) {
      console.error('일기 등록 중 오류 발생:', error);
    }
  };

  /**
   * 감정 선택 핸들러
   */
  const handleEmotionChange = (emotion: EmotionType): void => {
    setValue('emotion', emotion, { shouldValidate: true });
  };

  /**
   * 폼 필드 감시 (실시간 유효성 검사)
   */
  const watchedFields = watch();

  /**
   * 폼 유효성 검사 (Zod 스키마 직접 사용)
   */
  const isFormValid = (): boolean => {
    try {
      // Zod 스키마로 현재 폼 데이터 검증
      const result = diaryFormSchema.safeParse(watchedFields);
      const isValidForm = result.success;
      
      
      return isValidForm;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  return {
    // 폼 관련
    register,
    handleSubmit: handleSubmit(onSubmit),
    formState,
    errors,
    isValid: isFormValid(),
    watch,
    setValue,
    
    // 커스텀 핸들러
    onSubmit,
    handleEmotionChange,
    
    // 감시된 필드들
    watchedFields,
    
    // 폼 인스턴스 (고급 사용을 위해)
    form,
  };
};

export default useDiaryForm;