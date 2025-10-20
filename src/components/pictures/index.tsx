'use client';

import styles from './styles.module.css';

/**
 * Pictures 컴포넌트의 Props 인터페이스
 */
export interface PicturesProps {
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Pictures 컴포넌트
 * 
 * 사진 갤러리 페이지의 와이어프레임 구조를 제공합니다.
 * HTML과 flexbox를 활용하여 레이아웃을 구성합니다.
 * 
 * @param {PicturesProps} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * <Pictures />
 * <Pictures className="custom-class" />
 * ```
 */
const Pictures: React.FC<PicturesProps> = ({ className }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Gap 영역 1: 1168 x 32 */}
      <div className={styles.gap32}></div>
      
      {/* Filter 영역: 1168 x 48 */}
      <div className={styles.filterSection}>
        <div className={styles.filterContent}>
          필터 컨텐츠 영역
        </div>
      </div>
      
      {/* Gap 영역 2: 1168 x 42 */}
      <div className={styles.gap42}></div>
      
      {/* Main 영역: 1168 x auto */}
      <div className={styles.mainSection}>
        <div className={styles.mainContent}>
          메인 컨텐츠 영역
        </div>
      </div>
    </div>
  );
};

export default Pictures;
