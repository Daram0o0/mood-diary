import { test, expect } from '@playwright/test';

test.describe('Layout Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 대기 (data-testid 사용)
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]');
  });

  test('헤더 로고 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 로고 클릭
    await page.click('[data-testid="header-logo"]');
    
    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
  });

  test('일기보관함 메뉴 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 일기보관함 메뉴 클릭
    await page.click('[data-testid="nav-diaries"]');
    
    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
  });

  test('사진보관함 메뉴 클릭 시 사진목록 페이지로 이동', async ({ page }) => {
    // 사진보관함 메뉴 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // URL이 /pictures로 변경되었는지 확인
    await expect(page).toHaveURL('/pictures');
  });

  test('일기목록 페이지에서 일기보관함 메뉴가 액티브 상태', async ({ page }) => {
    // 일기목록 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]');
    
    // 일기보관함 메뉴가 액티브 상태인지 확인 (border-bottom 스타일 확인)
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTab/);
    
    // 사진보관함 메뉴가 비액티브 상태인지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).toHaveClass(/navTabInactive/);
  });

  test('사진목록 페이지에서 사진보관함 메뉴가 액티브 상태', async ({ page }) => {
    // 사진목록 페이지로 이동
    await page.goto('/pictures');
    await page.waitForSelector('[data-testid="header-logo"]');
    
    // 사진보관함 메뉴가 액티브 상태인지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).toHaveClass(/navTab/);
    
    // 일기보관함 메뉴가 비액티브 상태인지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTabInactive/);
  });

  test('네비게이션 메뉴 클릭 시 액티브 상태 변경', async ({ page }) => {
    // 일기목록 페이지에서 시작
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]');
    
    // 일기보관함이 액티브 상태인지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTab/);
    
    // 사진보관함 메뉴 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // 사진보관함이 액티브 상태로 변경되었는지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).toHaveClass(/navTab/);
    
    // 일기보관함이 비액티브 상태로 변경되었는지 확인
    await expect(diariesNav).toHaveClass(/navTabInactive/);
  });
});
