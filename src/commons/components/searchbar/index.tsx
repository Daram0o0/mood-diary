'use client';

import { InputHTMLAttributes } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import styles from './styles.module.css';

export interface SearchbarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Searchbar variant 타입
   * - primary: 주요 검색바
   * - secondary: 보조 검색바
   * - tertiary: 3차 검색바
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Searchbar 크기
   * - small: 작은 크기
   * - medium: 중간 크기 (Figma 기준: 320x48)
   * - large: 큰 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 (light/dark)
   * 지정하지 않으면 시스템 테마를 따름
   */
  theme?: 'light' | 'dark';
  
  /**
   * 검색 아이콘 표시 여부
   */
  showSearchIcon?: boolean;
  
  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 검색 버튼 클릭 핸들러
   */
  onSearch?: (value: string) => void;
}

/**
 * Searchbar 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 검색바 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Searchbar 
 *   variant="primary" 
 *   size="medium"
 *   placeholder="검색어를 입력해 주세요."
 *   onSearch={(value) => console.log(value)}
 * />
 * ```
 */
export default function Searchbar({
  variant = 'primary',
  size = 'medium',
  theme,
  showSearchIcon = true,
  fullWidth = false,
  disabled = false,
  className = '',
  onSearch,
  ...props
}: SearchbarProps) {
  const { resolvedTheme } = useTheme();
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 검색 실행 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.currentTarget.value);
    }
    props.onKeyDown?.(e);
  };
  
  // 클래스명 조합
  const wrapperClasses = [
    styles.wrapper,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const containerClasses = [
    styles.searchbarContainer,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        {showSearchIcon && (
          <span className={styles.searchIcon}>
            <Image
              src="/icons/search_outline_light_m.svg"
              alt="검색"
              width={24}
              height={24}
            />
          </span>
        )}
        <input
          type="search"
          className={styles.searchbar}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    </div>
  );
}

