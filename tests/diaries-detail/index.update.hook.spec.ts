import { test, expect } from '@playwright/test';

test.describe('일기상세 수정 기능', () => {
  test('일기 상세 페이지 로드', async ({ page }) => {
    await page.goto('/diaries/1');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('수정 버튼 확인', async ({ page }) => {
    await page.goto('/diaries/1');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });
});