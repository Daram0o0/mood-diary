import { test, expect } from '@playwright/test';

test.describe('기본 기능 테스트', () => {
  test('홈페이지 접근 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 페이지가 로드되었는지 확인
    await expect(page).toHaveTitle(/Mood Diary/);
    
    // 기본 요소들이 있는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('일기 목록 페이지 접근 테스트', async ({ page }) => {
    await page.goto('/diaries');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('일기 상세 페이지 접근 테스트', async ({ page }) => {
    await page.goto('/diaries/1');
    
    // 페이지가 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });
});
