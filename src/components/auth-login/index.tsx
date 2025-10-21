'use client';

import { useState } from 'react';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

/**
 * AuthLogin 컴포넌트
 * 
 * 로그인 페이지의 메인 컴포넌트
 * 이메일, 비밀번호 입력 필드와 로그인 버튼을 포함
 * 
 * @example
 * ```tsx
 * <AuthLogin />
 * ```
 */
export default function AuthLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // 로그인 기능은 구현하지 않음 (UI만 구현)
    console.log('로그인 시도:', { email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>계정에 로그인하여 일기를 작성해보세요</p>
        </div>

        <form className={styles.form}>
          <div className={styles.fieldGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleEmailChange}
              className={styles.field}
              aria-label="이메일 입력"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              className={styles.field}
              aria-label="비밀번호 입력"
              required
            />
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              theme="light"
              size="medium"
              onClick={handleLogin}
              className={styles.submitButton}
              aria-label="로그인 버튼"
            >
              로그인
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.signupText}>
            아직 계정이 없으신가요?{' '}
            <a href="/auth/signup" className={styles.signupLink}>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
