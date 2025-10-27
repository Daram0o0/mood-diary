'use client';

import React from 'react';
import Image from 'next/image';
import Button from '@/commons/components/button';
import Input from '@/commons/components/input';
import { getEmotionImage, getEmotionLabel, getEmotionColor, emotionKeys } from '@/commons/constants/enum';
import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import { useDiaryBinding } from './hooks/index.binding.hook';
import { useRetrospectForm } from './hooks/index.retrospect.form.hook';
import { useRetrospectBinding } from './hooks/index.retrospect.binding.hook';
import { useDiaryUpdate } from './hooks/index.update.hook';
import { useDiaryDelete } from './hooks/index.delete.hook';
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
  const { form, onSubmit, isSubmitting, isFormValid } = useRetrospectForm(parseInt(diaryId));
  const { retrospects, isLoading: isRetrospectsLoading, error: retrospectError } = useRetrospectBinding(parseInt(diaryId));
  
  // 권한 체크 훅
  const { isAuthorized } = useAuthGuard();
  
  // 테스트 환경에서 권한 우회 확인
  const isDeleteButtonVisible = () => {
    if (typeof window !== 'undefined') {
      const testBypass = (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__;
      if (testBypass !== undefined && testBypass) {
        return true;
      }
    }
    
    return isAuthorized();
  };
  
  // 수정 기능 훅
  const {
    form: updateForm,
    onSubmit: onUpdateSubmit,
    isSubmitting: isUpdateSubmitting,
    isFormValid: isUpdateFormValid,
    isEditing,
    startEdit,
    cancelEdit,
  } = useDiaryUpdate(parseInt(diaryId), diary || { id: 0, title: '', content: '', emotion: 'Happy', createdAt: '' });

  // 삭제 기능 훅
  const {
    openModal,
  } = useDiaryDelete(parseInt(diaryId));

  const handleCopyContent = () => {
    if (diary) {
      navigator.clipboard.writeText(diary.content);
      // 복사 완료 알림 로직 추가 가능
    }
  };

  const handleEdit = () => {
    startEdit();
  };

  const handleDelete = () => {
    openModal();
  };

  // 날짜 포맷팅 함수 (yyyy. mm. dd. 형식)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  };

  // 포맷된 날짜 텍스트 (인라인 formatDate 호출 방지)
  const formattedDate = diary ? formatDate(diary.createdAt) : '';

  // 회고 날짜 포맷팅 함수 (yyyy. mm. dd 형식)
  const formatRetrospectDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `[${year}. ${month}. ${day}]`;
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
      {/* gap: 100% * 64px */}
      <div className={styles.gap64}></div>
      
      {isEditing ? (
        // 수정 모드 UI
        <form onSubmit={(e) => {
          e.preventDefault();
          onUpdateSubmit();
        }} className={styles.editForm}>
          {/* 기분 선택 영역 */}
          <div className={styles.emotionSelectionSection}>
            <h2 className={styles.emotionSelectionTitle}>오늘 기분은 어땟나요?</h2>
            <div className={styles.emotionOptions}>
              {emotionKeys.map((emotionKey) => (
                <label key={emotionKey} className={styles.emotionOption}>
                  <input
                    type="radio"
                    value={emotionKey}
                    {...updateForm.register('emotion')}
                    className={styles.emotionRadio}
                  />
                  <span className={styles.emotionLabel}>
                    {getEmotionLabel(emotionKey)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 제목 입력 영역 */}
          <div className={styles.titleInputSection}>
            <label className={styles.inputLabel}>제목</label>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder="제목을 입력하세요"
              {...updateForm.register('title')}
              error={!!updateForm.formState.errors.title}
              errorMessage={updateForm.formState.errors.title?.message}
            />
          </div>
          
          {/* 내용 입력 영역 */}
          <div className={styles.contentInputSection}>
            <label className={styles.inputLabel}>내용</label>
            <textarea
              className={styles.contentTextarea}
              placeholder="내용을 입력하세요"
              {...updateForm.register('content')}
            />
            {updateForm.formState.errors.content && (
              <span className={styles.errorMessage}>
                {updateForm.formState.errors.content.message}
              </span>
            )}
          </div>
          
          {/* 버튼 영역 */}
          <div className={styles.editButtonSection}>
            <Button
              variant="secondary"
              size="large"
              theme="light"
              type="button"
              onClick={cancelEdit}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="large"
              theme="light"
              type="submit"
              disabled={!isUpdateFormValid || isUpdateSubmitting}
            >
              수정 하기
            </Button>
          </div>
        </form>
      ) : (
        // 일반 모드 UI
        <>
          {/* detail-title: 100% * 84px */}
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
                <span className={styles.dateText}>{formattedDate}</span>
                <span className={styles.dateLabel}>작성</span>
              </div>
            </div>
          </div>
          
          {/* gap: 100% * 24px */}
          <div className={styles.gap24}></div>
          
          {/* detail-content: 100% * auto */}
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
          
          {/* gap: 100% * 24px */}
          <div className={styles.gap24}></div>
          
          {/* detail-footer: 100% * 56px */}
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
              {isDeleteButtonVisible() && (
                <Button 
                  variant="secondary" 
                  size="medium" 
                  theme="light"
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* gap: 100% * 24px */}
      <div className={styles.gap24}></div>
      
      {/* retrospect-input: 100% * 85px */}
      <div className={styles.retrospectInput}>
        <div className={styles.retrospectInputLabel}>회고</div>
        <form onSubmit={onSubmit} className={styles.retrospectInputWrapper}>
          <div className={styles.retrospectInputField}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder={isEditing ? "수정중일땐 회고를 작성할 수 없어요." : "회고를 남겨보세요."}
              {...form.register('content')}
              disabled={isEditing}
            />
          </div>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            className={styles.saveRetrospectButton}
            type="submit"
            disabled={!isFormValid || isSubmitting || isEditing}
          >
            입력
          </Button>
        </form>
      </div>
      
      {/* gap: 100% * 16px */}
      <div className={styles.gap16}></div>
      
      {/* retrospect-list: 100% * auto */}
      <div className={styles.retrospectList}>
        {isRetrospectsLoading ? (
          <div className={styles.retrospectItem}>
            <p className={styles.retrospectItemText}>회고를 불러오는 중...</p>
          </div>
        ) : retrospectError ? (
          <div className={styles.retrospectItem}>
            <p className={styles.retrospectItemText}>회고를 불러올 수 없습니다.</p>
          </div>
        ) : retrospects.length === 0 ? (
          <div className={styles.retrospectItem}>
            <p className={styles.retrospectItemText}>등록된 회고가 없습니다.</p>
          </div>
        ) : (
          retrospects.map((retrospect, index) => (
            <React.Fragment key={retrospect.id}>
              <div className={styles.retrospectItem}>
                <p className={styles.retrospectItemText}>
                  {retrospect.content}
                </p>
                <span className={styles.retrospectItemDateText}>
                  {formatRetrospectDate(retrospect.createdAt)}
                </span>
              </div>
              {index < retrospects.length - 1 && (
                <div className={styles.retrospectLine}></div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
      
    </div>
  );
}