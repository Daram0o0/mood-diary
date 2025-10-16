'use client';

import { useState, useEffect } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 로컬스토리지에 저장된 일기 데이터 타입
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 목록 페이지용 데이터 타입
 */
export interface DiaryItem {
  id: number;
  title: string;
  date: string; // YYYY. MM. DD 형식
  emotion: EmotionType;
}

/**
 * 데이터 바인딩 훅 반환 타입
 */
export interface UseDiaryBindingReturn {
  diaries: DiaryItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 일기 목록 페이지 데이터 바인딩 훅
 * 
 * 로컬스토리지의 실제 데이터를 가져와서 일기 목록 페이지에 적합한 형태로 변환합니다.
 * 
 * @returns {UseDiaryBindingReturn} 일기 목록, 로딩 상태, 에러 상태
 * 
 * @example
 * ```tsx
 * const { diaries, isLoading, error } = useDiaryBinding();
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error}</div>;
 * 
 * return (
 *   <div>
 *     {diaries.map(diary => (
 *       <div key={diary.id}>{diary.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useDiaryBinding = (): UseDiaryBindingReturn => {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiaries = () => {
      try {
        setIsLoading(true);
        setError(null);

        // 브라우저 환경에서만 localStorage 접근
        if (typeof window === 'undefined') {
          setDiaries([]);
          setIsLoading(false);
          return;
        }

        // 로컬스토리지에서 diaries 데이터 가져오기
        const diariesJson = localStorage.getItem('diaries');
        
        if (!diariesJson) {
          // 데이터가 없는 경우 빈 배열로 설정
          setDiaries([]);
          setIsLoading(false);
          return;
        }

        // JSON 파싱
        const rawDiaries: DiaryData[] = JSON.parse(diariesJson);
        
        if (!Array.isArray(rawDiaries)) {
          setError('일기 데이터 형식이 올바르지 않습니다.');
          setDiaries([]);
          setIsLoading(false);
          return;
        }

        // DiaryData를 DiaryItem으로 변환
        const convertedDiaries: DiaryItem[] = rawDiaries.map(diary => ({
          id: diary.id,
          title: diary.title,
          date: formatDate(diary.createdAt),
          emotion: diary.emotion
        }));

        // 최신순으로 정렬 (createdAt 기준 내림차순)
        const sortedDiaries = convertedDiaries.sort((a, b) => {
          const dateA = new Date(rawDiaries.find(d => d.id === a.id)?.createdAt || '');
          const dateB = new Date(rawDiaries.find(d => d.id === b.id)?.createdAt || '');
          return dateB.getTime() - dateA.getTime();
        });

        setDiaries(sortedDiaries);
        setIsLoading(false);
        
      } catch (err) {
        console.error('일기 목록 로드 중 오류 발생:', err);
        setError('일기 목록을 불러오는 중 오류가 발생했습니다.');
        setDiaries([]);
        setIsLoading(false);
      }
    };

    loadDiaries();
  }, []);

  return {
    diaries,
    isLoading,
    error
  };
};

/**
 * ISO 날짜 문자열을 YYYY. MM. DD 형식으로 변환
 * 
 * @param {string} isoString - ISO 8601 형식의 날짜 문자열
 * @returns {string} YYYY. MM. DD 형식의 날짜 문자열
 * 
 * @example
 * ```ts
 * formatDate('2024-03-12T10:00:00.000Z'); // '2024. 03. 12'
 * ```
 */
const formatDate = (isoString: string): string => {
  try {
    // UTC 날짜를 그대로 사용하여 시간대 변환 문제 방지
    const date = new Date(isoString);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 오류';
    }

    // UTC 날짜 사용 (getUTCFullYear, getUTCMonth, getUTCDate)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}. ${month}. ${day}`;
  } catch (error) {
    console.error('날짜 포맷팅 중 오류 발생:', error);
    return '날짜 오류';
  }
};

export default useDiaryBinding;
