'use client';

import React, { useState } from 'react';
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
  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 12개씩 한 페이지로 설정

  // 권한 분기 훅
  const { handleDiaryWriteClick } = useDiaryWriteAuth();

  // 데이터 바인딩 훅
  const { diaries, isLoading, error } = useDiaryBinding();

  // 검색 기능 훅
  const { 
    searchQuery, 
    selectedEmotion, 
    filteredDiaries, 
    isSearchActive,
    handleSearchChange, 
    handleEmotionChange, 
    handleSearch
    // handleClearSearch 
  } = useSearch(diaries);

  // 검색 결과에 따른 데이터 선택
  const displayDiaries = isSearchActive ? filteredDiaries : diaries;
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(displayDiaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageDiaries = displayDiaries.slice(startIndex, endIndex);

  // 링크 라우팅 훅
  const { handleDiaryCardClick, handleDeleteIconClick } = useLinkRouting();

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 데이터가 변경될 때 첫 페이지로 리셋
  React.useEffect(() => {
    setCurrentPage(1);
  }, [displayDiaries.length]);

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
      
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <Selectbox
            variant="primary"
            theme="light"
            size="large"
            className={styles.selectWidth}
            options={[
              { value: 'all', label: '전체' },
              { value: 'Happy', label: '행복' },
              { value: 'Sad', label: '슬픔' },
              { value: 'Angry', label: '분노' },
              { value: 'Surprise', label: '놀람' },
              { value: 'Etc', label: '기타' },
            ]}
            value={selectedEmotion}
            onChange={handleEmotionChange}
          />

          <Searchbar
            variant="primary"
            theme="light"
            size="medium"
            placeholder="검색어를 입력해 주세요."
            className={styles.searchWidth}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        <Button
          variant="primary"
          theme="light"
          size="medium"
          className={styles.buttonWidth}
          onClick={handleDiaryWriteClick}
          data-testid="diary-write-button"
          icon={
            <Image
              src="/icons/plus_outline_light_m.svg"
              alt="plus"
              width={24}
              height={24}
            />
          }
          iconPosition="left"
        >
          일기쓰기
        </Button>
      </div>
      
      <div className={styles.gap}></div>
      
      <div className={styles.main}>
        {displayDiaries.length === 0 ? (
          // 빈 상태 처리: localStorage에 일기 데이터가 없거나 검색 결과가 없을 때
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {isSearchActive ? '검색 결과가 없습니다.' : '등록된 일기가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className={styles.cardFlex}>
            {currentPageDiaries.map((diary: DiaryItem) => {
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
                    <div 
                      className={styles.closeIcon}
                      onClick={(e) => handleDeleteIconClick(e)}
                    >
                      <Image
                        src="/icons/close_outline_light_m.svg"
                        alt="close"
                        width={24}
                        height={24}
                      />
                    </div>
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
      {displayDiaries.length > 0 && totalPages >= 1 && (
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="primary"
            theme="light"
            size="medium"
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
