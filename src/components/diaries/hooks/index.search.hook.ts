'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { DiaryItem } from './index.binding.hook';

/**
 * 검색 훅의 반환 타입
 */
export interface UseSearchReturn {
  searchQuery: string;
  selectedEmotion: string;
  filteredDiaries: DiaryItem[];
  isSearchActive: boolean;
  handleSearchChange: (value: string) => void;
  handleEmotionChange: (value: string) => void;
  handleSearch: () => void;
}

/**
 * 일기 검색 기능을 제공하는 커스텀 훅
 * 
 * @param diaries - 검색할 일기 데이터 배열
 * @returns {UseSearchReturn} 검색 관련 상태와 핸들러 함수들
 * 
 * @example
 * ```tsx
 * const { searchQuery, filteredDiaries, handleSearchChange } = useSearch(diaries);
 * 
 * return (
 *   <div>
 *     <input value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
 *     {filteredDiaries.map(diary => <div key={diary.id}>{diary.title}</div>)}
 *   </div>
 * );
 * ```
 */
export const useSearch = (diaries: DiaryItem[]): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  
  // 디바운싱을 위한 ref
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  // 디바운싱 로직
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 검색 활성화 상태 업데이트
  useEffect(() => {
    if (debouncedSearchQuery.trim() || selectedEmotion !== 'all') {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  }, [debouncedSearchQuery, selectedEmotion]);

  // 검색어 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // 감정 필터 변경 핸들러
  const handleEmotionChange = (value: string) => {
    setSelectedEmotion(value);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    if (searchQuery.trim() || selectedEmotion !== 'all') {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  };

  // 필터링된 일기 데이터 계산
  const filteredDiaries = useMemo(() => {
    if (!isSearchActive) {
      return diaries;
    }

    return diaries.filter((diary) => {
      // 제목 검색 조건
      const titleMatch = debouncedSearchQuery.trim() === '' || 
        diary.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
      // 감정 필터 조건
      const emotionMatch = selectedEmotion === 'all' || 
        diary.emotion === selectedEmotion;

      return titleMatch && emotionMatch;
    });
  }, [diaries, debouncedSearchQuery, selectedEmotion, isSearchActive]);

  return {
    searchQuery,
    selectedEmotion,
    filteredDiaries,
    isSearchActive,
    handleSearchChange,
    handleEmotionChange,
    handleSearch,
  };
};
