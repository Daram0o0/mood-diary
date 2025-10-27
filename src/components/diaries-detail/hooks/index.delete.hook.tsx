'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EmotionType } from '@/commons/constants/enum';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';

/**
 * 일기 데이터 인터페이스
 */
export interface Diary {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 삭제 훅 반환 타입
 */
export interface UseDiaryDeleteReturn {
  /**
   * 삭제 중인지 여부
   */
  isDeleting: boolean;
  
  /**
   * 모달 열기 함수
   */
  openModal: () => void;
}

/**
 * 일기 삭제 기능을 제공하는 커스텀 훅
 * 
 * 모달 프로바이더를 사용하여 삭제 확인 모달을 표시하고,
 * 로컬스토리지에서 일기를 삭제한 후 일기목록 페이지로 이동합니다.
 * 
 * @param {number} diaryId - 삭제할 일기의 ID
 * @returns {UseDiaryDeleteReturn} 삭제 관련 상태와 함수들
 * 
 * @example
 * ```tsx
 * const { isDeleting, openModal } = useDiaryDelete(1);
 * 
 * return (
 *   <div>
 *     <button onClick={openModal}>삭제</button>
 *   </div>
 * );
 * ```
 */
export const useDiaryDelete = (diaryId: number): UseDiaryDeleteReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { openModal: openModalProvider, closeTopModal } = useModal();

  /**
   * 일기를 삭제하는 함수
   */
  const deleteDiary = useCallback(async () => {
    try {
      setIsDeleting(true);

      // 로컬스토리지에서 일기 목록 가져오기
      const storedDiaries = localStorage.getItem('diaries');
      if (!storedDiaries) {
        throw new Error('일기 데이터를 찾을 수 없습니다.');
      }

      const diaries: Diary[] = JSON.parse(storedDiaries);
      
      // 해당 ID의 일기가 존재하는지 확인
      const diaryExists = diaries.some(diary => diary.id === diaryId);
      if (!diaryExists) {
        throw new Error('삭제할 일기를 찾을 수 없습니다.');
      }

      // 해당 ID의 일기를 제거
      const updatedDiaries = diaries.filter(diary => diary.id !== diaryId);
      
      // 로컬스토리지에 업데이트된 일기 목록 저장
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      
      // 일기목록 페이지로 이동
      router.push('/diaries');
      
    } catch (error) {
      console.error('일기 삭제 중 오류가 발생했습니다:', error);
      // 에러 처리 로직 추가 가능 (토스트 메시지 등)
    } finally {
      setIsDeleting(false);
    }
  }, [diaryId, router]);

  /**
   * 모달을 여는 함수
   */
  const openModal = useCallback(() => {
    const modalContent = (
      <Modal
        variant="danger"
        actions="dual"
        title="일기 삭제"
        description="일기를 삭제 하시겠어요?"
        confirmText={isDeleting ? "삭제 중..." : "삭제"}
        cancelText="취소"
        onConfirm={() => {
          closeTopModal();
          deleteDiary();
        }}
        onCancel={() => {
          closeTopModal();
        }}
      />
    );
    
    openModalProvider(modalContent);
  }, [isDeleting, deleteDiary, openModalProvider, closeTopModal]);

  return {
    isDeleting,
    openModal,
  };
};

