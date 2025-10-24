import { test, expect } from '@playwright/test';

test.describe('회고쓰기 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 실제 데이터를 사용하여 테스트용 일기 데이터를 로컬스토리지에 설정
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    
    // WebKit SecurityError 방지를 위해 addInitScript 사용
    await page.addInitScript((diary) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
    }, testDiary);
  });

  test('회고 입력 시 입력 버튼이 활성화되는지 확인', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid 사용, 타임아웃 증가)
    await expect(page.getByTestId('diary-detail-page')).toBeVisible({ timeout: 10000 });
    
    // 회고 입력 필드 찾기
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');
    
    // 초기 상태: 입력 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();
    
    // 회고 내용 입력
    await retrospectInput.fill('테스트 회고입니다.');
    
    // 입력 후: 입력 버튼이 활성화되는지 확인
    await expect(submitButton).toBeEnabled();
  });

  test('회고 등록 시 로컬스토리지에 저장되는지 확인 (기존 데이터 없음)', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid 사용, 타임아웃 증가)
    await expect(page.getByTestId('diary-detail-page')).toBeVisible({ timeout: 10000 });
    
    // 회고 입력 및 제출
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');
    
    await retrospectInput.fill('새로운 회고입니다.');
    await submitButton.click();
    
    // 로컬스토리지에 데이터가 저장되었는지 확인
    const storedRetrospects = await page.evaluate(() => {
      const stored = localStorage.getItem('retrospects');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(storedRetrospects).toBeTruthy();
    expect(storedRetrospects).toHaveLength(1);
    expect(storedRetrospects[0]).toMatchObject({
      id: 1,
      content: '새로운 회고입니다.',
      diaryId: 1,
      createdAt: expect.any(String),
    });
  });

  test('회고 등록 시 기존 데이터에 추가되는지 확인', async ({ page }) => {
    // 기존 회고 데이터를 로컬스토리지에 설정
    const existingRetrospects = [
      {
        id: 1,
        content: '기존 회고 1',
        diaryId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        content: '기존 회고 2',
        diaryId: 2,
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ];
    
    await page.evaluate((retrospects) => {
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, existingRetrospects);
    
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid 사용, 타임아웃 증가)
    await expect(page.getByTestId('diary-detail-page')).toBeVisible({ timeout: 10000 });
    
    // 회고 입력 및 제출
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');
    
    await retrospectInput.fill('새로운 회고입니다.');
    await submitButton.click();
    
    // 로컬스토리지에 기존 데이터에 새 데이터가 추가되었는지 확인
    const storedRetrospects = await page.evaluate(() => {
      const stored = localStorage.getItem('retrospects');
      return stored ? JSON.parse(stored) : null;
    });
    
    expect(storedRetrospects).toBeTruthy();
    expect(storedRetrospects).toHaveLength(3);
    
    // 새로 추가된 회고 확인
    const newRetrospect = storedRetrospects.find((r: { content: string }) => r.content === '새로운 회고입니다.');
    expect(newRetrospect).toBeTruthy();
    expect(newRetrospect.id).toBe(3); // 기존 최대 ID(2) + 1
    expect(newRetrospect.diaryId).toBe(1);
    expect(newRetrospect.createdAt).toBeTruthy();
  });

  test('회고 등록 후 페이지가 새로고침되는지 확인', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid 사용, 타임아웃 증가)
    await expect(page.getByTestId('diary-detail-page')).toBeVisible({ timeout: 10000 });
    
    // 회고 입력 및 제출
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');
    
    await retrospectInput.fill('새로운 회고입니다.');
    
    // 페이지 새로고침 이벤트 감지
    const reloadPromise = page.waitForLoadState('load');
    await submitButton.click();
    await reloadPromise;
    
    // 페이지가 새로고침되었는지 확인 (입력 필드가 비어있는지 확인)
    await expect(retrospectInput).toHaveValue('');
  });

  test('빈 회고 입력 시 버튼이 비활성화되는지 확인', async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 확인 (data-testid 사용, 타임아웃 증가)
    await expect(page.getByTestId('diary-detail-page')).toBeVisible({ timeout: 10000 });
    
    // 회고 입력 필드와 버튼 찾기
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');
    
    // 공백만 입력
    await retrospectInput.fill('   ');
    
    // 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();
    
    // 입력 필드 비우기
    await retrospectInput.fill('');
    
    // 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();
  });
});
