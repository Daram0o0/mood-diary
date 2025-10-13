/**
 * URL Token System
 * URL 경로 및 레이아웃 설정 관리 시스템
 * 규칙: :root, :global, important 키워드 사용 금지
 */

// 접근 권한 타입
export type AccessType = 'public' | 'member-only';

// 레이아웃 요소 타입
export interface LayoutVisibility {
  header: boolean;
  headerLogo: boolean;
  headerDarkModeToggle: boolean;
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

// URL 설정 인터페이스
export interface URLConfig {
  path: string;
  access: AccessType;
  layout: LayoutVisibility;
}

// URL 경로 정의
export const urls = {
  auth: {
    login: {
      path: '/auth/login',
      access: 'public' as AccessType,
      layout: {
        header: false,
        headerLogo: false,
        headerDarkModeToggle: false,
        banner: false,
        navigation: false,
        footer: false,
      },
    },
    signup: {
      path: '/auth/signup',
      access: 'public' as AccessType,
      layout: {
        header: false,
        headerLogo: false,
        headerDarkModeToggle: false,
        banner: false,
        navigation: false,
        footer: false,
      },
    },
  },
  diaries: {
    list: {
      path: '/diaries',
      access: 'public' as AccessType,
      layout: {
        header: true,
        headerLogo: true,
        headerDarkModeToggle: false,
        banner: true,
        navigation: true,
        footer: true,
      },
    },
    detail: {
      path: '/diaries/[id]',
      access: 'member-only' as AccessType,
      layout: {
        header: true,
        headerLogo: true,
        headerDarkModeToggle: false,
        banner: false,
        navigation: false,
        footer: true,
      },
    },
  },
  pictures: {
    list: {
      path: '/pictures',
      access: 'public' as AccessType,
      layout: {
        header: true,
        headerLogo: true,
        headerDarkModeToggle: false,
        banner: true,
        navigation: true,
        footer: true,
      },
    },
  },
} as const;

// URL 경로 상수 (플랫 구조)
export const urlPaths = {
  authLogin: '/auth/login',
  authSignup: '/auth/signup',
  diariesList: '/diaries',
  diariesDetail: '/diaries/[id]',
  picturesList: '/pictures',
} as const;

// 타입 정의
export type URLGroup = keyof typeof urls;
export type URLPathType = keyof typeof urlPaths;

// 헬퍼 함수: 다이나믹 라우팅 경로 생성
export const createDiaryDetailPath = (id: string | number): string => {
  return `/diaries/${id}`;
};

// 헬퍼 함수: URL 설정 가져오기
export const getURLConfig = (path: string): URLConfig | undefined => {
  // 다이나믹 라우팅 경로 매칭
  if (path.startsWith('/diaries/') && path !== '/diaries') {
    return urls.diaries.detail as unknown as URLConfig;
  }

  // 플랫 구조로 모든 URL 설정 추출
  const allConfigs: URLConfig[] = [
    urls.auth.login as unknown as URLConfig,
    urls.auth.signup as unknown as URLConfig,
    urls.diaries.list as unknown as URLConfig,
    urls.diaries.detail as unknown as URLConfig,
    urls.pictures.list as unknown as URLConfig,
  ];

  return allConfigs.find((config) => config.path === path);
};

// 헬퍼 함수: 접근 권한 확인
export const isPublicAccess = (path: string): boolean => {
  const config = getURLConfig(path);
  return config?.access === 'public';
};

// 헬퍼 함수: 회원 전용 확인
export const isMemberOnly = (path: string): boolean => {
  const config = getURLConfig(path);
  return config?.access === 'member-only';
};

// 헬퍼 함수: 레이아웃 설정 가져오기
export const getLayoutVisibility = (path: string): LayoutVisibility | undefined => {
  const config = getURLConfig(path);
  return config?.layout;
};

// 헬퍼 함수: 헤더 표시 여부
export const shouldShowHeader = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.header ?? false;
};

// 헬퍼 함수: 배너 표시 여부
export const shouldShowBanner = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.banner ?? false;
};

// 헬퍼 함수: 네비게이션 표시 여부
export const shouldShowNavigation = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.navigation ?? false;
};

// 헬퍼 함수: 푸터 표시 여부
export const shouldShowFooter = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.footer ?? false;
};

// 헬퍼 함수: 헤더 로고 표시 여부
export const shouldShowHeaderLogo = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.headerLogo ?? false;
};

// 헬퍼 함수: 헤더 다크모드 토글 표시 여부
export const shouldShowHeaderDarkModeToggle = (path: string): boolean => {
  const layout = getLayoutVisibility(path);
  return layout?.headerDarkModeToggle ?? false;
};

// 헬퍼 함수: 모든 URL 경로 목록
export const getAllPaths = (): string[] => {
  return Object.values(urlPaths);
};

// 헬퍼 함수: 퍼블릭 페이지 경로 목록
export const getPublicPaths = (): string[] => {
  const allConfigs: URLConfig[] = [
    urls.auth.login as unknown as URLConfig,
    urls.auth.signup as unknown as URLConfig,
    urls.diaries.list as unknown as URLConfig,
    urls.diaries.detail as unknown as URLConfig,
    urls.pictures.list as unknown as URLConfig,
  ];

  return allConfigs
    .filter((config) => config.access === 'public')
    .map((config) => config.path);
};

// 헬퍼 함수: 회원 전용 페이지 경로 목록
export const getMemberOnlyPaths = (): string[] => {
  const allConfigs: URLConfig[] = [
    urls.auth.login as unknown as URLConfig,
    urls.auth.signup as unknown as URLConfig,
    urls.diaries.list as unknown as URLConfig,
    urls.diaries.detail as unknown as URLConfig,
    urls.pictures.list as unknown as URLConfig,
  ];

  return allConfigs
    .filter((config) => config.access === 'member-only')
    .map((config) => config.path);
};

// URL 유틸리티 객체
export const urlUtils = {
  // 다이나믹 라우팅 경로 생성기
  diary: {
    detail: (id: string | number) => createDiaryDetailPath(id),
  },

  // 쿼리 파라미터 추가
  addQueryParams: (path: string, params: Record<string, string | number | boolean>): string => {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return queryString ? `${path}?${queryString}` : path;
  },

  // 경로 검증
  isValidPath: (path: string): boolean => {
    return getURLConfig(path) !== undefined;
  },

  // 경로 비교 (다이나믹 라우팅 고려)
  matchPath: (currentPath: string, targetPath: string): boolean => {
    // 정확히 일치하는 경우
    if (currentPath === targetPath) return true;

    // 다이나믹 라우팅 패턴 매칭
    if (targetPath.includes('[id]')) {
      const pattern = targetPath.replace('[id]', '\\d+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath);
    }

    return false;
  },

  // 레이아웃 설정 전체 가져오기
  getFullLayoutConfig: (path: string) => {
    const config = getURLConfig(path);
    if (!config) return null;

    return {
      path: config.path,
      access: config.access,
      layout: {
        header: config.layout.header,
        headerLogo: config.layout.headerLogo,
        headerDarkModeToggle: config.layout.headerDarkModeToggle,
        banner: config.layout.banner,
        navigation: config.layout.navigation,
        footer: config.layout.footer,
      },
    };
  },
};

// 기본 내보내기
export default urls;

