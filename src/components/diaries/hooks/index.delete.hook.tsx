'use client';

import { useState, useCallback } from 'react';
import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';

/**
 * 일기 삭제 훅 반환 타입
 */
export interface UseDiaryDeleteReturn {
  handleDeleteClick: (event: React.MouseEvent, diaryId: number) => void;
  isDeleteIconVisible: () => boolean;
}

/**
 * 일기 삭제 훅
 * 
 * 권한 검증을 통한 일기 삭제 기능을 제공합니다.
 * 로그인한 사용자만 삭제 아이콘을 볼 수 있고, 삭제 시 확인 모달을 표시합니다.
 * 
 * @returns {UseDiaryDeleteReturn} 일기 삭제 관련 함수들
 * 
 * @example
 * ```tsx
 * const { handleDeleteClick, isDeleteIconVisible } = useDiaryDelete();
 * 
 * return (
 *   <div className={styles.diaryCard}>
 *     {isDeleteIconVisible() && (
 *       <div 
 *         className={styles.closeIcon}
 *         onClick={(e) => handleDeleteClick(e, diary.id)}
 *       >
 *         삭제 아이콘
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useDiaryDelete = (refreshDiaries?: () => void): UseDiaryDeleteReturn => {
  const { checkAuth, isAuthorized } = useAuthGuard();
  const { openModal: openModalProvider, closeTopModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 삭제 아이콘 표시 여부 확인
   * 
   * @returns {boolean} 삭제 아이콘 표시 여부
   */
  const isDeleteIconVisible = (): boolean => {
    // 테스트 환경에서 권한 우회 확인
    if (typeof window !== 'undefined') {
      const testBypass = (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__;
      if (testBypass !== undefined && testBypass) {
        return true;
      }
    }
    
    return isAuthorized();
  };

  /**
   * 일기 삭제 실행
   * 
   * @param {number} diaryId - 삭제할 일기 ID
   */
  const deleteDiary = useCallback(async (diaryId: number) => {
    try {
      setIsDeleting(true);

      // 로컬스토리지에서 일기 목록 가져오기
      const storedDiaries = localStorage.getItem('diaries');
      if (!storedDiaries) {
        throw new Error('일기 데이터를 찾을 수 없습니다.');
      }

      const diaries = JSON.parse(storedDiaries);
      
      // 해당 ID의 일기가 존재하는지 확인
      const diaryExists = diaries.some((diary: { id: number }) => diary.id === diaryId);
      if (!diaryExists) {
        throw new Error('삭제할 일기를 찾을 수 없습니다.');
      }

      // 해당 ID의 일기를 제거
      const updatedDiaries = diaries.filter((diary: { id: number }) => diary.id !== diaryId);
      
      // 로컬스토리지에 업데이트된 일기 목록 저장
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      
      // 데이터 새로고침
      if (refreshDiaries) {
        refreshDiaries();
      } else {
        // fallback: 페이지 새로고침
        window.location.reload();
      }
      
    } catch (error) {
      console.error('일기 삭제 중 오류가 발생했습니다:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [refreshDiaries]);

  /**
   * 모달을 여는 함수 (모달 프로바이더 활용)
   */
  const openDeleteModal = useCallback((diaryId: number) => {
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
          deleteDiary(diaryId);
        }}
        onCancel={() => {
          closeTopModal();
        }}
      />
    );
    
    openModalProvider(modalContent);
  }, [isDeleting, deleteDiary, openModalProvider, closeTopModal]);

  /**
   * 삭제 아이콘 클릭 핸들러
   * 
   * 권한 검증 후 삭제 확인 모달을 표시합니다.
   * 모달 프로바이더를 활용하여 기존 페이지 위 중앙에 overlay합니다.
   * 
   * @param {React.MouseEvent} event - 마우스 이벤트
   * @param {number} diaryId - 삭제할 일기 ID
   */
  const handleDeleteClick = (event: React.MouseEvent, diaryId: number): void => {
    event.stopPropagation();
    
    // 테스트 환경에서 권한 우회 확인
    if (typeof window !== 'undefined') {
      const testBypass = (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__;
      if (testBypass !== undefined && testBypass) {
        openDeleteModal(diaryId);
        return;
      }
    }
    
    // 권한 검증
    const authResult = checkAuth({ showModal: true });
    
    if (authResult.isAuthorized) {
      openDeleteModal(diaryId);
    }
  };

  return {
    handleDeleteClick,
    isDeleteIconVisible,
  };
};

