import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 테스트용 일기 데이터 타입
 */
interface TestDiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 삭제 기능 테스트
 * 
 * 권한 분기 기반의 일기 삭제 기능을 테스트합니다.
 * - 비로그인 유저: 삭제 아이콘 미노출
 * - 로그인 유저: 삭제 아이콘 노출 및 삭제 기능 동작
 */
test.describe('일기 삭제 기능', () => {
  // 테스트 데이터 설정
  const testDiaries: TestDiaryData[] = [
    {
      id: 1,
      title: '테스트 일기 1',
      content: '테스트 내용 1',
      emotion: 'Happy' as EmotionType,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      title: '테스트 일기 2',
      content: '테스트 내용 2',
      emotion: 'Sad' as EmotionType,
      createdAt: '2024-01-02T00:00:00.000Z'
    }
  ];

  test.describe('비로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 로컬스토리지에 테스트 데이터 설정
      await page.goto('/diaries');
      await page.evaluate((diaries: TestDiaryData[]) => {
        localStorage.setItem('diaries', JSON.stringify(diaries));
      }, testDiaries);
    });

    test('삭제 아이콘이 노출되지 않아야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인 (data-testid 기반)
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      // 삭제 아이콘들이 노출되지 않는지 확인 (CSS 모듈 클래스명 사용)
      const deleteIcons = await page.locator('[class*="closeIcon"]').count();
      expect(deleteIcons).toBe(0);
    });
  });

  test.describe('로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 설정 (전역변수 사용)
      await page.addInitScript(() => {
        (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
      });
      
      // 로컬스토리지에 테스트 데이터 설정
      await page.goto('/diaries');
      await page.evaluate((diaries: TestDiaryData[]) => {
        localStorage.setItem('diaries', JSON.stringify(diaries));
      }, testDiaries);
    });

    test('삭제 아이콘이 노출되어야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      
      // 삭제 아이콘들이 노출되는지 확인 (CSS 모듈 클래스명 사용)
      const deleteIcons = await page.locator('[class*="closeIcon"]').count();
      expect(deleteIcons).toBeGreaterThan(0);
    });

    test('삭제 아이콘 클릭 시 삭제 모달이 노출되어야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      // 첫 번째 삭제 아이콘 클릭 (CSS 모듈 클래스명 사용)
      await page.locator('[class*="closeIcon"]').first().click();
      
      // 삭제 모달이 노출되는지 확인
      await expect(page.locator('text=일기 삭제')).toBeVisible();
      await expect(page.locator('text=일기를 삭제 하시겠어요?')).toBeVisible();
      await expect(page.locator('text=취소')).toBeVisible();
      await expect(page.locator('body [data-testid="continue-button"]')).toBeVisible();
      
      // 모달 프로바이더를 사용하므로 모달이 화면 정중앙에 배치되는지 확인
      // 모달 프로바이더의 backdrop과 content가 올바르게 렌더링되는지 확인
      const modalContent = page.locator('body [data-testid="modal-content"]');
      await expect(modalContent).toBeVisible();
    });

    test('삭제 모달에서 취소 클릭 시 모달이 닫혀야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      // 첫 번째 삭제 아이콘 클릭 (CSS 모듈 클래스명 사용)
      await page.locator('[class*="closeIcon"]').first().click();
      
      // 삭제 모달 노출 확인
      await expect(page.locator('text=일기 삭제')).toBeVisible();
      
      // 취소 버튼 클릭 (모달 프로바이더의 data-testid 사용)
      await page.locator('body [data-testid="cancel-button"]').click();
      
      // 모달이 닫혔는지 확인
      await expect(page.locator('body [data-testid="modal-content"]')).not.toBeVisible();
      
      // 일기 카드가 여전히 존재하는지 확인
      await expect(page.locator('[data-testid="diary-card"]').first()).toBeVisible();
    });

    test('삭제 모달에서 삭제 클릭 시 일기가 삭제되어야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      // 삭제 전 일기 카드 개수 확인
      const initialCardCount = await page.locator('[data-testid="diary-card"]').count();
      expect(initialCardCount).toBeGreaterThan(0);
      
      // 첫 번째 삭제 아이콘 클릭 (CSS 모듈 클래스명 사용)
      await page.locator('[class*="closeIcon"]').first().click();
      
      // 삭제 모달 노출 확인
      await expect(page.locator('text=일기 삭제')).toBeVisible();
      
      // 삭제 버튼 클릭 (모달 프로바이더의 data-testid 사용)
      await page.locator('body [data-testid="continue-button"]').click();
      
      // 페이지 새로고침 대기 (data-testid 기반)
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 삭제 후 일기 카드 개수 확인 (1개 감소해야 함)
      const finalCardCount = await page.locator('[data-testid="diary-card"]').count();
      expect(finalCardCount).toBe(initialCardCount - 1);
    });

    test('모든 일기 삭제 후 빈 상태 메시지가 표시되어야 함', async ({ page }) => {
      // /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      // 일기 카드들이 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diary-card"]');
      
      // 모든 일기 삭제
      const cardCount = await page.locator('[data-testid="diary-card"]').count();
      
      for (let i = 0; i < cardCount; i++) {
        // 첫 번째 삭제 아이콘 클릭 (CSS 모듈 클래스명 사용)
        await page.locator('[class*="closeIcon"]').first().click();
        
        // 삭제 모달에서 삭제 버튼 클릭 (모달 프로바이더의 data-testid 사용)
        await page.locator('body [data-testid="continue-button"]').click();
        
        // 페이지 새로고침 대기 (data-testid 기반)
        await page.waitForSelector('[data-testid="diaries-page"]');
      }
      
      // 빈 상태 메시지 확인
      await expect(page.locator('[data-testid="empty-message"]')).toBeVisible();
      await expect(page.locator('text=등록된 일기가 없습니다.')).toBeVisible();
    });
  });
});
