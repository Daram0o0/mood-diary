import { test, expect } from '@playwright/test';

test.describe('로그인 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /auth/login 페이지로 이동
    await page.goto('/auth/login');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-login-container"]', { timeout: 2000 });
  });

  test('모든 인풋이 입력되었을 때 로그인 버튼이 활성화되어야 함', async ({ page }) => {
    // 이메일과 비밀번호 입력
    await page.fill('[data-testid="email-input"]', 'a@c.com');
    await page.fill('[data-testid="password-input"]', '1234qwer');
    
    // 로그인 버튼이 활성화되었는지 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeEnabled();
  });

  test('성공적인 로그인 시나리오 - 로그인 완료 모달이 표시되고 일기 목록 페이지로 이동해야 함', async ({ page }) => {
    // 이메일과 비밀번호 입력
    await page.fill('[data-testid="email-input"]', 'a@c.com');
    await page.fill('[data-testid="password-input"]', '1234qwer');
    
    // 로그인 버튼 클릭
    await page.click('[data-testid="login-button"]');
    
    // 로그인 완료 모달이 표시되는지 확인
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-content"]').first()).toBeVisible();
    
    // 모달의 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 일기 목록 페이지로 이동했는지 확인
    await page.waitForURL('/diaries', { timeout: 2000 });
    expect(page.url()).toContain('/diaries');
  });

  test('실패한 로그인 시나리오 - 로그인 실패 모달이 표시되어야 함', async ({ page }) => {
    // API 모킹: 로그인 실패 응답 모킹
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      if (postData.query?.includes('loginUser')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: null,
            errors: [{
              message: '이메일 또는 비밀번호가 올바르지 않습니다.',
              extensions: { code: 'UNAUTHENTICATED' }
            }]
          })
        });
      } else {
        await route.continue();
      }
    });

    // 잘못된 이메일과 비밀번호 입력
    await page.fill('[data-testid="email-input"]', 'wrong@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // 로그인 버튼 클릭
    await page.click('[data-testid="login-button"]');
    
    // 로그인 실패 모달이 표시되는지 확인
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-content"]')).toBeVisible();
    
    // 모달의 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 로그인 페이지에 그대로 있는지 확인
    expect(page.url()).toContain('/auth/login');
  });

  test('Enter 키로 폼 제출이 가능해야 함', async ({ page }) => {
    // 이메일과 비밀번호 입력
    await page.fill('[data-testid="email-input"]', 'a@c.com');
    await page.fill('[data-testid="password-input"]', '1234qwer');
    
    // Enter 키로 폼 제출
    await page.press('[data-testid="password-input"]', 'Enter');
    
    // 로그인 완료 모달이 표시되는지 확인
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-content"]').first()).toBeVisible();
  });

  test('키보드 네비게이션이 정상적으로 작동해야 함', async ({ page }) => {
    // Tab 키로 필드 간 이동
    await page.keyboard.press('Tab'); // 이메일 필드로 이동
    await page.keyboard.type('a@c.com');
    
    await page.keyboard.press('Tab'); // 비밀번호 필드로 이동
    await page.keyboard.type('1234qwer');
    
    // Enter 키로 폼 제출 (비밀번호 필드에서)
    await page.keyboard.press('Enter');
    
    // 로그인 완료 모달이 표시되는지 확인
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-content"]').first()).toBeVisible();
  });

  test('로컬 스토리지에 토큰과 사용자 정보가 저장되어야 함', async ({ page }) => {
    // API 응답 모니터링을 위한 변수
    let loginResponse: { data: { loginUser: { accessToken: string } } } | null = null;
    let userResponse: { data: { fetchUserLoggedIn: { _id: string; name: string } } } | null = null;

    // API 요청 모니터링
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      if (postData.query?.includes('loginUser')) {
        const response = await route.fetch();
        const data = await response.json();
        loginResponse = data;
      } else if (postData.query?.includes('fetchUserLoggedIn')) {
        const response = await route.fetch();
        const data = await response.json();
        userResponse = data;
      }
      
      await route.continue();
    });

    // 이메일과 비밀번호 입력
    await page.fill('[data-testid="email-input"]', 'a@c.com');
    await page.fill('[data-testid="password-input"]', '1234qwer');
    
    // 로그인 버튼 클릭
    await page.click('[data-testid="login-button"]');
    
    // 로그인 완료 모달이 표시될 때까지 대기
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 2000 });
    
    // API 응답 데이터 검증
    expect(loginResponse).toBeTruthy();
    expect(loginResponse.data.loginUser.accessToken).toBeTruthy();
    
    expect(userResponse).toBeTruthy();
    expect(userResponse.data.fetchUserLoggedIn._id).toBeTruthy();
    expect(userResponse.data.fetchUserLoggedIn.name).toBeTruthy();
    
    // 로컬 스토리지 확인
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    
    expect(accessToken).toBeTruthy();
    expect(user).toBeTruthy();
    
    // 사용자 정보 파싱 및 검증
    const userData = JSON.parse(user || '{}');
    expect(userData._id).toBeTruthy();
    expect(userData.name).toBeTruthy();
  });

  test('입력 필드에 에러 상태가 표시되어야 함', async ({ page }) => {
    // 잘못된 이메일 형식 입력
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', '1234qwer');
    
    // 이메일 필드에 에러 상태가 표시되는지 확인 (폼 검증 후)
    const emailInput = page.locator('[data-testid="email-input"]');
    await expect(emailInput).toHaveClass(/error/);
    
    // 에러 메시지가 표시되는지 확인 (Input 컴포넌트 내부의 에러 메시지)
    const errorMessage = page.locator('[data-testid="email-input"]').locator('..').locator('span');
    await expect(errorMessage).toBeVisible();
    
    // 로그인 버튼이 비활성화되어 있는지 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeDisabled();
  });
});