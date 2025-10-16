'use client';

import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';

/**
 * useDiaryModalClose 훅
 * 
 * 일기쓰기 모달의 닫기 기능을 제공하는 커스텀 훅입니다.
 * - 닫기 버튼 클릭 시 등록취소 모달을 표시
 * - 등록취소 모달에서 계속작성/등록취소 선택 가능
 * - 2중 모달 구조로 구현 (일기쓰기 모달 위에 등록취소 모달 overlay)
 * 
 * @returns {Object} 모달 닫기 관련 핸들러 함수들
 * @returns {Function} returns.handleDiaryClose - 일기쓰기 모달 닫기 핸들러
 * @returns {Function} returns.openCancelModal - 등록취소 모달 열기 핸들러
 * @returns {Function} returns.handleCancelConfirm - 등록취소 모달의 등록취소 버튼 핸들러
 * @returns {Function} returns.handleCancelCancel - 등록취소 모달의 계속작성 버튼 핸들러
 * 
 * @example
 * ```tsx
 * const { handleDiaryClose } = useDiaryModalClose();
 * 
 * const handleClick = () => {
 *   handleDiaryClose();
 * };
 * ```
 */
export const useDiaryModalClose = () => {
  const { openModal, closeTopModal, closeAllModals } = useModal();

  /**
   * 등록취소 모달 열기
   * 일기쓰기 모달 위에 등록취소 모달을 2중 모달로 표시
   */
  const openCancelModal = () => {
    openModal(
      <Modal
        variant="info"
        actions="dual"
        title="등록을 취소하시겠습니까?"
        description="작성 중인 내용이 사라집니다."
        confirmText="등록취소"
        cancelText="계속작성"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
        className="cancel-modal"
      />
    );
  };

  /**
   * 등록취소 모달의 등록취소 버튼 핸들러
   * 등록취소 모달(자식)과 일기쓰기 모달(부모)을 모두 닫음
   */
  const handleCancelConfirm = () => {
    closeAllModals();
  };

  /**
   * 등록취소 모달의 계속작성 버튼 핸들러
   * 등록취소 모달(자식)만 닫고 일기쓰기 모달(부모)은 유지
   */
  const handleCancelCancel = () => {
    closeTopModal();
  };

  /**
   * 일기쓰기 모달 닫기 핸들러
   * 닫기 버튼 클릭 시 등록취소 모달을 표시
   */
  const handleDiaryClose = () => {
    openCancelModal();
  };

  return {
    handleDiaryClose,
    openCancelModal,
    handleCancelConfirm,
    handleCancelCancel,
  };
};

export default useDiaryModalClose;
