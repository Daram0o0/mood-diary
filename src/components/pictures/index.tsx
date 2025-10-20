'use client';

import { useState } from 'react';
import Image from 'next/image';
import Selectbox from '@/commons/components/selectbox';
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
 * 강아지 사진 Mock 데이터 타입
 */
interface DogImage {
  id: string;
  src: string;
  alt: string;
}

/**
 * Pictures 컴포넌트
 * 
 * 피그마 디자인 기반의 강아지 사진 갤러리 컴포넌트
 * 필터 기능과 flex 레이아웃을 제공합니다.
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
  const [selectedFilter, setSelectedFilter] = useState('default');

  // Mock 데이터: 모든 사진을 dog-1.jpg로 통일
  const dogImages: DogImage[] = Array.from({ length: 10 }, (_, index) => ({
    id: `dog-${index + 1}`,
    src: '/images/dog-1.jpg',
    alt: `강아지 사진 ${index + 1}`,
  }));

  // 필터 옵션
  const filterOptions = [
    { value: 'default', label: '기본' },
    { value: 'recent', label: '최신순' },
    { value: 'popular', label: '인기순' },
  ];

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Gap 영역 1: 1168 x 32 */}
      <div className={styles.gap32}></div>
      
      {/* Filter 영역: 1168 x 48 */}
      <div className={styles.filterSection}>
        <div className={styles.filterContent}>
          <Selectbox
            variant="primary"
            size="large"
            theme="light"
            options={filterOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            className={styles.filterSelectbox}
          />
        </div>
      </div>
      
      {/* Gap 영역 2: 1168 x 42 */}
      <div className={styles.gap42}></div>
      
      {/* Main 영역: 1168 x auto */}
      <div className={styles.mainSection}>
        <div className={styles.mainContent}>
          <div className={styles.imageFlex}>
            {dogImages.map((image) => (
              <div key={image.id} className={styles.imageItem}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={640}
                  height={640}
                  className={styles.dogImage}
                  priority={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pictures;
