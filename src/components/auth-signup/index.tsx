'use client';

import { useState } from 'react';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직은 구현하지 않음 (요구사항에 따라 기능 구현 제외)
    console.log('회원가입 폼 제출:', formData);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>회원가입</h1>
        
        <form onSubmit={handleSubmit} className={styles.form} role="form" aria-label="회원가입 폼">
          <div className={styles.fieldGroup}>
            <Input
              type="email"
              name="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="이메일 입력"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="password"
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleInputChange}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="비밀번호 입력"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="password"
              name="confirmPassword"
              label="비밀번호 재입력"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="비밀번호 재입력"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              type="text"
              name="name"
              label="이름"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleInputChange}
              variant="primary"
              theme="light"
              size="medium"
              fullWidth
              className={styles.field}
              aria-label="이름 입력"
              required
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
            >
              회원가입
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
