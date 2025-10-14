import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
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
          <div className={styles.navTab}>
            <span className={styles.navTabText}>일기보관함</span>
          </div>
          <div className={styles.navTabInactive}>
            <span className={styles.navTabTextInactive}>사진보관함</span>
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
