'use client';

import { useModal } from '@/commons/providers/modal/modal.provider';
import DiariesNew from '@/components/diaries-new';

/**
 * useDiaryModal 훅
 * 
 * 일기쓰기 모달 연결 기능을 제공하는 커스텀 훅입니다.
 * 모달 열기/닫기 기능을 통합하여 관리합니다.
 * 
 * @returns {Object} 모달 제어 함수들
 * @returns {Function} returns.openDiaryModal - 일기쓰기 모달을 여는 함수
 * @returns {Function} returns.closeDiaryModal - 일기쓰기 모달을 닫는 함수
 * 
 * @example
 * ```tsx
 * const { openDiaryModal, closeDiaryModal } = useDiaryModal();
 * 
 * const handleClick = () => {
 *   openDiaryModal();
 * };
 * ```
 */
export const useDiaryModal = () => {
  const { openModal, closeTopModal } = useModal();

  /**
   * 일기쓰기 모달을 여는 함수
   */
  const openDiaryModal = () => {
    openModal(<DiariesNew />);
  };

  /**
   * 일기쓰기 모달을 닫는 함수
   */
  const closeDiaryModal = () => {
    closeTopModal();
  };

  return {
    openDiaryModal,
    closeDiaryModal,
  };
};
