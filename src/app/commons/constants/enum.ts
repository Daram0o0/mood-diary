/**
 * Enum Token System
 * Emotion enum 기반 데이터 시스템
 * 규칙: :root, :global, important 키워드 사용 금지
 */

import { colorPalette } from './color';

// 이미지 사이즈 타입
export type ImageSize = 'm' | 's';

// Emotion 데이터 인터페이스
interface EmotionData {
  label: string;
  images: {
    m: string;
    s: string;
  };
  color: string;
}

// Emotion enum 데이터 정의
export const emotions = {
  Happy: {
    label: '행복해요',
    images: {
      m: '/icons/emotion-happy-m.svg',
      s: '/images/emotion-happy-s.png',
    },
    color: colorPalette.red[60],
  },
  Sad: {
    label: '슬퍼요',
    images: {
      m: '/icons/emotion-sad-m.svg',
      s: '/images/emotion-sad-s.png',
    },
    color: colorPalette.blue[60],
  },
  Angry: {
    label: '화나요',
    images: {
      m: '/icons/emotion-angry-m.svg',
      s: '/images/emotion-angry-s.png',
    },
    color: colorPalette.gray[60],
  },
  Surprise: {
    label: '놀랐어요',
    images: {
      m: '/icons/emotion-surprise-m.svg',
      s: '/images/emotion-surprise-s.png',
    },
    color: colorPalette.yellow[60],
  },
  Etc: {
    label: '기타',
    images: {
      m: '/icons/emotion-etc-m.svg',
      s: '/images/emotion-etc-s.png',
    },
    color: colorPalette.green[60],
  },
} as const;

// 타입 정의
export type EmotionType = keyof typeof emotions;
export type EmotionDataType = typeof emotions[EmotionType];

// Emotion 키 배열
export const emotionKeys = Object.keys(emotions) as EmotionType[];

// Emotion 값 배열
export const emotionValues = Object.values(emotions);

// Emotion 엔트리 배열
export const emotionEntries = Object.entries(emotions) as [EmotionType, EmotionData][];

// 헬퍼 함수: Emotion 데이터 가져오기
export const getEmotion = (type: EmotionType): EmotionData => {
  return emotions[type];
};

// 헬퍼 함수: Emotion 라벨 가져오기
export const getEmotionLabel = (type: EmotionType): string => {
  return emotions[type].label;
};

// 헬퍼 함수: Emotion 이미지 가져오기
export const getEmotionImage = (type: EmotionType, size: ImageSize): string => {
  return emotions[type].images[size];
};

// 헬퍼 함수: Emotion 색상 가져오기
export const getEmotionColor = (type: EmotionType): string => {
  return emotions[type].color;
};

// 헬퍼 함수: 라벨로 Emotion 타입 찾기
export const findEmotionByLabel = (label: string): EmotionType | undefined => {
  return emotionEntries.find(([, emotion]) => emotion.label === label)?.[0];
};

// 헬퍼 함수: Emotion이 유효한지 확인
export const isValidEmotion = (type: string): type is EmotionType => {
  return type in emotions;
};

// 헬퍼 함수: 모든 Emotion 라벨 배열 가져오기
export const getAllEmotionLabels = (): string[] => {
  return emotionValues.map(emotion => emotion.label);
};

// 헬퍼 함수: 모든 Emotion 색상 배열 가져오기
export const getAllEmotionColors = (): string[] => {
  return emotionValues.map(emotion => emotion.color);
};

// Emotion 유틸리티 객체
export const emotionUtils = {
  // Emotion 데이터를 select option 형태로 변환
  toSelectOptions: () => {
    return emotionEntries.map(([key, emotion]) => ({
      value: key,
      label: emotion.label,
    }));
  },

  // Emotion 데이터를 radio option 형태로 변환
  toRadioOptions: () => {
    return emotionEntries.map(([key, emotion]) => ({
      value: key,
      label: emotion.label,
      color: emotion.color,
      image: emotion.images.m,
    }));
  },

  // Emotion 타입으로 필터링
  filterByTypes: (types: EmotionType[]) => {
    return emotionEntries
      .filter(([key]) => types.includes(key))
      .map(([, emotion]) => emotion);
  },

  // 특정 색상을 가진 Emotion 찾기
  findByColor: (color: string): EmotionType | undefined => {
    return emotionEntries.find(([, emotion]) => emotion.color === color)?.[0];
  },
};

// 기본 내보내기
export default emotions;

