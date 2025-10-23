import { test, expect } from '@playwright/test';

/**
 * 일기쓰기 버튼 권한 분기 테스트
 * 
 * 비로그인 유저와 로그인 유저의 일기쓰기 버튼 클릭 시 동작을 테스트합니다.
 */
test.describe('일기쓰기 버튼 권한 분기 테스트', () => {
  
  /**
   * 비로그인 유저 시나리오 테스트
   * 
   * 1. /diaries에 접속하여 페이지 로드 확인
   * 2. 일기쓰기버튼 클릭
   * 3. 로그인요청모달 노출여부 확인
   */
  test('비로그인 유저 - 일기쓰기 버튼 클릭 시 로그인 모달 표시', async ({ page }) => {
    // 테스트 환경에서 비로그인 상태로 설정
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = false;
    });

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.goto('/diaries');
    await expect(page.locator('[data-testid="diaries-page"]')).toBeVisible();

    // 2. 일기쓰기버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 3. 로그인요청모달 노출여부 확인
    await expect(page.locator('[data-testid="modal-content"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('로그인이 필요합니다');
  });

  /**
   * 로그인 유저 시나리오 테스트
   * 
   * 1. /diaries에 접속하여 페이지 로드 확인
   * 2. 일기쓰기버튼 클릭
   * 3. 일기쓰기 페이지 모달 노출여부 확인
   */
  test('로그인 유저 - 일기쓰기 버튼 클릭 시 일기쓰기 모달 표시', async ({ page }) => {
    // 테스트 환경에서 로그인 상태로 설정
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = true;
    });

    // 1. /diaries에 접속하여 페이지 로드 확인
    await page.goto('/diaries');
    await expect(page.locator('[data-testid="diaries-page"]')).toBeVisible();

    // 2. 일기쓰기버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 3. 일기쓰기 페이지 모달 노출여부 확인
    // 일기쓰기 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="diary-write-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-write-modal"] h1').first()).toContainText('일기 쓰기');
  });
});