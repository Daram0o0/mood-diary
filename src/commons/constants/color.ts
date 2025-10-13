/**
 * Color Token System
 * Figma Foundation 기반 색상 시스템
 * 규칙: :root, :global, important 키워드 사용 금지
 * Figma Node ID: 3459:1130
 */

// 기본 색상 팔레트 (Figma Foundation 기반)
export const colorPalette = {
  // Blue (Primary Colors)
  blue: {
    5: '#F0F7FF',
    10: '#DBEEFF',
    20: '#BDDBFF',
    30: '#93BEFF',
    40: '#6DA5FA', // System color
    50: '#497CFF',
    60: '#3A5CF3', // System color
    70: '#274AE1',
    80: '#1530A6',
    90: '#0B2184',
  },
  
  // Gray (Neutral Colors)
  gray: {
    white: '#FFFFFF',
    5: '#F2F2F2',
    10: '#E4E4E4',
    20: '#D4D3D3',
    30: '#C7C7C7',
    40: '#ABABAB',
    50: '#919191',
    60: '#777777',
    70: '#5F5F5F',
    80: '#333333',
    90: '#1C1C1C',
    black: '#000000',
  },
  
  // Red (Error Colors)
  red: {
    5: '#FDD7DC',
    10: '#F797A4',
    20: '#F4677A',
    30: '#F03851', // Error color
    40: '#E4112E',
    50: '#B40E24',
    60: '#850A1B',
  },
  
  // Green (Success Colors)
  green: {
    5: '#D3F3E0',
    10: '#92E6B9',
    20: '#15D66F',
    30: '#12B75F', // Success color
    40: '#109C51',
    50: '#0E723C',
    60: '#084424',
  },
  
  // Yellow (Warning Colors)
  yellow: {
    5: '#FFE499',
    10: '#FFD666',
    20: '#FFC933',
    30: '#FFB300',
    40: '#EBA500',
    50: '#D69600',
    60: '#B27D00',
  },
  
  // Cool Gray
  coolGray: {
    1: '#F8F8FA',
    5: '#F6F6F9',
    10: '#EDEEF2',
    20: '#DDDFE5',
    30: '#D2D4DD',
    40: '#C7C9D5',
    50: '#BBBECD',
    60: '#B0B3C4',
  },
} as const;

// 시맨틱 색상 토큰 (Light Mode)
export const lightColors = {
  // Primary
  primary: {
    main: colorPalette.blue[60],
    light: colorPalette.blue[40],
    dark: colorPalette.blue[70],
    contrast: colorPalette.gray.white,
  },
  
  // Secondary
  secondary: {
    main: colorPalette.coolGray[40],
    light: colorPalette.coolGray[30],
    dark: colorPalette.coolGray[50],
    contrast: colorPalette.gray.white,
  },
  
  // Background
  background: {
    default: colorPalette.gray.white,
    paper: colorPalette.gray[5],
    elevated: colorPalette.gray.white,
  },
  
  // Text
  text: {
    primary: colorPalette.gray.black,
    secondary: colorPalette.gray[60],
    disabled: colorPalette.gray[40],
    hint: colorPalette.gray[50],
  },
  
  // Border
  border: {
    default: colorPalette.gray[10],
    light: colorPalette.gray[5],
    dark: colorPalette.gray[20],
  },
  
  // Status
  status: {
    success: colorPalette.green[30],
    warning: colorPalette.yellow[30],
    error: colorPalette.red[30],
    info: colorPalette.blue[60],
  },
} as const;

// 시맨틱 색상 토큰 (Dark Mode)
export const darkColors = {
  // Primary
  primary: {
    main: colorPalette.blue[40],
    light: colorPalette.blue[30],
    dark: colorPalette.blue[50],
    contrast: colorPalette.gray.black,
  },
  
  // Secondary
  secondary: {
    main: colorPalette.coolGray[30],
    light: colorPalette.coolGray[20],
    dark: colorPalette.coolGray[40],
    contrast: colorPalette.gray.black,
  },
  
  // Background
  background: {
    default: colorPalette.gray.black,
    paper: colorPalette.gray[90],
    elevated: colorPalette.gray[80],
  },
  
  // Text
  text: {
    primary: colorPalette.gray.white,
    secondary: colorPalette.gray[40],
    disabled: colorPalette.gray[60],
    hint: colorPalette.gray[50],
  },
  
  // Border
  border: {
    default: colorPalette.gray[70],
    light: colorPalette.gray[80],
    dark: colorPalette.gray[60],
  },
  
  // Status
  status: {
    success: colorPalette.green[20],
    warning: colorPalette.yellow[20],
    error: colorPalette.red[20],
    info: colorPalette.blue[40],
  },
} as const;

// 통합 색상 객체
export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

// 타입 정의
export type ColorMode = 'light' | 'dark';
export type ColorTokens = typeof colors.light;
export type ColorPalette = typeof colorPalette;
export type ColorCategory = keyof ColorTokens;
export type ColorVariant = string;

// CSS Module 클래스명 생성기
export const createColorClasses = (mode: ColorMode) => {
  const modeColors = colors[mode];
  
  return {
    // Primary
    primaryMain: modeColors.primary.main,
    primaryLight: modeColors.primary.light,
    primaryDark: modeColors.primary.dark,
    primaryContrast: modeColors.primary.contrast,
    
    // Secondary
    secondaryMain: modeColors.secondary.main,
    secondaryLight: modeColors.secondary.light,
    secondaryDark: modeColors.secondary.dark,
    secondaryContrast: modeColors.secondary.contrast,
    
    // Background
    backgroundDefault: modeColors.background.default,
    backgroundPaper: modeColors.background.paper,
    backgroundElevated: modeColors.background.elevated,
    
    // Text
    textPrimary: modeColors.text.primary,
    textSecondary: modeColors.text.secondary,
    textDisabled: modeColors.text.disabled,
    textHint: modeColors.text.hint,
    
    // Border
    borderDefault: modeColors.border.default,
    borderLight: modeColors.border.light,
    borderDark: modeColors.border.dark,
    
    // Status
    statusSuccess: modeColors.status.success,
    statusWarning: modeColors.status.warning,
    statusError: modeColors.status.error,
    statusInfo: modeColors.status.info,
  };
};

// 색상 값 가져오기 헬퍼 함수
export const getColor = (
  mode: ColorMode,
  category: ColorCategory,
  variant: ColorVariant
): string => {
  const colorCategory = colors[mode][category] as Record<string, string>;
  return colorCategory[variant] || '';
};

// 팔레트에서 직접 색상 가져오기
export const getPaletteColor = (
  palette: keyof ColorPalette,
  shade: number
): string => {
  const colorGroup = colorPalette[palette] as Record<number, string>;
  return colorGroup[shade] || '';
};

// 색상 모드 감지
export const detectColorMode = (): ColorMode => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 색상 유틸리티 함수들
export const colorUtils = {
  // 색상 밝기 조정 (간단한 버전)
  lighten: (color: string): string => {
    // 실제 구현에서는 color manipulation 라이브러리 사용 권장
    return color;
  },
  
  // 색상 어둡게 조정 (간단한 버전)
  darken: (color: string): string => {
    // 실제 구현에서는 color manipulation 라이브러리 사용 권장
    return color;
  },
  
  // 투명도 조정
  withOpacity: (color: string, opacity: number): string => {
    // hex 색상을 rgba로 변환하는 간단한 구현
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
};

// Tailwind CSS와의 호환성을 위한 색상 맵
export const tailwindColors = {
  blue: {
    50: colorPalette.blue[5],
    100: colorPalette.blue[10],
    200: colorPalette.blue[20],
    300: colorPalette.blue[30],
    400: colorPalette.blue[40],
    500: colorPalette.blue[50],
    600: colorPalette.blue[60],
    700: colorPalette.blue[70],
    800: colorPalette.blue[80],
    900: colorPalette.blue[90],
  },
  gray: {
    0: colorPalette.gray.white,
    50: colorPalette.gray[5],
    100: colorPalette.gray[10],
    200: colorPalette.gray[20],
    300: colorPalette.gray[30],
    400: colorPalette.gray[40],
    500: colorPalette.gray[50],
    600: colorPalette.gray[60],
    700: colorPalette.gray[70],
    800: colorPalette.gray[80],
    900: colorPalette.gray[90],
    950: colorPalette.gray.black,
  },
  red: {
    50: colorPalette.red[5],
    100: colorPalette.red[10],
    200: colorPalette.red[20],
    300: colorPalette.red[30],
    400: colorPalette.red[40],
    500: colorPalette.red[50],
    600: colorPalette.red[60],
  },
  green: {
    50: colorPalette.green[5],
    100: colorPalette.green[10],
    200: colorPalette.green[20],
    300: colorPalette.green[30],
    400: colorPalette.green[40],
    500: colorPalette.green[50],
    600: colorPalette.green[60],
  },
  yellow: {
    50: colorPalette.yellow[5],
    100: colorPalette.yellow[10],
    200: colorPalette.yellow[20],
    300: colorPalette.yellow[30],
    400: colorPalette.yellow[40],
    500: colorPalette.yellow[50],
    600: colorPalette.yellow[60],
  },
  coolGray: {
    10: colorPalette.coolGray[1],
    50: colorPalette.coolGray[5],
    100: colorPalette.coolGray[10],
    200: colorPalette.coolGray[20],
    300: colorPalette.coolGray[30],
    400: colorPalette.coolGray[40],
    500: colorPalette.coolGray[50],
    600: colorPalette.coolGray[60],
  },
} as const;


