import { test, expect } from '@playwright/test';

/**
 * Layout Area Visibility E2E 테스트
 * 
 * 레이아웃 영역들의 표시/숨김 기능을 테스트합니다.
 * - 현재 경로에 따른 헤더 영역 표시/숨김
 * - 현재 경로에 따른 배너 영역 표시/숨김
 * - 현재 경로에 따른 네비게이션 영역 표시/숨김
 * - 현재 경로에 따른 푸터 영역 표시/숨김
 * - 다이나믹 라우팅 경로에서의 영역 표시/숨김
 */
test.describe('Layout Area Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 대기 (data-testid 기반)
    await page.goto('/');
    await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
  });

  test.describe('Header Area Visibility', () => {
    test('should show header and logo on /diaries page', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const header = page.locator('header');
      const logo = page.locator('[data-testid="header-logo"]');
      
      await expect(header).toBeVisible();
      await expect(logo).toBeVisible();
    });

    test.skip('should show header and logo on /pictures page', async ({ page }) => {
      await page.goto('/pictures');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const header = page.locator('header');
      const logo = page.locator('[data-testid="header-logo"]');
      
      await expect(header).toBeVisible();
      await expect(logo).toBeVisible();
    });

    test('should hide header and logo on /auth/login page', async ({ page }) => {
      await page.goto('/auth/login');
      
      const header = page.locator('header');
      const logo = page.locator('[data-testid="header-logo"]');
      
      await expect(header).not.toBeVisible();
      await expect(logo).not.toBeVisible();
    });

    test('should hide header and logo on /auth/signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const header = page.locator('header');
      const logo = page.locator('[data-testid="header-logo"]');
      
      await expect(header).not.toBeVisible();
      await expect(logo).not.toBeVisible();
    });
  });

  test.describe('Banner Area Visibility', () => {
    test('should show banner on /diaries page', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const banner = page.locator('div[class*="banner"]').first();
      
      await expect(banner).toBeVisible();
    });

    test.skip('should show banner on /pictures page', async ({ page }) => {
      await page.goto('/pictures');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const banner = page.locator('div[class*="banner"]').first();
      
      await expect(banner).toBeVisible();
    });

    test('should hide banner on /auth/login page', async ({ page }) => {
      await page.goto('/auth/login');
      
      const banner = page.locator('div[class*="banner"]').first();
      
      await expect(banner).not.toBeVisible();
    });

    test('should hide banner on /auth/signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const banner = page.locator('div[class*="banner"]').first();
      
      await expect(banner).not.toBeVisible();
    });
  });

  test.describe('Navigation Area Visibility', () => {
    test('should show navigation on /diaries page', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const navigation = page.locator('nav');
      const navDiaries = page.locator('[data-testid="nav-diaries"]');
      const navPictures = page.locator('[data-testid="nav-pictures"]');
      
      await expect(navigation).toBeVisible();
      await expect(navDiaries).toBeVisible();
      await expect(navPictures).toBeVisible();
    });

    test.skip('should show navigation on /pictures page', async ({ page }) => {
      await page.goto('/pictures');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const navigation = page.locator('nav');
      const navDiaries = page.locator('[data-testid="nav-diaries"]');
      const navPictures = page.locator('[data-testid="nav-pictures"]');
      
      await expect(navigation).toBeVisible();
      await expect(navDiaries).toBeVisible();
      await expect(navPictures).toBeVisible();
    });

    test('should hide navigation on /auth/login page', async ({ page }) => {
      await page.goto('/auth/login');
      
      const navigation = page.locator('nav');
      const navDiaries = page.locator('[data-testid="nav-diaries"]');
      const navPictures = page.locator('[data-testid="nav-pictures"]');
      
      await expect(navigation).not.toBeVisible();
      await expect(navDiaries).not.toBeVisible();
      await expect(navPictures).not.toBeVisible();
    });

    test('should hide navigation on /auth/signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const navigation = page.locator('nav');
      const navDiaries = page.locator('[data-testid="nav-diaries"]');
      const navPictures = page.locator('[data-testid="nav-pictures"]');
      
      await expect(navigation).not.toBeVisible();
      await expect(navDiaries).not.toBeVisible();
      await expect(navPictures).not.toBeVisible();
    });
  });

  test.describe('Footer Area Visibility', () => {
    test('should show footer on /diaries page', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const footer = page.locator('footer');
      
      await expect(footer).toBeVisible();
    });

    test.skip('should show footer on /pictures page', async ({ page }) => {
      await page.goto('/pictures');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const footer = page.locator('footer');
      
      await expect(footer).toBeVisible();
    });

    test('should hide footer on /auth/login page', async ({ page }) => {
      await page.goto('/auth/login');
      
      const footer = page.locator('footer');
      
      await expect(footer).not.toBeVisible();
    });

    test('should hide footer on /auth/signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      const footer = page.locator('footer');
      
      await expect(footer).not.toBeVisible();
    });
  });

  test.describe('Dynamic Route Tests', () => {
    test.skip('should show header, logo, footer but hide banner and navigation on diary detail page', async ({ page }) => {
      await page.goto('/diaries/1');
      // 다이나믹 라우팅 페이지에서는 header가 표시되므로 header 요소로 대기
      await page.locator('header').waitFor({ state: 'visible' });
      
      const header = page.locator('header');
      const logo = page.locator('[data-testid="header-logo"]');
      const banner = page.locator('div[class*="banner"]').first();
      const navigation = page.locator('nav');
      const footer = page.locator('footer');
      
      await expect(header).toBeVisible();
      await expect(logo).toBeVisible();
      await expect(banner).not.toBeVisible();
      await expect(navigation).not.toBeVisible();
      await expect(footer).toBeVisible();
    });
  });
});
