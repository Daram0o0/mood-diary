'use client';

import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import { useDiaryModal } from './index.modal.hook';

/**
 * 일기쓰기 버튼 권한 분기 Hook
 * 
 * 일기쓰기 버튼 클릭 시 로그인 상태에 따라 다른 동작을 수행합니다.
 * - 로그인된 사용자: 일기쓰기 모달 표시
 * - 비로그인 사용자: 로그인 요청 모달 표시
 * 
 * @example
 * ```tsx
 * const { handleDiaryWriteClick } = useDiaryWriteAuth();
 * 
 * <Button onClick={handleDiaryWriteClick}>
 *   일기쓰기
 * </Button>
 * ```
 */
export const useDiaryWriteAuth = () => {
  const { checkAuth } = useAuthGuard();
  const { openDiaryModal } = useDiaryModal();

  /**
   * 일기쓰기 버튼 클릭 핸들러
   * 
   * 권한 검증을 수행하고, 권한이 있는 경우 일기쓰기 모달을 표시합니다.
   * 권한이 없는 경우 로그인 요청 모달이 자동으로 표시됩니다.
   */
  const handleDiaryWriteClick = () => {
    // 권한 검증 실행
    const authResult = checkAuth({
      bypassInTest: true, // 테스트 환경에서 우회 허용
      showModal: true,    // 권한 없을 때 모달 표시
    });

    // 권한이 있는 경우에만 일기쓰기 모달 표시
    if (authResult.isAuthorized) {
      openDiaryModal();
    }
  };

  return {
    /**
     * 일기쓰기 버튼 클릭 핸들러
     */
    handleDiaryWriteClick,
  };
};

export default useDiaryWriteAuth;