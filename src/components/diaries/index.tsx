'use client';

import React from 'react';
import styles from './styles.module.css';
import Selectbox from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Pagination from '@/commons/components/pagination';
import Image from 'next/image';
import {
  getEmotionImage,
  getEmotionLabel,
  getEmotionColor,
} from '@/commons/constants/enum';
import { useDiaryBinding, DiaryItem } from './hooks/index.binding.hook';
import { useLinkRouting } from './hooks/index.link.routing.hook';
import { useDiaryWriteAuth } from './hooks/index.link.modal.hook';
import { useSearch } from './hooks/index.search.hook';
import { useFilter } from './hooks/index.filter.hook';
import { usePagination } from './hooks/index.pagination.hook';
import { useDiaryDelete } from './hooks/index.delete.hook';

/**
 * 일기 목록 페이지 컴포넌트
 * 
 * 피그마 디자인에 맞춰 일기 카드들을 표시하고, 빈 상태일 때는 "등록된 일기가 없습니다" 메시지를 보여줍니다.
 * localStorage 기반으로 실제 일기 데이터를 표시합니다.
 * 
 * @returns {JSX.Element} 일기 목록 페이지 컴포넌트
 * 
 * @example
 * ```tsx
 * <Diaries />
 * ```
 */
const Diaries: React.FC = () => {
  // 권한 분기 훅
  const { handleDiaryWriteClick } = useDiaryWriteAuth();

  // 데이터 바인딩 훅
  const { diaries, isLoading, error, refreshDiaries } = useDiaryBinding();

  // 검색 기능 훅
  const { 
    searchQuery, 
    filteredDiaries: searchFilteredDiaries, 
    isSearchActive,
    handleSearchChange, 
    handleSearch
    // handleClearSearch 
  } = useSearch(diaries);

  // 필터 기능 훅
  const { 
    selectedEmotion, 
    filteredDiaries: filterFilteredDiaries, 
    isFilterActive,
    handleEmotionChange, 
    getFilterOptions
  } = useFilter(diaries);

  // 검색과 필터 결과에 따른 데이터 선택
  let displayDiaries = diaries;
  
  if (isSearchActive && isFilterActive) {
    // 검색과 필터가 모두 활성화된 경우: 검색 결과에 필터 적용
    displayDiaries = filterFilteredDiaries.filter(diary => 
      searchFilteredDiaries.some(searchDiary => searchDiary.id === diary.id)
    );
  } else if (isSearchActive) {
    // 검색만 활성화된 경우
    displayDiaries = searchFilteredDiaries;
  } else if (isFilterActive) {
    // 필터만 활성화된 경우
    displayDiaries = filterFilteredDiaries;
  }
  
  // 페이지네이션 훅
  const { 
    paginationState, 
    currentPageItems, 
    handlePageChange 
  } = usePagination(displayDiaries, 12);

  // 링크 라우팅 훅
  const { handleDiaryCardClick } = useLinkRouting();
  
  // 일기 삭제 훅
  const { handleDeleteClick, isDeleteIconVisible } = useDiaryDelete(refreshDiaries);

  // 일기쓰기 버튼 클릭 핸들러는 useDiaryWriteAuth 훅에서 제공됩니다.

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diaries-page">
        <div className={styles.gap}></div>
        <div className={styles.loadingState}>
          로딩 중...
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container} data-testid="diaries-page">
        <div className={styles.gap}></div>
        <div className={styles.errorState}>
          에러: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="diaries-page">
      <div className={styles.gap}></div>

      {/* 데스크톱 버전 (767px 초과) */}
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <Selectbox
            variant="primary"
            size="large"
            theme="light"
            options={getFilterOptions()}
            value={selectedEmotion}
            onChange={handleEmotionChange}
            className={styles.selectWidth}
            fullWidth={false}
          />

          <Searchbar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearch}
            className={styles.searchWidth}
            fullWidth={false}
          />
        </div>

        <Button
          variant="primary"
          size="medium"
          theme="light"
          onClick={handleDiaryWriteClick}
          className={styles.buttonWidth}
          icon={
            <Image
              src="/icons/plus_outline_light_m.svg"
              alt="plus"
              width={24}
              height={24}
            />
          }
          iconPosition="left"
          fullWidth={false}
          data-testid="diary-write-button"
        >
          일기쓰기
        </Button>
      </div>

      {/* 모바일 버전 (767px 이하) */}
      <div className={styles.searchMobile}>
        <Searchbar
          variant="primary"
          size="medium"
          theme="light"
          placeholder="검색어를 입력해 주세요."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onSearch={handleSearch}
          className={styles.searchMobileWidth}
          fullWidth={true}
        />

        <div className={styles.searchMobileBottom}>
          <Selectbox
            variant="primary"
            size="large"
            theme="light"
            options={getFilterOptions()}
            value={selectedEmotion}
            onChange={handleEmotionChange}
            className={styles.selectMobileWidth}
            fullWidth={false}
          />

          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleDiaryWriteClick}
            className={styles.buttonMobileWidth}
            icon={
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt="plus"
                width={24}
                height={24}
              />
            }
            iconPosition="left"
            fullWidth={false}
            data-testid="diary-write-button-mobile"
          >
            일기쓰기
          </Button>
        </div>
      </div>
      
      <div className={styles.gap}></div>
      
      <div className={styles.main}>
        {displayDiaries.length === 0 ? (
          // 빈 상태 처리: localStorage에 일기 데이터가 없거나 검색 결과가 없을 때
          <div className={styles.emptyState}>
            <p className={styles.emptyText} data-testid="empty-message">
              {isSearchActive ? '검색 결과가 없습니다.' : '등록된 일기가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className={styles.cardGrid}>
            {currentPageItems.map((diary: DiaryItem) => {
              const imageSrc = getEmotionImage(diary.emotion, 'm');
              const emotionLabel = getEmotionLabel(diary.emotion);
              const emotionColor = getEmotionColor(diary.emotion);
              return (
                <div 
                  key={diary.id} 
                  className={styles.diaryCard} 
                  data-testid="diary-card"
                  onClick={() => handleDiaryCardClick(diary.id)}
                >
                  <div className={styles.cardImageWrap}>
                    <Image
                      className={styles.cardImage}
                      src={imageSrc}
                      alt={emotionLabel}
                      width={274}
                      height={208}
                    />
                    {isDeleteIconVisible() && (
                      <div 
                        className={styles.closeIcon}
                        onClick={(e) => handleDeleteClick(e, diary.id)}
                      >
                        <Image
                          src="/icons/close_outline_light_m.svg"
                          alt="close"
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span 
                        className={styles.cardEmotion}
                        style={{ color: emotionColor }}
                        data-testid="diary-emotion"
                      >
                        {emotionLabel}
                      </span>
                      <span className={styles.cardDate} data-testid="diary-date">{diary.date}</span>
                    </div>
                    <p className={styles.cardTitle} data-testid="diary-title">{diary.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className={styles.gap}></div>
      
      {/* 페이지네이션은 데이터가 있을 때만 표시 */}
      {displayDiaries.length > 0 && paginationState.totalPages >= 1 && (
        <div className={styles.pagination}>
          <Pagination
            variant="primary"
            size="medium"
            theme="light"
            currentPage={paginationState.currentPage}
            totalPages={paginationState.totalPages}
            onPageChange={handlePageChange}
            showArrows={true}
            visiblePages={5}
            className={styles.paginationWidth}
          />
        </div>
      )}
      
      <div className={styles.gap}></div>
    </div>
  );
};

export default Diaries;
