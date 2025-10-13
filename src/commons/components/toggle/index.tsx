'use client';

import { InputHTMLAttributes, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import styles from './styles.module.css';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /**
   * 토글 variant 타입
   * - primary: 주요 토글 (녹색)
   * - secondary: 보조 토글 (파란색)
   * - tertiary: 3차 토글 (회색)
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 토글 크기
   * - small: 작은 크기 (48x26)
   * - medium: 중간 크기 (58x32) - Figma 기본
   * - large: 큰 크기 (68x38)
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 (light/dark)
   * 지정하지 않으면 시스템 테마를 따름
   */
  theme?: 'light' | 'dark';
  
  /**
   * 체크 상태
   */
  checked?: boolean;
  
  /**
   * 기본 체크 상태 (비제어 컴포넌트용)
   */
  defaultChecked?: boolean;
  
  /**
   * 상태 변경 핸들러
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 레이블 (선택사항)
   */
  label?: string;
  
  /**
   * 레이블 위치
   */
  labelPosition?: 'left' | 'right';
}

/**
 * Toggle 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 토글 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Toggle 
 *   variant="primary" 
 *   size="medium"
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="알림 받기"
 * />
 * ```
 */
export default function Toggle({
  variant = 'primary',
  size = 'medium',
  theme,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  className = '',
  ...props
}: ToggleProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // 비제어 컴포넌트를 위한 내부 상태
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  
  // 제어/비제어 컴포넌트 판별
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  
  // 마운트 확인 (hydration 이슈 방지)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = mounted ? (theme || resolvedTheme || 'light') : 'light';
  
  // 체크 상태 변경 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    
    // 비제어 컴포넌트인 경우 내부 상태 업데이트
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    // onChange 콜백 호출
    onChange?.(newChecked);
  };
  
  // 클래스명 조합
  const toggleClasses = [
    styles.toggle,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    isChecked && styles.checked,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const toggleContent = (
    <label className={toggleClasses}>
      <input
        type="checkbox"
        className={styles.input}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span className={styles.track}>
        <span className={styles.spacer} />
        <span className={styles.thumb} />
      </span>
    </label>
  );
  
  // 레이블이 있는 경우
  if (label) {
    const labelClasses = [
      styles.labelWrapper,
      styles[`label-${labelPosition}`],
      disabled && styles.labelDisabled,
    ]
      .filter(Boolean)
      .join(' ');
    
    return (
      <div className={labelClasses}>
        {labelPosition === 'left' && (
          <span className={styles.labelText}>{label}</span>
        )}
        {toggleContent}
        {labelPosition === 'right' && (
          <span className={styles.labelText}>{label}</span>
        )}
      </div>
    );
  }
  
  return toggleContent;
}

