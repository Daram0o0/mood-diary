'use client';

import { usePathname } from 'next/navigation';
import { 
  shouldShowHeader, 
  shouldShowHeaderLogo, 
  shouldShowBanner, 
  shouldShowNavigation, 
  shouldShowFooter 
} from '@/commons/constants/url';

/**
 * Layout Area Visibility Hook
 * 
 * 현재 경로에 따라 레이아웃 영역들의 표시 여부를 관리하는 훅입니다.
 * url.ts의 설정에 따라 header, banner, navigation, footer 영역의 
 * 표시/숨김을 제어합니다.
 * 
 * @returns {Object} 영역별 표시 여부 상태
 * @returns {boolean} returns.showHeader - 헤더 영역 표시 여부
 * @returns {boolean} returns.showHeaderLogo - 헤더 로고 표시 여부
 * @returns {boolean} returns.showBanner - 배너 영역 표시 여부
 * @returns {boolean} returns.showNavigation - 네비게이션 영역 표시 여부
 * @returns {boolean} returns.showFooter - 푸터 영역 표시 여부
 * 
 * @example
 * ```tsx
 * const { showHeader, showBanner, showNavigation, showFooter } = useAreaVisibility();
 * 
 * return (
 *   <div>
 *     {showHeader && <Header />}
 *     {showBanner && <Banner />}
 *     {showNavigation && <Navigation />}
 *     <main>{children}</main>
 *     {showFooter && <Footer />}
 *   </div>
 * );
 * ```
 */
export const useAreaVisibility = () => {
  const pathname = usePathname();

  /**
   * 현재 경로에 따른 헤더 영역 표시 여부
   * @returns {boolean} 헤더 영역 표시 여부
   */
  const showHeader = shouldShowHeader(pathname);

  /**
   * 현재 경로에 따른 헤더 로고 표시 여부
   * @returns {boolean} 헤더 로고 표시 여부
   */
  const showHeaderLogo = shouldShowHeaderLogo(pathname);

  /**
   * 현재 경로에 따른 배너 영역 표시 여부
   * @returns {boolean} 배너 영역 표시 여부
   */
  const showBanner = shouldShowBanner(pathname);

  /**
   * 현재 경로에 따른 네비게이션 영역 표시 여부
   * @returns {boolean} 네비게이션 영역 표시 여부
   */
  const showNavigation = shouldShowNavigation(pathname);

  /**
   * 현재 경로에 따른 푸터 영역 표시 여부
   * @returns {boolean} 푸터 영역 표시 여부
   */
  const showFooter = shouldShowFooter(pathname);

  return {
    showHeader,
    showHeaderLogo,
    showBanner,
    showNavigation,
    showFooter,
  };
};
