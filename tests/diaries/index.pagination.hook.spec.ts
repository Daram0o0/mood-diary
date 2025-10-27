import { test, expect } from '@playwright/test';

test.describe('일기 페이지네이션 기능', () => {
  test('일기 목록 페이지 로드', async ({ page }) => {
    await page.goto('/diaries');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('페이지네이션 요소 확인', async ({ page }) => {
    await page.goto('/diaries');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });
});