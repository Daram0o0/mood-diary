import React from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {/* Header content */}
      </header>
      
      <div className={styles.gap}></div>
      
      <div className={styles.banner}>
        {/* Banner content */}
      </div>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        {/* Navigation content */}
      </nav>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;
