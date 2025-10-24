import { useState, useCallback } from 'react';

/**
 * 필터 옵션 타입
 */
export type FilterOption = 'default' | 'horizontal' | 'vertical';

/**
 * 필터 옵션 인터페이스
 */
export interface FilterOptionItem {
  value: FilterOption;
  label: string;
}

/**
 * 이미지 크기 인터페이스
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 필터 hook의 반환 타입
 */
export interface UseFilterReturn {
  selectedFilter: FilterOption;
  setSelectedFilter: (filter: string) => void;
  filterOptions: FilterOptionItem[];
  getImageSize: (filter: FilterOption) => ImageSize;
  getImageSizeForCurrentFilter: () => ImageSize;
}

/**
 * 강아지 사진 필터 기능을 제공하는 hook
 * 
 * 필터 옵션:
 * - 기본: 640 x 640
 * - 가로형: 640 x 480
 * - 세로형: 480 x 640
 * 
 * @returns {UseFilterReturn} 필터 관련 상태와 함수들
 * 
 * @example
 * ```tsx
 * const {
 *   selectedFilter,
 *   setSelectedFilter,
 *   filterOptions,
 *   getImageSize,
 *   getImageSizeForCurrentFilter
 * } = useFilter();
 * ```
 */
export const useFilter = (): UseFilterReturn => {
  const [selectedFilter, setSelectedFilterState] = useState<FilterOption>('default');

  // 필터 옵션 목록
  const filterOptions: FilterOptionItem[] = [
    { value: 'default', label: '기본' },
    { value: 'horizontal', label: '가로형' },
    { value: 'vertical', label: '세로형' },
  ];

  // 필터 변경 핸들러
  const setSelectedFilter = useCallback((filter: string) => {
    setSelectedFilterState(filter as FilterOption);
  }, []);

  // 필터에 따른 이미지 크기 반환
  const getImageSize = useCallback((filter: FilterOption): ImageSize => {
    switch (filter) {
      case 'default':
        return { width: 640, height: 640 };
      case 'horizontal':
        return { width: 640, height: 480 };
      case 'vertical':
        return { width: 480, height: 640 };
      default:
        return { width: 640, height: 640 };
    }
  }, []);

  // 현재 선택된 필터의 이미지 크기 반환
  const getImageSizeForCurrentFilter = useCallback((): ImageSize => {
    return getImageSize(selectedFilter);
  }, [selectedFilter, getImageSize]);

  return {
    selectedFilter,
    setSelectedFilter,
    filterOptions,
    getImageSize,
    getImageSizeForCurrentFilter,
  };
};
