'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import styles from './styles.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 variant 타입
   * - primary: 주요 액션 버튼
   * - secondary: 보조 액션 버튼
   * - tertiary: 3차 액션 버튼
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 버튼 크기
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
   * 버튼 내용
   */
  children: ReactNode;
  
  /**
   * 아이콘 (선택사항)
   */
  icon?: ReactNode;
  
  /**
   * 아이콘 위치
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
}

/**
 * Button 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 버튼 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium">
 *   클릭하기
 * </Button>
 * ```
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  theme,
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const { resolvedTheme } = useTheme();
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 클래스명 조합
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      <span className={styles.content}>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </button>
  );
}

