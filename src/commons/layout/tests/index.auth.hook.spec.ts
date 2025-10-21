import { test, expect } from '@playwright/test';

/**
 * Layout Authentication E2E 테스트
 * 
 * 레이아웃의 인증 상태에 따른 UI 표시 기능을 테스트합니다.
 * - 비로그인 상태에서 로그인 버튼 표시
 * - 로그인 상태에서 사용자 이름과 로그아웃 버튼 표시
 * - 로그인/로그아웃 기능 동작 확인
 */
test.describe('Layout Authentication Tests', () => {
  test.describe('비로그인 유저 테스트', () => {
    test('비회원으로 /diaries에 접속하여 페이지 로드 확인', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      // 페이지 로드 확인
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('layout의 로그인버튼 노출여부 확인', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      // 로그인 버튼 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toHaveText('로그인');
    });

    test('로그인버튼 클릭하여 /auth/login 페이지로 이동', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      // 로그인 버튼 클릭
      const loginButton = page.locator('[data-testid="login-button"]');
      await loginButton.click();
      
      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('로그인 유저 테스트', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 페이지로 이동
      await page.goto('/auth/login');
      await page.locator('[data-testid="auth-login-container"]').waitFor({ state: 'visible' });
      
      // 로그인 시도
      await page.fill('[data-testid="email-input"]', 'a@c.com');
      await page.fill('[data-testid="password-input"]', '1234qwer');
      await page.click('[data-testid="login-button"]');
      
      // 로그인 완료 모달 대기 및 클릭
      await page.locator('[data-testid="modal-content"]').waitFor({ state: 'visible' });
      await page.click('[data-testid="modal-confirm-button"]');
    });

    test('로그인 성공 후 /diaries 페이지 로드 확인', async ({ page }) => {
      // /diaries 페이지로 이동 확인
      await expect(page).toHaveURL('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('layout에서 유저이름, 로그아웃버튼 노출여부 확인', async ({ page }) => {
      // 사용자 이름 확인
      const userName = page.locator('[data-testid="user-name"]');
      await expect(userName).toBeVisible();
      await expect(userName).toHaveText('철수님');
      
      // 로그아웃 버튼 확인
      const logoutButton = page.locator('[data-testid="logout-button"]');
      await expect(logoutButton).toBeVisible();
      await expect(logoutButton).toHaveText('로그아웃');
    });

    test('로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인', async ({ page }) => {
      // 로그아웃 버튼 클릭
      const logoutButton = page.locator('[data-testid="logout-button"]');
      await logoutButton.click();
      
      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL('/auth/login');
    });

    test('/diaries에 접속하여 페이지 로드 확인', async ({ page }) => {
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('layout에 로그인버튼 노출여부 확인', async ({ page }) => {
      // 로그아웃 후 로그인 버튼 확인
      const logoutButton = page.locator('[data-testid="logout-button"]');
      await logoutButton.click();
      
      await page.goto('/diaries');
      await page.locator('[data-testid="header-logo"]').waitFor({ state: 'visible' });
      
      // 로그인 버튼 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toHaveText('로그인');
    });
  });
});
