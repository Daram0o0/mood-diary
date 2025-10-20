'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Dog API 응답 타입
 */
interface DogApiResponse {
  message: string[];
  status: string;
}

/**
 * 강아지 이미지 데이터 타입
 */
export interface DogImage {
  id: string;
  src: string;
  alt: string;
}

/**
 * 강아지 사진 목록 조회 훅
 * 
 * Dog CEO API를 사용하여 강아지 사진을 무한스크롤로 조회합니다.
 * React Query의 useInfiniteQuery를 활용하여 페이지네이션을 처리합니다.
 * 
 * @returns {Object} 강아지 이미지 데이터와 관련 상태
 * @returns {DogImage[]} data - 강아지 이미지 배열
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {boolean} isError - 에러 상태
 * @returns {Error | null} error - 에러 객체
 * @returns {boolean} hasNextPage - 다음 페이지 존재 여부
 * @returns {Function} fetchNextPage - 다음 페이지 로드 함수
 * @returns {boolean} isFetchingNextPage - 다음 페이지 로딩 상태
 * 
 * @example
 * ```tsx
 * const { data, isLoading, fetchNextPage, hasNextPage } = useDogImages();
 * ```
 */
export const useDogImages = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<DogApiResponse, Error, DogImage[], string[], number>({
    queryKey: ['dogImages'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `https://dog.ceo/api/breeds/image/random/6?page=${pageParam}`
      );
      
      if (!response.ok) {
        throw new Error('강아지 사진을 불러오는데 실패했습니다.');
      }
      
      const result: DogApiResponse = await response.json();
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      // 무한스크롤을 위해 다음 페이지 번호 반환
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    select: (data) => {
      // 모든 페이지의 데이터를 DogImage 형태로 변환하여 하나의 배열로 합치기
      return data.pages.flatMap((page, pageIndex) =>
        page.message.map((url, index) => ({
          id: `dog-${pageIndex + 1}-${index}`,
          src: url,
          alt: `강아지 사진 ${pageIndex + 1}-${index + 1}`,
        }))
      );
    },
  });

  // select 함수를 통해 이미 변환된 데이터 사용
  const allImages = data || [];

  return {
    data: allImages,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};