import { useRouter, usePathname } from 'next/navigation';
import { urlPaths } from '@/commons/constants/url';

/**
 * Layout Link Routing Hook
 * 네비게이션 메뉴의 액티브 상태 관리 및 페이지 이동 기능을 제공합니다.
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 현재 경로가 일기보관함(/diaries)인지 확인
   */
  const isDiariesActive = pathname === urlPaths.diariesList;

  /**
   * 현재 경로가 사진보관함(/pictures)인지 확인
   */
  const isPicturesActive = pathname === urlPaths.picturesList;

  /**
   * 일기보관함으로 이동
   */
  const navigateToDiaries = () => {
    router.push(urlPaths.diariesList);
  };

  /**
   * 사진보관함으로 이동
   */
  const navigateToPictures = () => {
    router.push(urlPaths.picturesList);
  };

  /**
   * 로고 클릭 시 일기목록 페이지로 이동
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
