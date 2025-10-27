import { test, expect } from '@playwright/test';

test.describe('간단한 페이지 테스트', () => {
  test('일기상세 페이지 로드 테스트', async ({ page }) => {
    // 테스트 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '테스트 일기 1',
        content: '테스트 내용 1',
        emotion: 'Happy',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    // 로컬스토리지에 데이터 설정
    await page.goto('/diaries/1');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침
    await page.reload();
    
    // 페이지 로드 대기 (더 긴 timeout)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 5000 });
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('[data-testid="diary-detail-page"]')).toBeVisible();
    
    // 삭제 버튼이 있는지 확인
    await expect(page.locator('button:has-text("삭제")')).toBeVisible();
  });
});
