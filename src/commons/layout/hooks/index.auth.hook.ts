'use client';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useRouter } from 'next/navigation';
import { urlPaths } from '@/commons/constants/url';

/**
 * Layout Authentication Hook
 * 
 * 레이아웃에서 인증 상태에 따른 UI 표시를 관리하는 훅입니다.
 * 로그인 상태에 따라 로그인 버튼 또는 사용자 정보와 로그아웃 버튼을 표시합니다.
 * 
 * @returns {Object} 인증 상태 및 관련 함수들
 * @returns {boolean} returns.isAuthenticated - 로그인 여부
 * @returns {string | null} returns.userName - 로그인된 사용자 이름
 * @returns {Function} returns.handleLogin - 로그인 버튼 클릭 핸들러
 * @returns {Function} returns.handleLogout - 로그아웃 버튼 클릭 핸들러
 * 
 * @example
 * ```tsx
 * const { isAuthenticated, userName, handleLogin, handleLogout } = useLayoutAuth();
 * 
 * return (
 *   <div>
 *     {isAuthenticated ? (
 *       <div>
 *         <span>{userName}님</span>
 *         <button onClick={handleLogout}>로그아웃</button>
 *       </div>
 *     ) : (
 *       <button onClick={handleLogin}>로그인</button>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useLayoutAuth = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  /**
   * 로그인된 사용자 이름
   * @returns {string | null} 사용자 이름 또는 null
   */
  const userName = user?.name || null;

  /**
   * 로그인 버튼 클릭 핸들러
   * 로그인 페이지로 이동합니다.
   */
  const handleLogin = () => {
    router.push(urlPaths.authLogin);
  };

  /**
   * 로그아웃 버튼 클릭 핸들러
   * 로그아웃을 실행합니다.
   */
  const handleLogout = () => {
    logout();
  };

  return {
    isAuthenticated,
    userName,
    handleLogin,
    handleLogout,
  };
};
