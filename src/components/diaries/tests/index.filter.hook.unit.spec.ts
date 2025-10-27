import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilter } from '../hooks/index.filter.hook';

// 테스트 데이터
const testDiaries = [
  {
    id: 1,
    title: '행복한 하루',
    content: '오늘은 정말 행복한 하루였어요!',
    emotion: 'Happy',
    createdAt: '2024-01-01T00:00:00.000Z',
    date: '2024-01-01'
  },
  {
    id: 2,
    title: '슬픈 하루',
    content: '오늘은 정말 슬픈 하루였어요.',
    emotion: 'Sad',
    createdAt: '2024-01-02T00:00:00.000Z',
    date: '2024-01-02'
  },
  {
    id: 3,
    title: '놀라운 하루',
    content: '오늘은 정말 놀라운 하루였어요!',
    emotion: 'Surprise',
    createdAt: '2024-01-03T00:00:00.000Z',
    date: '2024-01-03'
  },
  {
    id: 4,
    title: '화난 하루',
    content: '오늘은 정말 화난 하루였어요.',
    emotion: 'Angry',
    createdAt: '2024-01-04T00:00:00.000Z',
    date: '2024-01-04'
  },
  {
    id: 5,
    title: '기타 하루',
    content: '오늘은 정말 특별한 하루였어요.',
    emotion: 'Etc',
    createdAt: '2024-01-05T00:00:00.000Z',
    date: '2024-01-05'
  }
];

describe('useFilter Hook 테스트', () => {
  it('초기 상태 확인', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    expect(result.current.selectedEmotion).toBe('all');
    expect(result.current.filteredDiaries).toEqual(testDiaries);
    expect(result.current.isFilterActive).toBe(false);
  });

  it('필터 옵션 가져오기', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    const options = result.current.getFilterOptions();
    expect(options).toHaveLength(6); // 전체 + 5개 감정
    expect(options[0]).toEqual({ value: 'all', label: '전체' });
    expect(options[1]).toEqual({ value: 'Happy', label: '행복해요' });
    expect(options[2]).toEqual({ value: 'Sad', label: '슬퍼요' });
    expect(options[3]).toEqual({ value: 'Surprise', label: '놀랐어요' });
    expect(options[4]).toEqual({ value: 'Angry', label: '화나요' });
    expect(options[5]).toEqual({ value: 'Etc', label: '기타' });
  });

  it('전체 필터 선택 시 모든 일기 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('all');
    });
    
    expect(result.current.selectedEmotion).toBe('all');
    expect(result.current.filteredDiaries).toEqual(testDiaries);
    expect(result.current.isFilterActive).toBe(false);
  });

  it('행복해요 필터 선택 시 해당 일기만 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('Happy');
    });
    
    expect(result.current.selectedEmotion).toBe('Happy');
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Happy');
    expect(result.current.isFilterActive).toBe(true);
  });

  it('슬퍼요 필터 선택 시 해당 일기만 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('Sad');
    });
    
    expect(result.current.selectedEmotion).toBe('Sad');
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Sad');
    expect(result.current.isFilterActive).toBe(true);
  });

  it('놀랐어요 필터 선택 시 해당 일기만 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('Surprise');
    });
    
    expect(result.current.selectedEmotion).toBe('Surprise');
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Surprise');
    expect(result.current.isFilterActive).toBe(true);
  });

  it('화나요 필터 선택 시 해당 일기만 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('Angry');
    });
    
    expect(result.current.selectedEmotion).toBe('Angry');
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Angry');
    expect(result.current.isFilterActive).toBe(true);
  });

  it('기타 필터 선택 시 해당 일기만 반환', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('Etc');
    });
    
    expect(result.current.selectedEmotion).toBe('Etc');
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Etc');
    expect(result.current.isFilterActive).toBe(true);
  });

  it('존재하지 않는 감정 필터 선택 시 빈 결과', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    act(() => {
      result.current.handleEmotionChange('NonExistent');
    });
    
    expect(result.current.selectedEmotion).toBe('NonExistent');
    expect(result.current.filteredDiaries).toHaveLength(0);
    expect(result.current.isFilterActive).toBe(true);
  });

  it('빈 데이터 배열 처리', () => {
    const { result } = renderHook(() => useFilter([]));
    
    act(() => {
      result.current.handleEmotionChange('Happy');
    });
    
    expect(result.current.filteredDiaries).toHaveLength(0);
    expect(result.current.isFilterActive).toBe(true);
  });

  it('필터 변경 시 상태 업데이트', () => {
    const { result } = renderHook(() => useFilter(testDiaries));
    
    // 처음에는 전체
    expect(result.current.selectedEmotion).toBe('all');
    expect(result.current.isFilterActive).toBe(false);
    
    // 행복해요로 변경
    act(() => {
      result.current.handleEmotionChange('Happy');
    });
    
    expect(result.current.selectedEmotion).toBe('Happy');
    expect(result.current.isFilterActive).toBe(true);
    expect(result.current.filteredDiaries).toHaveLength(1);
    
    // 슬퍼요로 변경
    act(() => {
      result.current.handleEmotionChange('Sad');
    });
    
    expect(result.current.selectedEmotion).toBe('Sad');
    expect(result.current.isFilterActive).toBe(true);
    expect(result.current.filteredDiaries).toHaveLength(1);
    expect(result.current.filteredDiaries[0].emotion).toBe('Sad');
  });
});
