import { test, expect } from '@playwright/test';

test.describe('회원가입 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /auth/signup 페이지로 이동
    await page.goto('/auth/signup');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="auth-signup-form"]', { timeout: 2000 });
  });

  test('회원가입 폼이 정상적으로 렌더링된다', async ({ page }) => {
    // 폼 요소들이 존재하는지 확인
    await expect(page.locator('h1')).toContainText('회원가입');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="passwordConfirm"]')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('모든 필드가 입력되면 회원가입 버튼이 활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 초기에는 버튼이 비활성화되어 있어야 함
    await expect(submitButton).toBeDisabled();
    
    // 모든 필드 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });

  test('이메일 형식이 잘못되면 버튼이 비활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 잘못된 이메일 형식 입력
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('비밀번호가 8자리 미만이면 버튼이 비활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 8자리 미만 비밀번호 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'pass123');
    await page.fill('input[name="passwordConfirm"]', 'pass123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('비밀번호에 영문과 숫자가 포함되지 않으면 버튼이 비활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 영문과 숫자가 포함되지 않은 비밀번호 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.fill('input[name="passwordConfirm"]', 'password');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('비밀번호와 비밀번호 확인이 일치하지 않으면 버튼이 비활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 비밀번호와 비밀번호 확인이 다른 경우
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'different123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('이름이 입력되지 않으면 버튼이 비활성화된다', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    
    // 이름을 입력하지 않은 경우
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    // name 필드는 비워둠
    
    // 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();
  });

  test('회원가입 성공 시 성공 모달이 표시되고 로그인 페이지로 이동한다', async ({ page }) => {
    // 실제 API를 사용하므로 고유한 이메일 사용
    const timestamp = Date.now();
    const uniqueEmail = `test${timestamp}@example.com`;
    
    // 모든 필드 입력
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 성공 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="modal-content"]')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('h2')).toContainText('회원가입 완료');
    
    // 모달의 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 로그인 페이지로 이동하는지 확인
    await expect(page).toHaveURL('/auth/login');
  });

  test('회원가입 실패 시 실패 모달이 표시된다', async ({ page }) => {
    // 이미 존재하는 이메일 사용 (실패 시나리오)
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 실패 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="modal-content"]')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('h2')).toContainText('회원가입 실패');
    
    // 모달의 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 모달이 닫히는지 확인
    await expect(page.locator('[data-testid="modal-content"]')).not.toBeVisible();
  });

  test('zod 검증 실패 시 개별 필드 에러 메시지가 표시된다', async ({ page }) => {
    // 잘못된 이메일 형식으로 입력
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 다른 필드로 포커스 이동하여 blur 이벤트 발생
    await page.focus('input[name="password"]');
    
    // 에러 메시지가 표시되는지 확인
    await expect(page.locator('text=올바른 이메일 형식이 아닙니다')).toBeVisible();
  });

  test('모달이 한 번만 표시되고 중복되지 않는다', async ({ page }) => {
    // 모든 필드 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 실패 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="modal-content"]')).toBeVisible({ timeout: 2000 });
    
    // 모달이 하나만 표시되는지 확인 (중복 방지)
    const modalCount = await page.locator('[data-testid="modal-content"]').count();
    expect(modalCount).toBe(1);
  });

  test('폼 제출 중에는 버튼이 비활성화되고 로딩 텍스트가 표시된다', async ({ page }) => {
    // 모든 필드 입력
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[name="name"]', '테스트 사용자');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 버튼이 비활성화되고 로딩 텍스트가 표시되는지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toContainText('처리 중...');
  });
});
