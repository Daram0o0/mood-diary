'use client';

import { useRouter } from 'next/navigation';
import { urlUtils } from '@/commons/constants/url';

/**
 * 일기 카드 링크 라우팅 훅
 * 
 * 일기 카드 클릭 시 상세 페이지로 이동하는 기능을 제공합니다.
 * url.ts의 페이지URL을 활용하여 하드코딩을 방지합니다.
 * 
 * @returns {Object} 링크 라우팅 관련 함수들
 * @returns {Function} returns.navigateToDiaryDetail - 일기 상세 페이지로 이동
 * @returns {Function} returns.handleDiaryCardClick - 일기 카드 클릭 핸들러
 * @returns {Function} returns.handleDeleteIconClick - 삭제 아이콘 클릭 핸들러
 * 
 * @example
 * ```tsx
 * const { handleDiaryCardClick, handleDeleteIconClick } = useLinkRouting();
 * 
 * return (
 *   <div 
 *     className={styles.diaryCard}
 *     onClick={() => handleDiaryCardClick(diary.id)}
 *   >
 *     <div 
 *       className={styles.closeIcon}
 *       onClick={(e) => handleDeleteIconClick(e)}
 *     >
 *       삭제 아이콘
 *     </div>
 *   </div>
 * );
 * ```
 */
export const useLinkRouting = () => {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동
   * 
   * @param {string | number} id - 일기 ID
   */
  const navigateToDiaryDetail = (id: string | number): void => {
    const detailPath = urlUtils.diary.detail(id);
    router.push(detailPath);
  };

  /**
   * 일기 카드 클릭 핸들러
   * 
   * 일기 카드 전체 영역을 클릭했을 때 상세 페이지로 이동합니다.
   * 삭제 아이콘 클릭은 제외됩니다.
   * 
   * @param {string | number} id - 일기 ID
   */
  const handleDiaryCardClick = (id: string | number): void => {
    navigateToDiaryDetail(id);
  };

  /**
   * 삭제 아이콘 클릭 핸들러
   * 
   * 삭제 아이콘 클릭 시 이벤트 전파를 중단하여 페이지 이동을 방지합니다.
   * 
   * @param {React.MouseEvent} event - 마우스 이벤트
   */
  const handleDeleteIconClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    // 삭제 로직은 추후 구현 예정
  };

  return {
    navigateToDiaryDetail,
    handleDiaryCardClick,
    handleDeleteIconClick,
  };
};
