import React, { useState } from 'react';
import styles from './styles.module.css';
import Selectbox from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import Image from 'next/image';

const Diaries: React.FC = () => {
  return (
    <div className={styles.container}>
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
        {/* 메인 콘텐츠 영역 */}
      </div>
      
      <div className={styles.gap}></div>
      
      <div className={styles.pagination}>
        {/* 페이지네이션 영역 */}
      </div>
      
      <div className={styles.gap}></div>
    </div>
  );
};

export default Diaries;
