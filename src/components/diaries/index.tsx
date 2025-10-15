'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Selectbox from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Pagination from '@/commons/components/pagination';
import Image from 'next/image';
import {
  EmotionType,
  getEmotionImage,
  getEmotionLabel,
  getEmotionColor,
} from '@/commons/constants/enum';
import { useDiaryModal } from './hooks/index.link.modal.hook';

type DiaryItem = {
  id: string;
  date: string; // YYYY. MM. DD 형식 (피그마 형식에 맞춤)
  emotion: EmotionType;
  title: string;
};

const mockDiaries: DiaryItem[] = [
  {
    id: '1',
    date: '2024. 03. 12',
    emotion: 'Sad',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '2',
    date: '2024. 03. 12',
    emotion: 'Surprise',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '3',
    date: '2024. 03. 12',
    emotion: 'Angry',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '4',
    date: '2024. 03. 12',
    emotion: 'Happy',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '5',
    date: '2024. 03. 12',
    emotion: 'Etc',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '6',
    date: '2024. 03. 12',
    emotion: 'Surprise',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '7',
    date: '2024. 03. 12',
    emotion: 'Angry',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '8',
    date: '2024. 03. 12',
    emotion: 'Happy',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '9',
    date: '2024. 03. 12',
    emotion: 'Sad',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '10',
    date: '2024. 03. 12',
    emotion: 'Surprise',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '11',
    date: '2024. 03. 12',
    emotion: 'Angry',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '12',
    date: '2024. 03. 12',
    emotion: 'Happy',
    title: '타이틀 영역 입니다.',
  },
];

const Diaries: React.FC = () => {
  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // 피그마 디자인에 맞춰 5페이지로 설정

  // 모달 연결 훅
  const { openDiaryModal } = useDiaryModal();

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 일기쓰기 버튼 클릭 핸들러
  const handleDiaryWriteClick = () => {
    openDiaryModal();
  };

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
          {mockDiaries.map((diary) => {
            const imageSrc = getEmotionImage(diary.emotion, 'm');
            const emotionLabel = getEmotionLabel(diary.emotion);
            const emotionColor = getEmotionColor(diary.emotion);
            return (
              <div key={diary.id} className={styles.diaryCard}>
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
                    >
                      {emotionLabel}
                    </span>
                    <span className={styles.cardDate}>{diary.date}</span>
                  </div>
                  <p className={styles.cardTitle}>{diary.title}</p>
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
