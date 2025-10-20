'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Selectbox from '@/commons/components/selectbox';
import { useDogImages, DogImage } from './hooks/index.binding.hook';
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
 * 스플래시 스크린 컴포넌트 (스켈레톤 애니메이션)
 * 
 * 로딩 중에 표시되는 스플래시 스크린
 * 회색 배경에 두꺼운 흰 세로줄 1개가 우측 30도 기울어져서 빠르게 움직입니다.
 * 스켈레톤 애니메이션으로 부드럽게 퍼져보이는 효과를 제공합니다.
 */
const SplashScreen: React.FC = () => {
  return (
    <div className={styles.splashScreen} data-testid="splash-screen">
      <div className={styles.splashLine}></div>
    </div>
  );
};

/**
 * Pictures 컴포넌트
 * 
 * 피그마 디자인 기반의 강아지 사진 갤러리 컴포넌트
 * Dog CEO API를 사용하여 실제 강아지 사진을 무한스크롤로 표시합니다.
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // 강아지 이미지 데이터 조회
  const {
    data: dogImages,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDogImages();

  // 무한스크롤 옵저버 설정
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      }, {
        threshold: 0.1,
        rootMargin: '100px'
      });
      
      if (node && observerRef.current) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // 필터 옵션
  const filterOptions = [
    { value: 'default', label: '기본' },
    { value: 'recent', label: '최신순' },
    { value: 'popular', label: '인기순' },
  ];

  return (
    <div className={`${styles.container} ${className || ''}`} data-testid="pictures-container">
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
          {/* 로딩 중일 때 스플래시 스크린 표시 */}
          {isLoading && (
            <div className={styles.imageFlex}>
              {Array.from({ length: 6 }, (_, index) => (
                <div key={`splash-${index}`} className={styles.imageItem}>
                  <SplashScreen />
                </div>
              ))}
            </div>
          )}
          
          {/* 에러 상태 */}
          {isError && (
            <div className={styles.errorMessage}>
              <p>강아지 사진을 불러오는데 실패했습니다.</p>
              <p>{error?.message}</p>
            </div>
          )}
          
          {/* 강아지 이미지 목록 */}
          {!isLoading && !isError && dogImages && (
            <div className={styles.imageFlex}>
              {dogImages.map((image: DogImage, index: number) => {
                // 마지막 2개 이미지에 무한스크롤 옵저버 연결
                const isLastTwo = index >= dogImages.length - 2;
                return (
                  <div
                    key={image.id}
                    className={styles.imageItem}
                    ref={isLastTwo ? lastImageElementRef : null}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={640}
                      height={640}
                      className={styles.dogImage}
                      priority={index < 6} // 첫 6개 이미지는 우선 로딩
                    />
                  </div>
                );
              })}
              
              {/* 다음 페이지 로딩 중일 때 추가 스플래시 스크린 */}
              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={`next-splash-${index}`} className={styles.imageItem}>
                      <SplashScreen />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pictures;
