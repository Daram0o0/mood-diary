import React from 'react';
import styles from './styles.module.css';

const Diaries: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gap}></div>
      
      <div className={styles.search}>
        {/* 검색 영역 */}
      </div>
      
      <div className={styles.gap}></div>
      
      <div className={styles.main}>
        {/* 메인 콘텐츠 영역 */}
      </div>
      
      <div className={styles.gap}></div>
      
      <div className={styles.pagination}>
        {/* 페이지네이션 영역 */}
      </div>
      
      <div className={styles.gap}></div>
    </div>
  );
};

export default Diaries;
