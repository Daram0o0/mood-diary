'use client';

import { useCallback, useEffect, ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provider';
import { isMemberOnly, urlPaths } from '@/commons/constants/url';
import Modal from '@/commons/components/modal';

/**
 * AuthGuard 컴포넌트 Props
 */
export interface AuthGuardProps {
  /**
   * 자식 컴포넌트
   */
  children: ReactNode;
}

/**
 * AuthGuard 컴포넌트
 * 
 * 페이지 접근 권한을 검증하고 인증이 필요한 페이지에 대해 로그인 모달을 표시합니다.
 * - 페이지 로드 후 인가를 진행
 * - 인가 성공 시 children을 표시
 * - 인가 실패 시 로그인 모달 표시
 * - 테스트 환경과 실제 환경을 구분하여 처리
 * 
 * @param {AuthGuardProps} props - 컴포넌트 props
 * @param {ReactNode} props.children - 자식 요소
 * 
 * @example
 * ```tsx
 * <AuthGuard>
 *   <ProtectedPage />
 * </AuthGuard>
 * ```
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  // 인가 상태 관리
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [hasShownModal, setHasShownModal] = useState<boolean>(false);

  /**
   * 테스트 환경 여부 확인
   * @returns 테스트 환경 여부
   */
  const isTestEnvironment = () => {
    // 핵심요구사항 1-4: NEXT_PUBLIC_TEST_ENV 또는 NODE_ENV로 테스트 환경을 식별
    if (process.env.NEXT_PUBLIC_TEST_ENV === 'test') return true;
    if (process.env.NODE_ENV === 'test') return true;
    
    // 브라우저 환경에서 테스트 우회 확인
    if (typeof window !== 'undefined') {
      const testBypass = (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__;
      if (testBypass !== undefined && testBypass) {
        return true;
      }
    }
    
    return false;
  };

  /**
   * 현재 페이지가 회원 전용 페이지인지 확인
   * @returns 회원 전용 페이지 여부
   */
  const isCurrentPageMemberOnly = useCallback(() => {
    return isMemberOnly(pathname);
  }, [pathname]);

  /**
   * 로그인 모달 표시
   * @returns void
   */
  const showLoginModal = useCallback(() => {
    if (hasShownModal) return; // 이미 모달을 보여준 경우 중복 방지
    
    openModal(
      <Modal
        variant="info"
        actions="single"
        title="로그인이 필요합니다"
        description="이 페이지에 접근하려면 로그인이 필요합니다."
        onConfirm={() => {
          // 모든 모달 닫기
          closeAllModals();
          // 로그인 페이지로 이동
          router.push(urlPaths.authLogin);
        }}
      />
    );
    
    setHasShownModal(true);
  }, [hasShownModal, openModal, closeAllModals, router]);

  /**
   * 인가 처리
   * @returns void
   */
  const handleAuthorization = useCallback(() => {
    try {
      // 테스트 환경인 경우 항상 인가
      if (isTestEnvironment()) {
        setIsAuthorized(true);
        setIsInitialized(true);
        return;
      }

      // 실제 환경에서의 인가 처리
      const isLoggedIn = checkAuthStatus();
      const isPageMemberOnly = isCurrentPageMemberOnly();

      // 회원 전용 페이지가 아닌 경우 항상 인가
      if (!isPageMemberOnly) {
        setIsAuthorized(true);
        setIsInitialized(true);
        return;
      }

      // 회원 전용 페이지인 경우 로그인 상태 확인
      if (isPageMemberOnly) {
        if (isLoggedIn) {
          // 로그인된 경우 인가
          setIsAuthorized(true);
          setIsInitialized(true);
        } else {
          // 로그인되지 않은 경우 인가 거부 및 모달 표시
          setIsAuthorized(false);
          setIsInitialized(true);
          showLoginModal();
        }
      }
    } catch (error) {
      // 에러 발생 시 로그 출력 및 기본 인가 거부
      console.error('AuthGuard 인가 처리 중 오류 발생:', error);
      setIsAuthorized(false);
      setIsInitialized(true);
    }
  }, [checkAuthStatus, showLoginModal, isCurrentPageMemberOnly]);

  /**
   * 경로 변경 시 인가 상태 초기화
   */
  useEffect(() => {
    setIsAuthorized(false);
    setIsInitialized(false);
    setHasShownModal(false);
  }, [pathname]);

  /**
   * 인가 처리 실행
   */
  useEffect(() => {
    // AuthProvider 초기화 후 인가 진행
    const timer = setTimeout(() => {
      handleAuthorization();
    }, 100); // AuthProvider 초기화를 위한 짧은 지연

    return () => clearTimeout(timer);
  }, [pathname, isAuthenticated, handleAuthorization]);

  /**
   * 로딩 상태 표시 (인가 진행 중)
   */
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite" data-testid="auth-guard-loading">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-gray-600" aria-label="페이지 권한을 확인하는 중입니다">페이지를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  /**
   * 인가 실패 시 빈 화면 표시
   */
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite" data-testid="auth-guard-unauthorized">
        <div className="text-center">
          <p className="text-gray-600" aria-label="접근 권한을 확인하는 중입니다">접근 권한을 확인하는 중...</p>
        </div>
      </div>
    );
  }

  /**
   * 인가 성공 시 children 표시
   */
  return <>{children}</>;
};

export default AuthGuard;