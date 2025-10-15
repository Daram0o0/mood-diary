'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';

export interface LayoutProps {
  /**
   * 레이아웃 내부에 표시될 자식 컴포넌트
   */
  children: React.ReactNode;
}

/**
 * Layout 컴포넌트
 * 
 * 애플리케이션의 전체 레이아웃을 담당하는 컴포넌트입니다.
 * 헤더, 배너, 네비게이션, 메인 콘텐츠, 푸터 영역을 포함하며,
 * 네비게이션 메뉴의 액티브 상태 관리 및 페이지 이동 기능을 제공합니다.
 * 
 * @param {LayoutProps} props - Layout 컴포넌트 props
 * @param {React.ReactNode} props.children - 레이아웃 내부에 표시될 자식 컴포넌트
 * 
 * @example
 * ```tsx
 * <Layout>
 *   <div>페이지 콘텐츠</div>
 * </Layout>
 * ```
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    isDiariesActive,
    isPicturesActive,
    navigateToDiaries,
    navigateToPictures,
    navigateToHome,
  } = useLinkRouting();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={navigateToHome} data-testid="header-logo">
          <span className={styles.logoText}>민지의 다이어리</span>
        </div>
      </header>
      
      <div className={styles.banner}>
        <Image
          src="/images/banner.png"
          alt="배너 이미지"
          width={1168}
          height={240}
          className={styles.bannerImage}
        />
      </div>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <div 
            className={isDiariesActive ? styles.navTab : styles.navTabInactive}
            onClick={navigateToDiaries}
            data-testid="nav-diaries"
          >
            <span className={isDiariesActive ? styles.navTabText : styles.navTabTextInactive}>
              일기보관함
            </span>
          </div>
          <div 
            className={isPicturesActive ? styles.navTab : styles.navTabInactive}
            onClick={navigateToPictures}
            data-testid="nav-pictures"
          >
            <span className={isPicturesActive ? styles.navTabText : styles.navTabTextInactive}>
              사진보관함
            </span>
          </div>
        </div>
      </nav>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTitle}>민지의 다이어리</div>
          <div className={styles.footerInfo}>대표 : 민지</div>
          <div className={styles.footerCopyright}>Copyright © 2024. 민지 Co., Ltd.</div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
