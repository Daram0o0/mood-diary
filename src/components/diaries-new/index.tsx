'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { emotions, EmotionType, emotionKeys } from '@/commons/constants/enum';
import { useModal } from '@/commons/providers/modal/modal.provider';

/**
 * DiariesNew 컴포넌트
 * 
 * 일기 작성 폼 컴포넌트
 * 감정 선택, 제목/내용 입력, 등록/닫기 기능을 제공합니다.
 * 
 * @example
 * ```tsx
 * <DiariesNew />
 * ```
 */
export default function DiariesNew() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('Happy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // 모달 제어 훅
  const { closeTopModal } = useModal();

  /**
   * 감정 선택 핸들러
   * @param emotion - 선택된 감정 타입
   */
  const handleEmotionChange = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  /**
   * 일기 등록 핸들러
   */
  const handleSubmit = () => {
    // 일기 등록 로직
    console.log('일기 등록:', { selectedEmotion, title, content });
  };

  /**
   * 닫기 핸들러
   */
  const handleClose = () => {
    closeTopModal();
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>일기 쓰기</h1>
      </div>

      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionOptions}>
          {emotionKeys.map((key) => (
            <label key={key} className={styles.emotionOption}>
              <input
                type="radio"
                name="emotion"
                value={key}
                checked={selectedEmotion === key}
                onChange={() => handleEmotionChange(key)}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>{emotions[key].label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input Title and Content */}
      <div className={styles.inputContainer}>
        {/* Input Title */}
        <div className={styles.inputTitle}>
          <label className={styles.inputLabel}>제목</label>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            placeholder="제목을 입력합니다."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
          />
        </div>

        {/* Input Content */}
        <div className={styles.inputContent}>
          <label className={styles.inputLabel}>내용</label>
          <textarea
            className={styles.contentTextarea}
            placeholder="내용을 입력합니다."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleClose}
          className={styles.closeButton}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          size="medium"
          theme="light"
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
