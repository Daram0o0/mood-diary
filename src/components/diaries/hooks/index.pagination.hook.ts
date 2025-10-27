import { useState, useEffect, useMemo } from 'react';
import { EmotionType } from '@/commons/constants/enum';

export interface DiaryItem {
  id: number;
  title: string;
  date: string; // YYYY. MM. DD 형식
  emotion: EmotionType;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface PaginationHookReturn {
  paginationState: PaginationState;
  currentPageItems: DiaryItem[];
  handlePageChange: (page: number) => void;
  resetToFirstPage: () => void;
}

/**
 * 페이지네이션 기능을 제공하는 커스텀 훅
 * 
 * @param items - 페이지네이션할 데이터 배열
 * @param itemsPerPage - 페이지당 아이템 수 (기본값: 12)
 * @returns 페이지네이션 상태와 핸들러 함수들
 * 
 * @example
 * ```tsx
 * const { paginationState, currentPageItems, handlePageChange } = usePagination(diaries, 12);
 * ```
 */
export const usePagination = (
  items: DiaryItem[],
  itemsPerPage: number = 12
): PaginationHookReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지네이션 상태 계산
  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      currentPage,
      totalPages: Math.max(totalPages, 1), // 최소 1페이지 보장
      itemsPerPage,
      startIndex,
      endIndex,
    };
  }, [items.length, currentPage, itemsPerPage]);

  // 현재 페이지의 아이템들
  const currentPageItems = useMemo(() => {
    return items.slice(paginationState.startIndex, paginationState.endIndex);
  }, [items, paginationState.startIndex, paginationState.endIndex]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationState.totalPages) {
      setCurrentPage(page);
    }
  };

  // 첫 페이지로 리셋
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // 데이터가 변경될 때 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // 현재 페이지가 총 페이지 수를 초과하는 경우 첫 페이지로 리셋
  useEffect(() => {
    if (currentPage > paginationState.totalPages && paginationState.totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, paginationState.totalPages]);

  return {
    paginationState,
    currentPageItems,
    handlePageChange,
    resetToFirstPage,
  };
};
