'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import styles from './styles.module.css';
import Image from 'next/image';

export interface SelectboxOption {
  /**
   * 옵션 값
   */
  value: string;
  
  /**
   * 옵션 레이블
   */
  label: string;
  
  /**
   * 비활성화 여부
   */
  disabled?: boolean;
}

export interface SelectboxProps {
  /**
   * Selectbox variant 타입
   * - primary: 주요 선택 필드
   * - secondary: 보조 선택 필드
   * - tertiary: 3차 선택 필드
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Selectbox 크기
   * - small: 작은 크기 (32px)
   * - medium: 중간 크기 (40px)
   * - large: 큰 크기 (48px)
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 (light/dark)
   * 지정하지 않으면 시스템 테마를 따름
   */
  theme?: 'light' | 'dark';
  
  /**
   * 선택 옵션 목록
   */
  options: SelectboxOption[];
  
  /**
   * 선택된 값
   */
  value?: string;
  
  /**
   * 값 변경 핸들러
   */
  onChange?: (value: string) => void;
  
  /**
   * 플레이스홀더
   */
  placeholder?: string;
  
  /**
   * 레이블
   */
  label?: string;
  
  /**
   * 에러 상태
   */
  error?: boolean;
  
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  
  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * Selectbox 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 선택 컴포넌트
 * variant, size, theme를 조합하여 다양한 스타일 지원
 * 
 * @example
 * ```tsx
 * <Selectbox 
 *   variant="primary" 
 *   size="medium"
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'option1', label: '옵션1' },
 *   ]}
 *   placeholder="선택하세요"
 * />
 * ```
 */
export default function Selectbox({
  variant = 'primary',
  size = 'medium',
  theme,
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  error = false,
  errorMessage,
  fullWidth = false,
  disabled = false,
  className = '',
}: SelectboxProps) {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownId = `selectbox-dropdown-${Math.random().toString(36).substr(2, 9)}`;
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 선택된 옵션 찾기
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  
  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 옵션 선택 핸들러
  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    setIsOpen(false);
    
    if (onChange) {
      onChange(optionValue);
    }
  };
  
  // 토글 핸들러
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (isOpen) {
        setIsOpen(false);
      }
    }
  };
  
  // 클래스명 조합
  const wrapperClasses = [
    styles.wrapper,
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');
  
  const selectboxClasses = [
    styles.selectbox,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    error && styles.error,
    disabled && styles.disabled,
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const dropdownClasses = [
    styles.dropdown,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${currentTheme}`],
    isOpen && styles.open,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={wrapperClasses} ref={containerRef}>
      {label && (
        <label className={`${styles.label} ${styles[`theme-${currentTheme}`]}`}>
          {label}
        </label>
      )}
      
      <div
        className={selectboxClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <span className={`${styles.displayText} ${!selectedOption && styles.placeholder}`}>
          {displayText}
        </span>
        <span className={`${styles.arrow} ${isOpen && styles.arrowOpen}`}>
          <Image
            src="/icons/arrow_drop_down.svg"
            alt="dropdown arrow"
            width={0}
            height={0}
            className={styles.arrowIcon}
          />
        </span>
      </div>
      
      {isOpen && (
        <ul id={dropdownId} className={dropdownClasses} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                option.value === selectedValue ? styles.selected : ''
              } ${option.disabled ? styles.optionDisabled : ''}`}
              onClick={() => !option.disabled && handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {option.value === selectedValue && (
                <Image
                  src="/icons/check_outline_light_xs.svg"
                  alt="selected"
                  width={16}
                  height={16}
                  className={styles.checkIcon}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      
      {error && errorMessage && (
        <span className={`${styles.errorMessage} ${styles[`theme-${currentTheme}`]}`}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

