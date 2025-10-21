'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { urlPaths } from '@/commons/constants/url';

/**
 * 사용자 정보 타입 정의
 */
export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * 인증 컨텍스트 타입 정의
 */
export interface AuthContextType {
  /**
   * 로그인 상태
   */
  isAuthenticated: boolean;
  
  /**
   * 로그인된 사용자 정보
   */
  user: User | null;
  
  /**
   * 로그인 함수
   * @param user - 로그인할 사용자 정보
   * @param accessToken - 액세스 토큰
   */
  login: (user: User, accessToken: string) => void;
  
  /**
   * 로그아웃 함수
   */
  logout: () => void;
  
  /**
   * 로그인 상태 확인 함수
   * @returns 로그인 여부
   */
  checkAuthStatus: () => boolean;
  
  /**
   * 사용자 정보 조회 함수
   * @returns 사용자 정보 또는 null
   */
  getUserInfo: () => User | null;
}

/**
 * 인증 컨텍스트 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 Provider Props 타입 정의
 */
export interface AuthProviderProps {
  /**
   * 자식 컴포넌트
   */
  children: ReactNode;
}

/**
 * 로컬스토리지 키 상수
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
} as const;

/**
 * AuthProvider 컴포넌트
 * 
 * 인증 관련 상태와 기능을 제공하는 Context Provider입니다.
 * 로그인, 로그아웃, 로그인 상태 검증, 사용자 정보 조회 기능을 제공합니다.
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  /**
   * 로컬스토리지에서 액세스 토큰 조회
   */
  const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  };

  /**
   * 로컬스토리지에서 사용자 정보 조회
   */
  const getUserFromStorage = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      return null;
    }
  };

  /**
   * 로그인 상태 검증
   */
  const checkAuthStatus = () => {
    const token = getAccessToken();
    return !!token;
  };

  /**
   * 사용자 정보 조회
   */
  const getUserInfo = () => {
    return getUserFromStorage();
  };

  /**
   * 로그인 함수
   */
  const login = (user: User, accessToken: string) => {
    try {
      // 로컬스토리지에 토큰과 사용자 정보 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      // 상태 업데이트
      setIsAuthenticated(true);
      setUser(user);
      
      // 로그인 성공 후 일기 목록 페이지로 이동
      router.push(urlPaths.diariesList);
    } catch (error) {
      console.error('로그인 처리 오류:', error);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    try {
      // 로컬스토리지에서 토큰과 사용자 정보 제거
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // 상태 초기화
      setIsAuthenticated(false);
      setUser(null);
      
      // 로그인 페이지로 이동
      router.push(urlPaths.authLogin);
    } catch (error) {
      console.error('로그아웃 처리 오류:', error);
    }
  };

  /**
   * 인증 상태 초기화
   */
  const initializeAuth = useCallback(() => {
    const token = getAccessToken();
    const userInfo = getUserFromStorage();
    
    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(userInfo);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  /**
   * 로컬스토리지 변경 감지 및 초기 인증 상태 설정
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEYS.ACCESS_TOKEN || e.key === STORAGE_KEYS.USER) {
        initializeAuth();
      }
    };

    // 초기 인증 상태 설정
    initializeAuth();

    // 로컬스토리지 변경 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initializeAuth]);

  /**
   * 컨텍스트 값 정의
   */
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuthStatus,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth 훅
 * 
 * AuthContext를 사용하기 위한 커스텀 훅입니다.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  
  return context;
};

export default AuthProvider;
