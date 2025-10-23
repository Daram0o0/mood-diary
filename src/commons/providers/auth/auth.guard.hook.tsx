'use client';

import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provider';
import { useRouter } from 'next/navigation';
import { urlPaths } from '@/commons/constants/url';
import Modal from '@/commons/components/modal';

/**
 * 권한 검증 결과 타입
 */
export interface GuardResult {
  /**
   * 권한 검증 통과 여부
   */
  isAuthorized: boolean;
  /**
   * 권한 검증 실패 사유
   */
  reason?: string;
}

/**
 * 권한 검증 옵션
 */
export interface GuardOptions {
  /**
   * 테스트 환경에서 권한 검증 우회 여부
   */
  bypassInTest?: boolean;
  /**
   * 권한 검증 실패 시 모달 표시 여부
   */
  showModal?: boolean;
}

/**
 * Auth Guard Hook
 * 
 * 권한 검증을 위한 커스텀 훅입니다.
 * 로그인 상태를 확인하고, 권한이 없는 경우 적절한 처리를 수행합니다.
 * 
 * @example
 * ```tsx
 * const { checkAuth, isAuthorized } = useAuthGuard();
 * 
 * const handleProtectedAction = () => {
 *   if (checkAuth()) {
 *     // 권한이 있는 경우 실행할 로직
 *   }
 * };
 * ```
 */
export const useAuthGuard = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { openModal, closeAllModals } = useModal();
  const router = useRouter();

  /**
   * 테스트 환경 확인
   */
  const isTestEnvironment = () => {
    // Playwright 테스트 환경 감지
    return typeof window !== 'undefined' && 
           (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ !== undefined;
  };

  /**
   * 테스트 환경에서 권한 검증 우회 여부 확인
   */
  const shouldBypassAuth = () => {
    if (typeof window === 'undefined') return false;
    
    // 테스트 환경이고 전역 변수가 설정된 경우
    if (isTestEnvironment() && (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__) {
      return true;
    }
    
    return false;
  };

  /**
   * 로그인 모달 표시
   */
  const showLoginModal = () => {
    const modalId = openModal(
      <Modal
        variant="info"
        actions="dual"
        title="로그인이 필요합니다"
        description={"계속 진행하려면 로그인이 필요합니다.\n로그인하시겠습니까?"}
        onConfirm={() => {
          closeAllModals();
          router.push(urlPaths.authLogin);
        }}
        onCancel={() => {
          closeAllModals();
        }}
        confirmText="로그인하러가기"
        cancelText="취소"
      />
    );
    
    return modalId;
  };

  /**
   * 권한 검증 실행
   * 
   * @param options - 권한 검증 옵션
   * @returns 권한 검증 결과
   */
  const checkAuth = (options: GuardOptions = {}): GuardResult => {
    const { bypassInTest = false, showModal = true } = options;

    // 테스트 환경에서 우회 설정이 활성화된 경우
    if (bypassInTest && shouldBypassAuth()) {
      return {
        isAuthorized: true,
      };
    }

    // 실제 환경에서는 항상 권한 검증 수행
    // 테스트 환경에서도 bypassInTest가 false인 경우 권한 검증 수행
    const isLoggedIn = checkAuthStatus();

    if (!isLoggedIn) {
      // 권한 검증 실패 시 모달 표시
      if (showModal) {
        showLoginModal();
      }

      return {
        isAuthorized: false,
        reason: '로그인이 필요합니다.',
      };
    }

    return {
      isAuthorized: true,
    };
  };

  /**
   * 회원 전용 기능 권한 검증
   * 
   * @param options - 권한 검증 옵션
   * @returns 권한 검증 결과
   */
  const checkMemberOnlyAccess = (options: GuardOptions = {}): GuardResult => {
    return checkAuth(options);
  };

  /**
   * 현재 로그인 상태 확인
   * 
   * @returns 로그인 여부
   */
  const isAuthorized = (): boolean => {
    return isAuthenticated;
  };

  /**
   * 권한 검증이 필요한 액션 실행
   * 
   * @param action - 실행할 액션 함수
   * @param options - 권한 검증 옵션
   * @returns 액션 실행 결과 또는 null
   */
  const executeWithAuth = <T,>(
    action: () => T,
    options: GuardOptions = {}
  ): T | null => {
    const result = checkAuth(options);
    
    if (result.isAuthorized) {
      return action();
    }
    
    return null;
  };

  /**
   * 비동기 권한 검증이 필요한 액션 실행
   * 
   * @param action - 실행할 비동기 액션 함수
   * @param options - 권한 검증 옵션
   * @returns 액션 실행 결과 또는 null
   */
  const executeWithAuthAsync = async <T,>(
    action: () => Promise<T>,
    options: GuardOptions = {}
  ): Promise<T | null> => {
    const result = checkAuth(options);
    
    if (result.isAuthorized) {
      return await action();
    }
    
    return null;
  };

  return {
    /**
     * 권한 검증 실행
     */
    checkAuth,
    
    /**
     * 회원 전용 기능 권한 검증
     */
    checkMemberOnlyAccess,
    
    /**
     * 현재 로그인 상태 확인
     */
    isAuthorized,
    
    /**
     * 권한 검증이 필요한 액션 실행
     */
    executeWithAuth,
    
    /**
     * 비동기 권한 검증이 필요한 액션 실행
     */
    executeWithAuthAsync,
  };
};

export default useAuthGuard;
