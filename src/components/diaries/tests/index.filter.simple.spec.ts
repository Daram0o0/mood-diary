import { test, expect } from '@playwright/test';

test.describe('일기 필터 기능 간단 테스트', () => {
  test('페이지 로드 및 필터 선택박스 확인', async ({ page }) => {
    // 페이지 이동
    await page.goto('/diaries', { waitUntil: 'networkidle' });
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 15000 });
    
    // 필터 선택박스 확인 (커스텀 드롭다운)
    const selectbox = page.locator('[role="combobox"]').first();
    await expect(selectbox).toBeVisible();
    
    // 드롭다운 열기
    await selectbox.click();
    
    // 선택박스 옵션 확인
    const options = page.locator('[role="option"]');
    await expect(options).toHaveCount(6); // 전체 + 5개 감정
    
    console.log('✅ 페이지 로드 및 필터 선택박스 확인 완료');
  });

  test('필터 옵션 텍스트 확인', async ({ page }) => {
    // 페이지 이동
    await page.goto('/diaries', { waitUntil: 'networkidle' });
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 15000 });
    
    // 드롭다운 열기
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    // 각 옵션의 텍스트 확인
    const options = page.locator('[role="option"]');
    await expect(options.nth(0)).toHaveText('전체');
    await expect(options.nth(1)).toHaveText('행복해요');
    await expect(options.nth(2)).toHaveText('슬퍼요');
    await expect(options.nth(3)).toHaveText('화나요'); // 순서가 다름
    await expect(options.nth(4)).toHaveText('놀랐어요'); // 순서가 다름
    await expect(options.nth(5)).toHaveText('기타');
    
    console.log('✅ 필터 옵션 텍스트 확인 완료');
  });
});
