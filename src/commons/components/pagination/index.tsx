'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import styles from './styles.module.css';

export interface PaginationProps {
  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage: number;
  
  /**
   * 전체 페이지 수
   */
  totalPages: number;
  
  /**
   * 페이지 변경 핸들러
   */
  onPageChange: (page: number) => void;
  
  /**
   * 한 번에 표시할 페이지 버튼 수
   * @default 5
   */
  visiblePages?: number;
  
  /**
   * variant 타입
   * - primary: 주요 스타일
   * - secondary: 보조 스타일
   * - tertiary: 3차 스타일
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 크기
   * - small: 작은 크기
   * - medium: 중간 크기
   * - large: 큰 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 (light/dark)
   * 지정하지 않으면 시스템 테마를 따름
   */
  theme?: 'light' | 'dark';
  
  /**
   * 이전/다음 버튼 표시 여부
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * 커스텀 클래스명
   */
  className?: string;
}

/**
 * Pagination 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 페이지네이션 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 *   variant="primary"
 *   size="medium"
 * />
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 5,
  variant = 'primary',
  size = 'medium',
  theme,
  showArrows = true,
  className = '',
}: PaginationProps) {
  const { resolvedTheme } = useTheme();
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 페이지 번호 배열 생성
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    
    // 전체 페이지가 표시할 페이지 수보다 적으면 모두 표시
    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // 시작 페이지 계산
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    
    // 끝 페이지가 전체 페이지에 도달하면 시작 페이지 조정
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // 특정 페이지로 이동
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // 컨테이너 클래스명 조합
  const containerClasses = [
    styles.pagination,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  // 페이지 버튼 클래스명 생성
  const getPageButtonClasses = (page: number) => {
    return [
      styles.pageButton,
      page === currentPage && styles.active,
    ]
      .filter(Boolean)
      .join(' ');
  };
  
  // 화살표 버튼 클래스명 생성
  const getArrowButtonClasses = (disabled: boolean) => {
    return [
      styles.arrowButton,
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(' ');
  };
  
  return (
    <div className={containerClasses}>
      {/* 이전 버튼 */}
      {showArrows && (
        <button
          className={getArrowButtonClasses(currentPage === 1)}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          <Image
            src={currentPage === 1 ? '/icons/leftdisabled_outline_light_m.svg' : '/icons/leftenable_outline_light_m.svg'}
            alt="이전"
            width={24}
            height={24}
          />
        </button>
      )}
      
      {/* 페이지 번호 버튼들 */}
      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={getPageButtonClasses(page)}
            onClick={() => handlePageClick(page)}
            aria-label={`페이지 ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      
      {/* 다음 버튼 */}
      {showArrows && (
        <button
          className={getArrowButtonClasses(currentPage === totalPages)}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
        >
          <Image
            src={currentPage === totalPages ? '/icons/rightdisabled_outline_light_m.svg' : '/icons/rightenable_outline_light_m.svg'}
            alt="다음"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
}

