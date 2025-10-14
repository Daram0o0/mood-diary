'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/commons/components/button';
import Input from '@/commons/components/input';
import { EmotionType, getEmotionImage, getEmotionLabel, getEmotionColor } from '@/commons/constants/enum';
import styles from './styles.module.css';

// Mock 데이터 인터페이스
interface DiaryData {
  id: string;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

// Mock 데이터
const mockDiaryData: DiaryData = {
  id: '1',
  title: '이것은 타이틀 입니다.',
  content: '내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다',
  emotion: 'Happy',
  createdAt: '2024. 07. 12'
};

const DiariesDetail: React.FC = () => {
  const diary = mockDiaryData;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(diary.content);
    // 복사 완료 알림 로직 추가 가능
  };

  const handleEdit = () => {
    // 수정 로직 추가
    console.log('수정 버튼 클릭');
  };

  const handleDelete = () => {
    // 삭제 로직 추가
    console.log('삭제 버튼 클릭');
  };

  return (
    <div className={styles.container}>
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
            >
              {getEmotionLabel(diary.emotion)}
            </span>
          </div>
          
          <div className={styles.dateSection}>
            <span className={styles.dateText}>{diary.createdAt}</span>
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
};

export default DiariesDetail;