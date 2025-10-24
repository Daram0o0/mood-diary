'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * 회고 데이터 타입 정의
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 스키마 정의
 */
const retrospectFormSchema = z.object({
  content: z.string().min(1, '회고를 입력해주세요.'),
});

export type RetrospectFormData = z.infer<typeof retrospectFormSchema>;

/**
 * 회고쓰기 폼 hook
 * 
 * 회고 등록 기능을 제공하는 커스텀 hook입니다.
 * react-hook-form과 zod를 사용하여 폼 검증을 수행하고,
 * 로컬스토리지에 회고 데이터를 저장합니다.
 * 
 * @param {number} diaryId - 일기 ID
 * @returns {Object} hook 반환값
 * @returns {Object} form - react-hook-form 객체
 * @returns {Function} onSubmit - 폼 제출 핸들러
 * @returns {boolean} isSubmitting - 제출 중 상태
 * @returns {boolean} isFormValid - 폼 유효성 상태
 * 
 * @example
 * ```tsx
 * const { form, onSubmit, isSubmitting, isFormValid } = useRetrospectForm(1);
 * ```
 */
export function useRetrospectForm(diaryId: number) {
  const form = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch, reset } = form;
  const { isSubmitting } = formState;
  const watchedContent = watch('content');
  const isFormValid = watchedContent.trim().length > 0;

  /**
   * 로컬스토리지에서 기존 회고 데이터를 가져옵니다.
   */
  const getExistingRetrospects = useCallback((): RetrospectData[] => {
    try {
      const stored = localStorage.getItem('retrospects');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('로컬스토리지에서 회고 데이터를 읽는 중 오류 발생:', error);
      return [];
    }
  }, []);

  /**
   * 로컬스토리지에 회고 데이터를 저장합니다.
   */
  const saveRetrospects = useCallback((retrospects: RetrospectData[]) => {
    try {
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    } catch (error) {
      console.error('로컬스토리지에 회고 데이터를 저장하는 중 오류 발생:', error);
      throw new Error('회고 저장에 실패했습니다.');
    }
  }, []);

  /**
   * 새로운 회고 ID를 생성합니다.
   */
  const generateNewId = useCallback((existingRetrospects: RetrospectData[]): number => {
    if (existingRetrospects.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingRetrospects.map(r => r.id));
    return maxId + 1;
  }, []);

  /**
   * 폼 제출 핸들러
   * 회고 데이터를 로컬스토리지에 저장하고 페이지를 새로고침합니다.
   */
  const onSubmit = handleSubmit(async (data: RetrospectFormData) => {
    try {
      // 기존 회고 데이터 가져오기
      const existingRetrospects = getExistingRetrospects();
      
      // 새로운 회고 데이터 생성
      const newRetrospect: RetrospectData = {
        id: generateNewId(existingRetrospects),
        content: data.content.trim(),
        diaryId: diaryId,
        createdAt: new Date().toISOString(),
      };

      // 기존 데이터에 새 회고 추가
      const updatedRetrospects = [...existingRetrospects, newRetrospect];
      
      // 로컬스토리지에 저장
      saveRetrospects(updatedRetrospects);
      
      // 폼 초기화
      reset();
      
      // 페이지 새로고침
      window.location.reload();
      
    } catch (error) {
      console.error('회고 저장 중 오류 발생:', error);
      // 에러 처리는 필요에 따라 추가 구현
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting,
    isFormValid,
  };
}
