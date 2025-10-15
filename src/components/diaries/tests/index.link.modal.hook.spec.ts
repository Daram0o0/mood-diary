import { test, expect } from '@playwright/test';

/**
 * Diary Modal Link E2E 테스트
 * 
 * 일기쓰기 모달 연결 기능을 테스트합니다.
 * - 일기쓰기 버튼 클릭 시 모달 열기
 * - 모달 배경 클릭 시 모달 닫기
 * - 모달 내 닫기 버튼 클릭 시 모달 닫기
 * - 모달 내용 클릭 시 모달 유지
 */
test.describe('Diary Modal Link Tests', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test('일기쓰기 버튼 클릭 시 모달이 열리는지 확인', async ({ page }) => {
    // 일기쓰기 버튼 클릭
    await page.click('button:has-text("일기쓰기")');
    
    // 모달이 나타나는지 확인 (모달 프로바이더의 원래 구조 사용)
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    await expect(page.locator('.relative.z-10.bg-white')).toBeVisible();
    
    // 모달 내용에 "일기 쓰기" 제목이 있는지 확인
    await expect(page.locator('h1:has-text("일기 쓰기")')).toBeVisible();
  });

  test('모달이 페이지 위 중앙에 overlay되어 표시되는지 확인', async ({ page }) => {
    // 일기쓰기 버튼 클릭
    await page.click('button:has-text("일기쓰기")');
    
    // 모달이 나타나는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    
    // 모달이 중앙에 위치하는지 확인 (flex items-center justify-center 클래스 확인)
    const modalContainer = page.locator('.fixed.inset-0.z-50');
    await expect(modalContainer).toHaveClass(/flex.*items-center.*justify-center/);
    
    // 모달이 기존 페이지 위에 overlay되어 있는지 확인 (z-50 클래스 확인)
    await expect(modalContainer).toHaveClass(/z-50/);
    
    // 모달 내용이 중앙에 위치하는지 확인
    const modalContent = page.locator('.relative.z-10.bg-white');
    await expect(modalContent).toBeVisible();
  });

  test('모달 배경 클릭 시 모달이 닫히는지 확인', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('button:has-text("일기쓰기")');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    
    // 모달 배경 클릭 (모달 프로바이더의 원래 구조 사용)
    await page.click('.fixed.inset-0.z-50', { position: { x: 10, y: 10 } });
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('모달 내 닫기 버튼 클릭 시 모달이 닫히는지 확인', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('button:has-text("일기쓰기")');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    
    // 모달 내 닫기 버튼 클릭
    await page.click('button:has-text("닫기")');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('모달 내용 클릭 시 모달이 닫히지 않는지 확인', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('button:has-text("일기쓰기")');
    
    // 모달이 열렸는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    
    // 모달 내용 영역 클릭
    await page.click('.relative.z-10.bg-white');
    
    // 모달이 여전히 열려있는지 확인
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });
});
