'use client';

import { useState, useEffect } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 데이터 인터페이스
 * 로컬스토리지에 저장된 일기 데이터 구조
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 바인딩 훅의 반환 타입
 */
export interface UseDiaryBindingReturn {
  diary: DiaryData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 일기 상세 페이지 데이터 바인딩 훅
 * 
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지의 실제 데이터를 바인딩합니다.
 * 
 * @param {string} diaryId - 일기 ID (다이나믹 라우팅에서 추출된 값)
 * @returns {UseDiaryBindingReturn} 일기 데이터, 로딩 상태, 에러 상태
 * 
 * @example
 * ```tsx
 * const { diary, isLoading, error } = useDiaryBinding('1');
 * 
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error}</div>;
 * if (!diary) return <div>일기를 찾을 수 없습니다.</div>;
 * 
 * return <div>{diary.title}</div>;
 * ```
 */
export const useDiaryBinding = (diaryId: string): UseDiaryBindingReturn => {
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiaryData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // 로컬스토리지에서 diaries 데이터 가져오기
        const diariesJson = localStorage.getItem('diaries');
        
        if (!diariesJson) {
          setError('저장된 일기가 없습니다.');
          setDiary(null);
          return;
        }

        // JSON 파싱
        const diaries: DiaryData[] = JSON.parse(diariesJson);
        
        if (!Array.isArray(diaries)) {
          setError('일기 데이터 형식이 올바르지 않습니다.');
          setDiary(null);
          return;
        }

        // ID로 일기 찾기
        const targetId = parseInt(diaryId, 10);
        const foundDiary = diaries.find(d => d.id === targetId);
        
        if (!foundDiary) {
          setError(`ID ${diaryId}에 해당하는 일기를 찾을 수 없습니다.`);
          setDiary(null);
          return;
        }

        // 일기 데이터 설정
        setDiary(foundDiary);
        
      } catch (err) {
        console.error('일기 데이터 로드 중 오류 발생:', err);
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
        setDiary(null);
      } finally {
        setIsLoading(false);
      }
    };

    // diaryId가 유효한 경우에만 데이터 로드
    if (diaryId && diaryId.trim() !== '') {
      loadDiaryData();
    } else {
      setError('유효하지 않은 일기 ID입니다.');
      setIsLoading(false);
    }
  }, [diaryId]);

  return {
    diary,
    isLoading,
    error
  };
};

export default useDiaryBinding;
