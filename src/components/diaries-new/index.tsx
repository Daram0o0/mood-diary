'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { emotions, EmotionType } from '@/commons/constants/enum';
import styles from './styles.module.css';

/**
 * DiariesNew 컴포넌트
 * 
 * 새로운 일기를 작성하는 컴포넌트
 * 감정 선택, 제목 입력, 내용 입력 기능을 제공합니다.
 * 
 * @example
 * ```tsx
 * <DiariesNew />
 * ```
 */
export default function DiariesNew() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotionType: EmotionType) => {
    setSelectedEmotion(emotionType);
  };

  // 제목 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 변경 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 닫기 핸들러
  const handleClose = () => {
    router.back();
  };

  // 등록 핸들러
  const handleSubmit = () => {
    if (!selectedEmotion || !title.trim() || !content.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // TODO: 일기 등록 API 호출
    console.log('일기 등록:', {
      emotion: selectedEmotion,
      title: title.trim(),
      content: content.trim(),
    });

    // 등록 후 일기 목록으로 이동
    router.push('/diaries');
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>일기쓰기</h1>
      </div>

      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionList}>
          {Object.entries(emotions).map(([key, emotion]) => (
            <label key={key} className={styles.emotionItem}>
              <input
                type="radio"
                name="emotion"
                value={key}
                checked={selectedEmotion === key}
                onChange={() => handleEmotionSelect(key as EmotionType)}
                className={styles.emotionRadio}
              />
              <span className={styles.emotionLabel}>{emotion.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input Title */}
      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          size="medium"
          theme="light"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={handleTitleChange}
          className={styles.titleInput}
        />
      </div>

      {/* Input Content */}
      <div className={styles.inputContent}>
        <textarea
          placeholder="오늘 하루는 어땠나요? 자유롭게 작성해보세요."
          value={content}
          onChange={handleContentChange}
          className={styles.contentTextarea}
        />
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