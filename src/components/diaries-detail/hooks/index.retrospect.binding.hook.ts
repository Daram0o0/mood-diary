'use client';

import { useState, useEffect } from 'react';

/**
 * 회고 데이터 타입 정의
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 바인딩 훅의 반환 타입
 */
export interface UseRetrospectBindingReturn {
  retrospects: RetrospectData[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 특정 일기에 대한 회고 데이터를 바인딩하는 훅
 * 
 * 로컬스토리지에서 'retrospects' 키로 저장된 회고 데이터 중
 * diaryId가 일치하는 데이터들을 필터링하여 반환합니다.
 * 
 * @param {number} diaryId - 일기 ID
 * @returns {UseRetrospectBindingReturn} 회고 데이터, 로딩 상태, 에러 상태
 * 
 * @example
 * ```tsx
 * const { retrospects, isLoading, error } = useRetrospectBinding(1);
 * ```
 */
export function useRetrospectBinding(diaryId: number): UseRetrospectBindingReturn {
  const [retrospects, setRetrospects] = useState<RetrospectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // 로컬스토리지에서 회고 데이터 가져오기
      const storedRetrospects = localStorage.getItem('retrospects');
      
      if (!storedRetrospects) {
        setRetrospects([]);
        setIsLoading(false);
        return;
      }

      // JSON 파싱
      const allRetrospects: RetrospectData[] = JSON.parse(storedRetrospects);
      
      // diaryId가 일치하는 회고 데이터만 필터링
      const filteredRetrospects = allRetrospects.filter(
        retrospect => retrospect.diaryId === diaryId
      );

      setRetrospects(filteredRetrospects);
    } catch (err) {
      setError('회고 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error loading retrospects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [diaryId]);

  return {
    retrospects,
    isLoading,
    error
  };
}
