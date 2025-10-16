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
import { useDiaryModal } from './hooks/index.link.modal.hook';
import { useDiaryBinding } from './hooks/index.binding.hook';

const Diaries: React.FC = () => {
  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // 피그마 디자인에 맞춰 5페이지로 설정

  // 모달 연결 훅
  const { openDiaryModal } = useDiaryModal();

  // 데이터 바인딩 훅
  const { diaries, isLoading, error } = useDiaryBinding();

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 일기쓰기 버튼 클릭 핸들러
  const handleDiaryWriteClick = () => {
    openDiaryModal();
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diaries-page">
        <div className={styles.gap}></div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
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
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
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
              { value: 'happy', label: '행복' },
              { value: 'sad', label: '슬픔' },
              { value: 'angry', label: '분노' },
              { value: 'surprise', label: '놀람' },
              { value: 'etc', label: '기타' },
            ]}
            value={'all'}
          />

          <Searchbar
            variant="primary"
            theme="light"
            size="medium"
            placeholder="검색어를 입력해 주세요."
            className={styles.searchWidth}
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
        <div className={styles.cardFlex}>
          {diaries.map((diary) => {
            const imageSrc = getEmotionImage(diary.emotion, 'm');
            const emotionLabel = getEmotionLabel(diary.emotion);
            const emotionColor = getEmotionColor(diary.emotion);
            return (
              <div key={diary.id} className={styles.diaryCard} data-testid="diary-card">
                <div className={styles.cardImageWrap}>
                  <Image
                    className={styles.cardImage}
                    src={imageSrc}
                    alt={emotionLabel}
                    width={274}
                    height={208}
                  />
                  <div className={styles.closeIcon}>
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
      </div>
      
      <div className={styles.gap}></div>
      
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
      
      <div className={styles.gap}></div>
    </div>
  );
};

export default Diaries;
