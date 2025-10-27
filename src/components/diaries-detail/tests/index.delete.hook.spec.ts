import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

test.describe('일기상세 삭제 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
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
    
    // 로컬스토리지에 데이터 설정
    await page.goto('/diaries/1');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 로컬스토리지 데이터 반영
    await page.reload();
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });
  });

  test('삭제 버튼 클릭 시 삭제 모달이 노출되어야 함', async ({ page }) => {
    // 삭제 버튼 클릭
    await page.click('button:has-text("삭제")');
    
    // 삭제 모달이 노출되는지 확인
    await expect(page.locator('[data-testid="delete-modal"]')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.locator('[data-testid="delete-modal-title"]')).toHaveText('일기 삭제');
    await expect(page.locator('[data-testid="delete-modal-content"]')).toContainText('정말로 이 일기를 삭제하시겠습니까?');
    await expect(page.locator('[data-testid="delete-modal-cancel"]')).toBeVisible();
    await expect(page.locator('[data-testid="delete-modal-confirm"]')).toBeVisible();
  });

  test('삭제 모달에서 취소 버튼 클릭 시 모달이 닫혀야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('[data-testid="delete-modal"]');
    
    // 취소 버튼 클릭
    await page.click('[data-testid="delete-modal-cancel"]');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="delete-modal"]')).not.toBeVisible();
    
    // 일기상세 페이지가 그대로 유지되는지 확인
    await expect(page.locator('[data-testid="diary-detail-page"]')).toBeVisible();
  });

  test('삭제 모달에서 삭제 버튼 클릭 시 일기가 삭제되고 일기목록 페이지로 이동해야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('[data-testid="delete-modal"]');
    
    // 삭제 확인 버튼 클릭
    await page.click('[data-testid="delete-modal-confirm"]');
    
    // 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const diaries = await page.evaluate(() => {
      const stored = localStorage.getItem('diaries');
      return stored ? JSON.parse(stored) : [];
    });
    
    // ID가 1인 일기가 삭제되었는지 확인
    const deletedDiary = diaries.find((diary: { id: number }) => diary.id === 1);
    expect(deletedDiary).toBeUndefined();
    
    // 남은 일기는 1개여야 함
    expect(diaries).toHaveLength(1);
    expect(diaries[0].id).toBe(2);
  });

  test('삭제 후 일기목록 페이지에서 삭제된 일기가 표시되지 않아야 함', async ({ page }) => {
    // 삭제 버튼 클릭하여 모달 열기
    await page.click('button:has-text("삭제")');
    await page.waitForSelector('[data-testid="delete-modal"]');
    
    // 삭제 확인 버튼 클릭
    await page.click('[data-testid="delete-modal-confirm"]');
    
    // 일기목록 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기목록 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
    
    // 삭제된 일기(ID: 1)가 목록에 없는지 확인
    await expect(page.locator('[data-testid="diary-item-1"]')).not.toBeVisible();
    
    // 남은 일기(ID: 2)가 목록에 있는지 확인
    await expect(page.locator('[data-testid="diary-item-2"]')).toBeVisible();
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
    await page.waitForSelector('[data-testid="delete-modal"]');
    
    // 삭제 확인 버튼 클릭
    await page.click('[data-testid="delete-modal-confirm"]');
    
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
    await page.waitForSelector('[data-testid="delete-modal"]');
    
    // 삭제 확인 버튼 클릭 (비동기 처리 시뮬레이션)
    await page.click('[data-testid="delete-modal-confirm"]');
    
    // 삭제 중 상태에서 버튼들이 비활성화되는지 확인
    // (실제 구현에서는 isDeleting 상태에 따라 버튼이 비활성화됨)
    await expect(page.locator('[data-testid="delete-modal-cancel"]')).toBeDisabled();
    await expect(page.locator('[data-testid="delete-modal-confirm"]')).toBeDisabled();
  });
});
