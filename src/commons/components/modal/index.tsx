'use client';

import { useTheme } from 'next-themes';
import Button from '../button';
import styles from './styles.module.css';

export interface ModalProps {
  /**
   * 모달 variant 타입
   * - info: 정보성 모달 (파란색 계열)
   * - danger: 경고성 모달 (빨간색 계열)
   */
  variant?: 'info' | 'danger';
  
  /**
   * 액션 버튼 개수
   * - single: 확인 버튼 하나
   * - dual: 취소/확인 버튼 두 개
   */
  actions?: 'single' | 'dual';
  
  /**
   * 테마 (light/dark)
   * 지정하지 않으면 시스템 테마를 따름
   */
  theme?: 'light' | 'dark';
  
  /**
   * 모달 제목
   */
  title: string;
  
  /**
   * 모달 내용
   */
  description: string;
  
  /**
   * 확인 버튼 텍스트
   */
  confirmText?: string;
  
  /**
   * 취소 버튼 텍스트 (dual 액션일 때만 사용)
   */
  cancelText?: string;
  
  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm?: () => void;
  
  /**
   * 취소 버튼 클릭 핸들러 (dual 액션일 때만 사용)
   */
  onCancel?: () => void;
  
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * Modal 컴포넌트
 * 
 * Figma 디자인 기반의 재사용 가능한 모달 컴포넌트
 * variant, actions, theme를 조합하여 다양한 스타일 지원
 * modal.provider와 함께 사용하여 backdrop은 provider에서 처리
 * 
 * @example
 * ```tsx
 * <Modal
 *   variant="info"
 *   actions="single"
 *   title="일기 등록 완료"
 *   description="등록이 완료 되었습니다."
 *   confirmText="확인"
 *   onConfirm={() => console.log('확인')}
 * />
 * ```
 */
export default function Modal({
  variant = 'info',
  actions = 'single',
  theme,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  className = '',
}: ModalProps) {
  const { resolvedTheme } = useTheme();
  
  // theme prop이 있으면 사용, 없으면 시스템 테마 사용
  const currentTheme = theme || resolvedTheme || 'light';
  
  // 클래스명 조합
  const modalClasses = [
    styles.modal,
    styles[`variant-${variant}`],
    styles[`actions-${actions}`],
    styles[`theme-${currentTheme}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={modalClasses} data-testid={className.includes('cancel-modal') ? 'cancel-modal' : 'modal'}>
      {/* 모달 헤더 영역 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      
      {/* 모달 액션 영역 */}
      <div className={styles.actions}>
        {actions === 'single' ? (
          // Single Action: 확인 버튼 하나 (전체 너비)
          <Button
            variant="primary"
            size="medium"
            theme="light"
            fullWidth
            onClick={onConfirm}
            className={styles.singleButton}
          >
            {confirmText}
          </Button>
        ) : (
          // Dual Action: 취소/확인 버튼 두 개 (각각 104px 고정)
          <>
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              onClick={onCancel}
              className={styles.dualButton}
              data-testid="continue-button"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              size="medium"
              theme="light"
              onClick={onConfirm}
              className={styles.dualButton}
              data-testid="cancel-button"
            >
              {confirmText}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
