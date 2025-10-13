'use client';

import { InputHTMLAttributes } from 'react';
import { useTheme } from 'next-themes';
import styles from './styles.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input variant 타입
   * - primary: 주요 입력 필드
   * - secondary: 보조 입력 필드
   * - tertiary: 3차 입력 필드
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Input 크기
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
   * 에러 상태
   */
  error?: boolean;
  
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  
  /**
   * 레이블
   */
  label?: string;
  
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
 * Input 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 입력 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Input 
 *   variant="primary" 
 *   size="medium"
 *   placeholder="회고를 남겨보세요."
 * />
 * ```
 */
export default function Input({
  variant = 'primary',
  size = 'medium',
  theme,
  error = false,
  errorMessage,
  label,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: InputProps) {
  const { resolvedTheme } = useTheme();
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 클래스명 조합
  const wrapperClasses = [
    styles.wrapper,
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');
  
  const inputClasses = [
    styles.input,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    error && styles.error,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={wrapperClasses}>
      {label && (
        <label className={`${styles.label} ${styles[`theme-${currentTheme}`]}`}>
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
      {error && errorMessage && (
        <span className={`${styles.errorMessage} ${styles[`theme-${currentTheme}`]}`}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

