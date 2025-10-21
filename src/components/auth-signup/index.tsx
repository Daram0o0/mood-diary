'use client';

import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { useSignupForm } from './hooks/index.form.hook';
import styles from './styles.module.css';

export interface AuthSignupProps {
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * 회원가입 폼 컴포넌트
 * 
 * 이메일, 비밀번호, 비밀번호 재입력, 이름 입력 필드와 회원가입 버튼을 포함한 회원가입 폼
 * 공통 컴포넌트 Input과 Button을 사용하여 일관된 디자인 적용
 * 
 * @param {AuthSignupProps} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 CSS 클래스
 * 
 * @example
 * ```tsx
 * <AuthSignup />
 * ```
 */
const AuthSignup: React.FC<AuthSignupProps> = ({ className = '' }) => {
  const { form, onSubmit, isLoading, isFormValid, errors } = useSignupForm();
  const { register } = form;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>회원가입</h1>
        
        <form onSubmit={onSubmit} className={styles.form} role="form" aria-label="회원가입 폼" data-testid="auth-signup-form">
          <div className={styles.fieldGroup}>
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              {...register('email')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="이메일 입력"
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
              {...register('password')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="비밀번호 입력"
              required
              error={!!errors.password}
              errorMessage={errors.password?.message}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="password"
              label="비밀번호 재입력"
              placeholder="비밀번호를 다시 입력하세요"
              {...register('passwordConfirm')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="비밀번호 재입력"
              required
              error={!!errors.passwordConfirm}
              errorMessage={errors.passwordConfirm?.message}
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="text"
              label="이름"
              placeholder="이름을 입력하세요"
              {...register('name')}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="이름 입력"
              required
              error={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.submitButton}
              aria-label="회원가입 버튼"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </Button>
          </div>
        </form>

        <div className={styles.navigation}>
          <p className={styles.navigationText}>
            이미 계정이 있으신가요?{' '}
            <a 
              href="/auth/login" 
              className={styles.navigationLink}
              aria-label="로그인 페이지로 이동"
            >
              로그인하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

AuthSignup.displayName = 'AuthSignup';

export default AuthSignup;
