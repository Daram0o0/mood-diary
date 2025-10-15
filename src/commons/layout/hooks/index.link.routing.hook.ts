import { useRouter, usePathname } from 'next/navigation';
import { urlPaths } from '@/commons/constants/url';

/**
 * Layout Link Routing Hook
 * 
 * 네비게이션 메뉴의 액티브 상태 관리 및 페이지 이동 기능을 제공합니다.
 * 현재 경로에 따라 네비게이션 메뉴의 액티브 상태를 동적으로 관리하고,
 * 클릭 시 해당 페이지로 이동하는 기능을 제공합니다.
 * 
 * @returns {Object} 라우팅 관련 상태와 함수들
 * @returns {boolean} returns.isDiariesActive - 일기보관함 액티브 상태
 * @returns {boolean} returns.isPicturesActive - 사진보관함 액티브 상태
 * @returns {Function} returns.navigateToDiaries - 일기보관함으로 이동
 * @returns {Function} returns.navigateToPictures - 사진보관함으로 이동
 * @returns {Function} returns.navigateToHome - 홈(일기목록)으로 이동
 * 
 * @example
 * ```tsx
 * const {
 *   isDiariesActive,
 *   isPicturesActive,
 *   navigateToDiaries,
 *   navigateToPictures,
 *   navigateToHome,
 * } = useLinkRouting();
 * ```
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 현재 경로가 일기보관함(/diaries)인지 확인
   * @returns {boolean} 일기보관함 액티브 상태
   */
  const isDiariesActive = pathname === urlPaths.diariesList;

  /**
   * 현재 경로가 사진보관함(/pictures)인지 확인
   * @returns {boolean} 사진보관함 액티브 상태
   */
  const isPicturesActive = pathname === urlPaths.picturesList;

  /**
   * 일기보관함으로 이동
   * url.ts의 diariesList 경로를 사용하여 이동
   */
  const navigateToDiaries = () => {
    router.push(urlPaths.diariesList);
  };

  /**
   * 사진보관함으로 이동
   * url.ts의 picturesList 경로를 사용하여 이동
   */
  const navigateToPictures = () => {
    router.push(urlPaths.picturesList);
  };

  /**
   * 로고 클릭 시 일기목록 페이지로 이동
   * url.ts의 diariesList 경로를 사용하여 홈으로 이동
   */
  const navigateToHome = () => {
    router.push(urlPaths.diariesList);
  };

  return {
    isDiariesActive,
    isPicturesActive,
    navigateToDiaries,
    navigateToPictures,
    navigateToHome,
  };
};
