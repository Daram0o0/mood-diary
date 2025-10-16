import { test, expect } from '@playwright/test';

/**
 * 일기쓰기 모달 닫기 기능 테스트
 * 
 * TDD 기반으로 구현된 모달 닫기 기능을 테스트합니다.
 * - 닫기 버튼 클릭 시 등록취소 모달이 표시되는지 확인
 * - 등록취소 모달의 계속작성 버튼으로 자식 모달만 닫히는지 확인
 * - 등록취소 모달의 등록취소 버튼으로 모든 모달이 닫히는지 확인
 */
test.describe('일기쓰기 모달 닫기 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]');
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');
    
    // 일기쓰기 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="diary-write-modal"]');
  });

  test('닫기 버튼 클릭 시 등록취소 모달이 표시되어야 함', async ({ page }) => {
    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-close-button"]');
    
    // 등록취소 모달이 표시되는지 확인 (timeout: 500ms)
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible({ timeout: 500 });
    
    // 등록취소 모달의 제목과 내용 확인
    await expect(page.locator('[data-testid="cancel-modal"] h2')).toHaveText('등록을 취소하시겠습니까?');
    await expect(page.locator('[data-testid="cancel-modal"] p')).toHaveText('작성 중인 내용이 사라집니다.');
    
    // 계속작성 버튼과 등록취소 버튼이 모두 표시되는지 확인
    await expect(page.locator('[data-testid="continue-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="cancel-button"]')).toBeVisible();
  });

  test('계속작성 버튼 클릭 시 등록취소 모달만 닫혀야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // 계속작성 버튼 클릭
    await page.click('[data-testid="continue-button"]');
    
    // 등록취소 모달은 닫히고 일기쓰기 모달은 열려있어야 함 (timeout: 500ms)
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible({ timeout: 500 });
    await expect(page.locator('[data-testid="diary-write-modal"]')).toBeVisible();
  });

  test('등록취소 버튼 클릭 시 모든 모달이 닫혀야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // 등록취소 버튼 클릭
    await page.click('[data-testid="cancel-button"]');
    
    // 모든 모달이 닫혀야 함 (timeout: 500ms)
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible({ timeout: 500 });
    await expect(page.locator('[data-testid="diary-write-modal"]')).not.toBeVisible({ timeout: 500 });
    
    // /diaries 페이지로 돌아왔는지 확인
    await expect(page.locator('[data-testid="diaries-page"]')).toBeVisible();
  });

  test('등록취소 모달의 variant와 actions가 올바르게 설정되어야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // Modal 컴포넌트의 variant가 'info'인지 확인
    const modalElement = page.locator('[data-testid="cancel-modal"]');
    await expect(modalElement).toHaveClass(/variant-info/);
    
    // Modal 컴포넌트의 actions가 'dual'인지 확인
    await expect(modalElement).toHaveClass(/actions-dual/);
  });

  test('등록취소 모달에서 ESC 키로 모달이 닫히지 않아야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // ESC 키 누르기
    await page.keyboard.press('Escape');
    
    // 등록취소 모달이 여전히 열려있어야 함 (ESC로 닫히지 않음)
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible();
  });

  test('등록취소 모달에서 backdrop 클릭 시 등록취소 모달만 닫혀야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // backdrop 영역 클릭 (모달 외부 영역)
    await page.click('body', { position: { x: 10, y: 10 } });
    
    // 등록취소 모달은 닫히고 일기쓰기 모달은 열려있어야 함 (backdrop 클릭으로 최상위 모달만 닫힘)
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible({ timeout: 500 });
    await expect(page.locator('[data-testid="diary-write-modal"]')).toBeVisible();
  });

  test('등록취소 모달에서 버튼 텍스트가 올바르게 표시되어야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-close-button"]');
    await page.waitForSelector('[data-testid="cancel-modal"]', { timeout: 500 });
    
    // 계속작성 버튼 텍스트 확인
    await expect(page.locator('[data-testid="continue-button"]')).toHaveText('계속작성');
    
    // 등록취소 버튼 텍스트 확인
    await expect(page.locator('[data-testid="cancel-button"]')).toHaveText('등록취소');
  });
});
