'use client';

import { useState, useMemo } from 'react';
import { DiaryItem } from './index.binding.hook';
import { emotionUtils } from '@/commons/constants/enum';

/**
 * 필터 훅의 반환 타입
 */
export interface UseFilterReturn {
  selectedEmotion: string;
  filteredDiaries: DiaryItem[];
  isFilterActive: boolean;
  handleEmotionChange: (value: string) => void;
  getFilterOptions: () => Array<{ value: string; label: string }>;
}

/**
 * 일기 필터 기능을 제공하는 커스텀 훅
 * 
 * @param diaries - 필터링할 일기 데이터 배열
 * @returns {UseFilterReturn} 필터 관련 상태와 핸들러 함수들
 * 
 * @example
 * ```tsx
 * const { selectedEmotion, filteredDiaries, handleEmotionChange, getFilterOptions } = useFilter(diaries);
 * 
 * return (
 *   <div>
 *     <select value={selectedEmotion} onChange={(e) => handleEmotionChange(e.target.value)}>
 *       {getFilterOptions().map(option => (
 *         <option key={option.value} value={option.value}>{option.label}</option>
 *       ))}
 *     </select>
 *     {filteredDiaries.map(diary => <div key={diary.id}>{diary.title}</div>)}
 *   </div>
 * );
 * ```
 */
export const useFilter = (diaries: DiaryItem[]): UseFilterReturn => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');

  // 필터 활성화 상태 계산
  const isFilterActive = selectedEmotion !== 'all';

  // 감정 필터 변경 핸들러
  const handleEmotionChange = (value: string) => {
    setSelectedEmotion(value);
  };

  // 필터 옵션 가져오기
  const getFilterOptions = () => {
    const emotionOptions = emotionUtils.toSelectOptions();
    return [
      { value: 'all', label: '전체' },
      ...emotionOptions
    ];
  };

  // 필터링된 일기 데이터 계산
  const filteredDiaries = useMemo(() => {
    if (!isFilterActive) {
      return diaries;
    }

    return diaries.filter((diary) => {
      // 감정 필터 조건
      const emotionMatch = selectedEmotion === 'all' || 
        diary.emotion === selectedEmotion;

      return emotionMatch;
    });
  }, [diaries, selectedEmotion, isFilterActive]);

  return {
    selectedEmotion,
    filteredDiaries,
    isFilterActive,
    handleEmotionChange,
    getFilterOptions,
  };
};
