/**
 * Typography Token System
 * Figma Foundation 기반 타이포그래피 시스템
 * 규칙: :root, :global, important 키워드 사용 금지
 * Figma Node ID: 3459:1422
 */

// 폰트 패밀리 정의
export const fontFamilies = {
  korean: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  english: 'SUIT Variable, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'monospace',
} as const;

// 폰트 웨이트 정의
export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// 기본 타이포그래피 속성 타입
interface TypographyStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

// Web Headline (데스크톱용)
export const webHeadline = {
  headline01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 48,
    lineHeight: 60,
    letterSpacing: 0,
  },
  headline02: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: 0,
  },
  headline03: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
} as const;

// Headline (모바일용)
export const headline = {
  headline01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headline02: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.extrabold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0,
  },
  headline03: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
} as const;

// Title
export const title = {
  title01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  title02: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  title03: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  subTitle01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  subTitle02: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
} as const;

// Body
export const body = {
  body01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body02_m: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  body03: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.medium,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  body01_regular: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  body02_s: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  body03_regular: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
} as const;

// Caption
export const caption = {
  caption01: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  caption02_m: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
  },
  caption02_s: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.medium,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
  },
  caption03: {
    fontFamily: fontFamilies.korean,
    fontWeight: fontWeights.semibold,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0,
  },
} as const;

// 영문/숫자용 타이포그래피 (SUIT 폰트 사용)
export const webHeadlineEn = {
  headline01: {
    ...webHeadline.headline01,
    fontFamily: fontFamilies.english,
  },
  headline02: {
    ...webHeadline.headline02,
    fontFamily: fontFamilies.english,
  },
  headline03: {
    ...webHeadline.headline03,
    fontFamily: fontFamilies.english,
  },
} as const;

export const headlineEn = {
  headline01: {
    ...headline.headline01,
    fontFamily: fontFamilies.english,
  },
  headline02: {
    ...headline.headline02,
    fontFamily: fontFamilies.english,
  },
  headline03: {
    ...headline.headline03,
    fontFamily: fontFamilies.english,
  },
} as const;

export const titleEn = {
  title01: {
    ...title.title01,
    fontFamily: fontFamilies.english,
  },
  title02: {
    ...title.title02,
    fontFamily: fontFamilies.english,
  },
  title03: {
    ...title.title03,
    fontFamily: fontFamilies.english,
  },
  subTitle01: {
    ...title.subTitle01,
    fontFamily: fontFamilies.english,
  },
  subTitle02: {
    ...title.subTitle02,
    fontFamily: fontFamilies.english,
  },
} as const;

export const bodyEn = {
  body01: {
    ...body.body01,
    fontFamily: fontFamilies.english,
  },
  body02_m: {
    ...body.body02_m,
    fontFamily: fontFamilies.english,
  },
  body03: {
    ...body.body03,
    fontFamily: fontFamilies.english,
  },
  body01_regular: {
    ...body.body01_regular,
    fontFamily: fontFamilies.english,
  },
  body02_s: {
    ...body.body02_s,
    fontFamily: fontFamilies.english,
  },
  body03_regular: {
    ...body.body03_regular,
    fontFamily: fontFamilies.english,
  },
} as const;

export const captionEn = {
  caption01: {
    ...caption.caption01,
    fontFamily: fontFamilies.english,
  },
  caption02_m: {
    ...caption.caption02_m,
    fontFamily: fontFamilies.english,
  },
  caption02_s: {
    ...caption.caption02_s,
    fontFamily: fontFamilies.english,
  },
  caption03: {
    ...caption.caption03,
    fontFamily: fontFamilies.english,
  },
} as const;

// 디바이스별 타이포그래피 토큰
export const typographyTokens = {
  // 데스크톱 (Web)
  desktop: {
    korean: {
      webHeadline,
      headline,
      title,
      body,
      caption,
    },
    english: {
      webHeadline: webHeadlineEn,
      headline: headlineEn,
      title: titleEn,
      body: bodyEn,
      caption: captionEn,
    },
  },
  // 모바일
  mobile: {
    korean: {
      headline,
      title,
      body,
      caption,
    },
    english: {
      headline: headlineEn,
      title: titleEn,
      body: bodyEn,
      caption: captionEn,
    },
  },
} as const;

// 통합 타이포그래피 객체
export const typography = {
  fontFamilies,
  fontWeights,
  ...typographyTokens,
} as const;

// 타입 정의
export type DeviceType = 'desktop' | 'mobile';
export type LanguageType = 'korean' | 'english';
export type TypographyCategory = 'webHeadline' | 'headline' | 'title' | 'body' | 'caption';
export type TypographyVariant = string;

// 타이포그래피 스타일 적용 헬퍼 함수
export const getTypographyStyle = (
  device: DeviceType,
  language: LanguageType,
  category: TypographyCategory,
  variant: TypographyVariant
): TypographyStyle | undefined => {
  const deviceTypo = typographyTokens[device][language];
  const categoryTypo = deviceTypo[category as keyof typeof deviceTypo] as Record<string, TypographyStyle>;
  return categoryTypo?.[variant];
};

// CSS 문자열 생성 헬퍼 함수
export const createTypographyCSS = (style: TypographyStyle): string => {
  return `
    font-family: ${style.fontFamily};
    font-weight: ${style.fontWeight};
    font-size: ${style.fontSize}px;
    line-height: ${style.lineHeight}px;
    ${style.letterSpacing !== undefined ? `letter-spacing: ${style.letterSpacing}px;` : ''}
  `.trim();
};

// Tailwind CSS 클래스명 생성 헬퍼 함수
export const createTypographyClasses = (
  device: DeviceType,
  language: LanguageType
) => {
  const deviceTypo = typographyTokens[device][language];
  const classes: Record<string, TypographyStyle> = {};

  Object.entries(deviceTypo).forEach(([category, variants]) => {
    Object.entries(variants).forEach(([variant, style]) => {
      const className = `${category}-${variant}`;
      classes[className] = style as TypographyStyle;
    });
  });

  return classes;
};

// 반응형 타이포그래피 스타일 생성
export const createResponsiveTypography = (
  language: LanguageType,
  category: TypographyCategory,
  variant: TypographyVariant
) => {
  const mobileStyle = getTypographyStyle('mobile', language, category, variant);
  const desktopStyle = getTypographyStyle('desktop', language, category, variant);

  return {
    mobile: mobileStyle,
    desktop: desktopStyle || mobileStyle, // desktop이 없으면 mobile 사용
  };
};

// 디바이스 타입 감지
export const detectDeviceType = (): DeviceType => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 ? 'desktop' : 'mobile';
  }
  return 'mobile';
};

// CSS 변수명 생성
export const createCSSVariableName = (
  category: string,
  variant: string,
  property: string
): string => {
  return `--typo-${category}-${variant}-${property}`;
};

// 타이포그래피 유틸리티
export const typographyUtils = {
  // px를 rem으로 변환
  pxToRem: (px: number, baseFontSize: number = 16): string => {
    return `${px / baseFontSize}rem`;
  },
  
  // line-height를 비율로 변환
  lineHeightToRatio: (lineHeight: number, fontSize: number): number => {
    return lineHeight / fontSize;
  },
  
  // 텍스트 잘림 처리
  truncate: (lines: number = 1): string => {
    if (lines === 1) {
      return `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `;
    }
    return `
      display: -webkit-box;
      -webkit-line-clamp: ${lines};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `;
  },
};

// 기본 내보내기
export default typography;

