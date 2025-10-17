'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/commons/components/button';
import Input from '@/commons/components/input';
import { getEmotionImage, getEmotionLabel, getEmotionColor } from '@/commons/constants/enum';
import { useDiaryBinding } from './hooks/index.binding.hook';
import styles from './styles.module.css';

/**
 * DiariesDetail 컴포넌트 Props 인터페이스
 */
export interface DiariesDetailProps {
  /**
   * 일기 ID (다이나믹 라우팅에서 추출된 값)
   */
  diaryId: string;
}

/**
 * 일기 상세 페이지 컴포넌트
 * 
 * 다이나믹 라우팅된 [id]를 통해 로컬스토리지의 실제 일기 데이터를 표시합니다.
 * 
 * @param {DiariesDetailProps} props - 컴포넌트 props
 * @param {string} props.diaryId - 일기 ID
 * 
 * @example
 * ```tsx
 * <DiariesDetail diaryId="1" />
 * ```
 */
export default function DiariesDetail({ diaryId }: DiariesDetailProps) {
  const { diary, isLoading, error } = useDiaryBinding(diaryId);

  const handleCopyContent = () => {
    if (diary) {
      navigator.clipboard.writeText(diary.content);
      // 복사 완료 알림 로직 추가 가능
    }
  };

  const handleEdit = () => {
    // 수정 로직 추가
    console.log('수정 버튼 클릭');
  };

  const handleDelete = () => {
    // 삭제 로직 추가
    console.log('삭제 버튼 클릭');
  };

  // 날짜 포맷팅 함수 (yyyy. mm. dd. 형식)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diary-detail-page">
        <div className={styles.gap64}></div>
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <h1 className={styles.titleText}>로딩 중...</h1>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container} data-testid="diary-detail-page">
        <div className={styles.gap64}></div>
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <h1 className={styles.titleText}>오류 발생</h1>
          </div>
          <div className={styles.emotionDateSection}>
            <p className={styles.errorText}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 일기 데이터가 없는 경우 처리
  if (!diary) {
    return (
      <div className={styles.container} data-testid="diary-detail-page">
        <div className={styles.gap64}></div>
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <h1 className={styles.titleText}>일기를 찾을 수 없습니다</h1>
          </div>
          <div className={styles.emotionDateSection}>
            <p className={styles.notFoundText}>요청하신 일기를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="diary-detail-page">
      {/* gap: 1168 * 64 */}
      <div className={styles.gap64}></div>
      
      {/* detail-title: 1168 * 84 */}
      <div className={styles.titleSection}>
        {/* 타이틀 영역 */}
        <div className={styles.titleHeader}>
          <h1 className={styles.titleText}>{diary.title}</h1>
        </div>
        
        {/* 감정&날짜 영역 */}
        <div className={styles.emotionDateSection}>
          <div className={styles.emotionSection}>
            <Image
              src={getEmotionImage(diary.emotion, 's')}
              alt={getEmotionLabel(diary.emotion)}
              width={32}
              height={32}
              className={styles.emotionIcon}
            />
            <span 
              className={styles.emotionText}
              style={{ color: getEmotionColor(diary.emotion) }}
              data-testid="diary-emotion"
            >
              {getEmotionLabel(diary.emotion)}
            </span>
          </div>
          
          <div className={styles.dateSection}>
            <span className={styles.dateText}>{formatDate(diary.createdAt)}</span>
            <span className={styles.dateLabel}>작성</span>
          </div>
        </div>
      </div>
      
      {/* gap: 1168 * 24 */}
      <div className={styles.gap24}></div>
      
      {/* detail-content: 1168 * 169 */}
      <div className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h2 className={styles.contentLabel}>내용</h2>
        </div>
        
        <div className={styles.contentBody}>
          <p className={styles.contentText}>{diary.content}</p>
        </div>
        
        <div className={styles.contentActions}>
          <button 
            className={styles.copyButton}
            onClick={handleCopyContent}
          >
            <Image
              src="/icons/copy_outline_light_m.svg"
              alt="복사"
              width={24}
              height={24}
              className={styles.copyIcon}
            />
            <span className={styles.copyText}>내용 복사</span>
          </button>
        </div>
      </div>
      
      {/* gap: 1168 * 24 */}
      <div className={styles.gap24}></div>
      
      {/* detail-footer: 1168 * 56 */}
      <div className={styles.detailFooter}>
        <div className={styles.footerActions}>
          <Button 
            variant="secondary" 
            size="medium" 
            theme="light"
            className={styles.editButton}
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button 
            variant="secondary" 
            size="medium" 
            theme="light"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>
      
      {/* gap: 1168 * 24 */}
      <div className={styles.gap24}></div>
      
      {/* retrospect-input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <div className={styles.retrospectInputLabel}>회고</div>
        <div className={styles.retrospectInputWrapper}>
          <div className={styles.retrospectInputField}>
            <Input 
              variant="primary"
              size="medium"
              theme="light"
              placeholder="회고를 남겨보세요."
            />
          </div>
          <Button 
            variant="primary" 
            size="medium" 
            theme="light"
            className={styles.saveRetrospectButton}
          >
            입력
          </Button>
        </div>
      </div>
      
      {/* gap: 1168 * 16 */}
      <div className={styles.gap16}></div>
      
      {/* retrospect-list: 1168 * 72 */}
      <div className={styles.retrospectList}>
        <div className={styles.retrospectItem}>
          <p className={styles.retrospectItemText}>
            3년이 지나고 다시 보니 이때가 그립다.
          </p>
          <span className={styles.retrospectItemDateText}>[2024. 09. 24]</span>
        </div>
        
        <div className={styles.retrospectLine}></div>
        
        <div className={styles.retrospectItem}>
          <p className={styles.retrospectItemText}>
            3년이 지나고 다시 보니 이때가 그립다.
          </p>
          <span className={styles.retrospectItemDateText}>[2024. 09. 24]</span>
        </div>
      </div>
    </div>
  );
}