'use client';

import { useModal } from '@/commons/providers/modal/modal.provider';
import DiariesNew from '@/components/diaries-new';


/**
 * 일기쓰기 모달 Hook
 * 
 * 일기쓰기 모달을 관리하는 커스텀 훅입니다.
 * 
 * @example
 * ```tsx
 * const { openDiaryModal, closeDiaryModal } = useDiaryModal();
 * 
 * const handleWriteClick = () => {
 *   openDiaryModal();
 * };
 * ```
 */
export const useDiaryModal = () => {
  const { openModal, closeModal } = useModal();

  /**
   * 일기쓰기 모달 열기
   * 
   * DiariesNew 컴포넌트를 모달로 표시합니다.
   */
  const openDiaryModal = () => {
    const modalId = openModal(
        <DiariesNew />

    );
    
    return modalId;
  };

  /**
   * 일기쓰기 모달 닫기
   * 
   * @param modalId - 닫을 모달의 ID
   */
  const closeDiaryModal = (modalId: string) => {
    closeModal(modalId);
  };

  return {
    /**
     * 일기쓰기 모달 열기
     */
    openDiaryModal,
    
    /**
     * 일기쓰기 모달 닫기
     */
    closeDiaryModal,
  };
};

export default useDiaryModal;
