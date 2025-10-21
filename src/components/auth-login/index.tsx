'use client';

import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { useLoginForm } from './hooks/index.form.hook';
import styles from './styles.module.css';

export interface AuthLoginProps {
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * AuthLogin 컴포넌트
 * 
 * 로그인 페이지의 메인 컴포넌트
 * 이메일, 비밀번호 입력 필드와 로그인 버튼을 포함
 * react-hook-form, zod, react-query를 사용하여 폼 관리 및 API 연동
 * 
 * @param {AuthLoginProps} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 CSS 클래스
 * 
 * @example
 * ```tsx
 * <AuthLogin />
 * ```
 */
const AuthLogin: React.FC<AuthLoginProps> = ({ className = '' }) => {
  const { form, handleSubmit, handleKeyDown, isSubmitting, isFormValid, errors } = useLoginForm();

  return (
    <div className={`${styles.wrapper} ${className}`} data-testid="auth-login-container">
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>계정에 로그인하여 일기를 작성해보세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              {...form.register('email')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              onKeyDown={handleKeyDown}
              className={styles.field}
              aria-label="이메일 입력"
              data-testid="email-input"
              required
              error={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              {...form.register('password')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              onKeyDown={handleKeyDown}
              className={styles.field}
              aria-label="비밀번호 입력"
              data-testid="password-input"
              required
              error={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              disabled={!isFormValid || isSubmitting}
              className={styles.submitButton}
              aria-label="로그인 버튼"
              data-testid="login-button"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>

        <div className={styles.navigation}>
          <p className={styles.navigationText}>
            아직 계정이 없으신가요?{' '}
            <a 
              href="/auth/signup" 
              className={styles.navigationLink}
              aria-label="회원가입 페이지로 이동"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

AuthLogin.displayName = 'AuthLogin';

export default AuthLogin;
