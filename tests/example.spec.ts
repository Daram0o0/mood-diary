import { test, expect } from '@playwright/test';

test('홈페이지 로드 테스트', async ({ page }) => {
  await page.goto('/');
  
  // 페이지 제목 확인
  await expect(page).toHaveTitle(/Mood Diary/);
  
  // 페이지가 정상적으로 로드되었는지 확인
  await expect(page.locator('body')).toBeVisible();
});

test('네비게이션 테스트', async ({ page }) => {
  await page.goto('/');
  
  // 메인 네비게이션 요소들이 있는지 확인
  const navigation = page.locator('nav');
  await expect(navigation).toBeVisible();
});
