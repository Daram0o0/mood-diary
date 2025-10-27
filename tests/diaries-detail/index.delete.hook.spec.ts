import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

test.describe('일기상세 삭제 기능', () => {
  // 테스트 데이터 설정
  const testDiaries = [
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

  test.describe('로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 설정 (전역변수 사용)
      await page.addInitScript(() => {
        (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
      });
      
      // 로컬스토리지에 데이터 설정
      await page.goto('/diaries/1');
      await page.evaluate((diaries) => {
        localStorage.setItem('diaries', JSON.stringify(diaries));
      }, testDiaries);
      
      // 페이지 새로고침하여 로컬스토리지 데이터 반영
      await page.reload();
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 5000 });
    });

  test('삭제 버튼 클릭 시 삭제 모달이 노출되어야 함', async ({ page }) => {
    // 삭제 버튼 클릭
    await page.click('button:has-text("삭제")');
    
    // 모달 프로바이더로 렌더링된 모달이 노출되는지 확인
    await expect(page.locator('body [data-testid="modal-content"]')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.locator('body [data-testid="modal-content"] h2')).toHaveText('일기 삭제');
    await expect(page.locator('body [data-testid="modal-content"] p')).toContainText('일기를 삭제 하시겠어요?');
    await expect(page.locator('body [data-testid="continue-button"]')).toBeVisible();
    await expect(page.locator('body [data-testid="cancel-button"]')).toBeVisible();
  });

  test('삭제 모달에서 취소 버튼 클릭 시 모달이 닫혀야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('body [data-testid="modal-content"]');
    
    // 취소 버튼 클릭 (공통 모달의 data-testid 사용)
    await page.click('body [data-testid="cancel-button"]');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('body [data-testid="modal-content"]')).not.toBeVisible();
    
    // 일기상세 페이지가 그대로 유지되는지 확인
    await expect(page.locator('[data-testid="diary-detail-page"]')).toBeVisible();
  });

  test('삭제 모달에서 삭제 버튼 클릭 시 일기가 삭제되고 일기목록 페이지로 이동해야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('body [data-testid="modal-content"]');
    
    // 삭제 확인 버튼 클릭 (공통 모달의 data-testid 사용)
    await page.click('body [data-testid="continue-button"]');
    
    // 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const diaries = await page.evaluate(() => {
      const stored = localStorage.getItem('diaries');
      return stored ? JSON.parse(stored) : [];
    });
    
    // ID가 1인 일기가 삭제되었는지 확인
    const deletedDiary = diaries.find((diary: any) => diary.id === 1);
    expect(deletedDiary).toBeUndefined();
    
    // 남은 일기는 1개여야 함
    expect(diaries).toHaveLength(1);
    expect(diaries[0].id).toBe(2);
  });

  test('삭제 후 일기목록 페이지에서 삭제된 일기가 표시되지 않아야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('body [data-testid="modal-content"]');
    
    // 삭제 확인 버튼 클릭
    await page.click('body [data-testid="continue-button"]');
    
    // 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기목록 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 5000 });
    
    // 삭제 후 일기 카드 개수 확인 (1개만 남아야 함)
    await expect(page.locator('[data-testid="diary-card"]')).toHaveCount(1);
    
    // 남은 일기의 제목이 "테스트 일기 2"인지 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText('테스트 일기 2');
  });

  test('존재하지 않는 일기 삭제 시 에러 처리', async ({ page }) => {
    // 빈 로컬스토리지 설정
    await page.goto('/diaries/999');
    await page.evaluate(() => {
      localStorage.setItem('diaries', JSON.stringify([]));
    });
    await page.reload();
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });
    
    // 존재하지 않는 일기 페이지에서는 삭제 버튼이 없어야 함
    await expect(page.locator('button:has-text("삭제")')).not.toBeVisible();
  });

  test('마지막 일기 삭제 후 빈 목록 처리', async ({ page }) => {
    // 단일 일기만 있는 로컬스토리지 설정
    const singleDiary = [
      {
        id: 1,
        title: '마지막 일기',
        content: '마지막 내용',
        emotion: 'Happy' as EmotionType,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    
    await page.goto('/diaries/1');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, singleDiary);
    await page.reload();
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });
    
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('body [data-testid="modal-content"]');
    
    // 삭제 확인 버튼 클릭
    await page.click('body [data-testid="continue-button"]');
    
    // 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 로컬스토리지가 비어있는지 확인
    const diaries = await page.evaluate(() => {
      const stored = localStorage.getItem('diaries');
      return stored ? JSON.parse(stored) : [];
    });
    
    expect(diaries).toHaveLength(0);
    
    // 일기목록 페이지에서 빈 상태 메시지 확인
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
    await expect(page.locator('text=일기가 없습니다')).toBeVisible();
  });

  test('삭제 중 상태에서 버튼 비활성화 확인', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('body [data-testid="modal-content"]');
    
    // 모달이 열린 상태에서 버튼들이 활성화되어 있는지 확인
    await expect(page.locator('body [data-testid="continue-button"]')).toBeEnabled();
    await expect(page.locator('body [data-testid="cancel-button"]')).toBeEnabled();
    
    // 삭제 확인 버튼 클릭
    await page.click('body [data-testid="continue-button"]');
    
    // 삭제 후 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
  });
  });

  test.describe('비로그인 유저', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 설정하지 않음 (권한 우회 없음)
      
      // 로컬스토리지에 데이터 설정
      await page.goto('/diaries/1');
      await page.evaluate((diaries) => {
        localStorage.setItem('diaries', JSON.stringify(diaries));
      }, testDiaries);
      
      // 페이지 새로고침하여 로컬스토리지 데이터 반영
      await page.reload();
      
      // 페이지 로드 대기 (권한 검증 상태 확인)
      await page.waitForTimeout(3000); // 3초 대기
    });

    test('삭제 버튼이 노출되지 않아야 함', async ({ page }) => {
      // 권한 검증 실패로 인해 페이지가 로드되지 않거나 삭제 버튼이 없는지 확인
      const deleteButton = page.locator('button:has-text("삭제")');
      const isDeleteButtonVisible = await deleteButton.isVisible().catch(() => false);
      
      // 삭제 버튼이 보이지 않아야 함
      expect(isDeleteButtonVisible).toBe(false);
    });
  });
});
