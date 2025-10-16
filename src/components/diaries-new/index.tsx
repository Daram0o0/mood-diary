'use client';

import styles from './styles.module.css';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { emotions, emotionKeys } from '@/commons/constants/enum';
import { useDiaryModalClose } from './hooks/useDiaryModalClose.hook';
import { useDiaryForm } from './hooks/index.form.hook';

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
  // 모달 닫기 훅
  const { handleDiaryClose } = useDiaryModalClose();
  
  // 일기 폼 훅
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    handleEmotionChange,
    watchedFields,
  } = useDiaryForm();


  /**
   * 닫기 핸들러
   * 등록취소 모달을 표시
   */
  const handleClose = () => {
    handleDiaryClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper} data-testid="diary-write-modal">
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
                checked={watchedFields.emotion === key}
                onChange={() => handleEmotionChange(key)}
                className={styles.radioInput}
                data-testid={`emotion-${key.toLowerCase()}`}
              />
              <span className={styles.radioLabel}>{emotions[key].label}</span>
            </label>
          ))}
        </div>
        {errors.emotion && (
          <span className={styles.errorMessage} data-testid="emotion-error">
            {errors.emotion.message}
          </span>
        )}
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
            {...register('title')}
            className={styles.titleInput}
            data-testid="diary-title-input"
          />
          {errors.title && (
            <span className={styles.errorMessage} data-testid="title-error">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Input Content */}
        <div className={styles.inputContent}>
          <label className={styles.inputLabel}>내용</label>
          <textarea
            className={styles.contentTextarea}
            placeholder="내용을 입력합니다."
            {...register('content')}
            data-testid="diary-content-input"
          />
          {errors.content && (
            <span className={styles.errorMessage} data-testid="content-error">
              {errors.content.message}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Button
          type="button"
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleClose}
          className={styles.closeButton}
          data-testid="diary-close-button"
        >
          닫기
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          theme="light"
          disabled={!isValid}
          className={styles.submitButton}
          data-testid="diary-submit-button"
        >
          등록하기
        </Button>
      </div>
    </form>
  );
}
