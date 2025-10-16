import { test, expect } from '@playwright/test';

/**
 * 일기쓰기 폼 등록 기능 테스트
 * 
 * TDD 기반으로 구현된 일기쓰기 폼의 등록 기능을 테스트합니다.
 * - 모든 필드 입력 시 등록하기 버튼 활성화
 * - 등록하기 버튼 클릭 시 로컬스토리지에 일기 저장
 * - 등록 완료 후 상세페이지로 이동
 * - 다양한 감정 선택 시 올바르게 저장
 * - ID가 올바르게 증가하는지 확인
 */

test.describe('일기쓰기 폼 등록 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 10000 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');
    
    // 일기쓰기 모달이 열릴 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-write-modal"]', { timeout: 10000 });
  });

  test('모든 필드가 입력되면 등록하기 버튼이 활성화되는지 확인', async ({ page }) => {
    // 콘솔 로그 캡처 설정
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Form validation debug')) {
        console.log('Browser console:', msg.text());
      }
    });

    // 초기 상태에서 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await expect(submitButton).toBeDisabled();

    // 제목 입력
    await page.fill('[data-testid="diary-title-input"]', '테스트 제목');
    
    // 입력 후 잠시 대기
    await page.waitForTimeout(100);
    
    // 아직 내용이 없으므로 버튼이 비활성화되어 있어야 함
    await expect(submitButton).toBeDisabled();

    // 내용 입력
    await page.fill('[data-testid="diary-content-input"]', '테스트 내용입니다.');
    
    // 입력 후 잠시 대기
    await page.waitForTimeout(100);
    
    // 디버깅: 현재 폼 상태 확인
    const titleValue = await page.inputValue('[data-testid="diary-title-input"]');
    const contentValue = await page.inputValue('[data-testid="diary-content-input"]');
    const emotionChecked = await page.isChecked('[data-testid="emotion-happy"]');
    
    console.log('Form values:', { titleValue, contentValue, emotionChecked });
    
    // 모든 필드가 입력되었으므로 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });

  test('등록하기 버튼 클릭 시 로컬스토리지에 일기가 저장되는지 확인', async ({ page }) => {
    // 폼 필드 입력
    await page.fill('[data-testid="diary-title-input"]', '로컬스토리지 테스트 제목');
    await page.fill('[data-testid="diary-content-input"]', '로컬스토리지 테스트 내용입니다.');
    
    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-submit-button"]');
    
    // 등록완료 모달이 표시될 때까지 대기
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 500 });
    
    // 로컬스토리지에서 diaries 데이터 확인
    const diariesData = await page.evaluate(() => {
      return localStorage.getItem('diaries');
    });
    
    expect(diariesData).toBeTruthy();
    
    const diaries = JSON.parse(diariesData!);
    expect(diaries).toHaveLength(1);
    expect(diaries[0]).toMatchObject({
      id: 1,
      title: '로컬스토리지 테스트 제목',
      content: '로컬스토리지 테스트 내용입니다.',
      emotion: 'Happy',
    });
    expect(diaries[0].createdAt).toBeTruthy();
  });

  test('확인 버튼 클릭 시 상세페이지로 이동하는지 확인', async ({ page }) => {
    // 폼 필드 입력
    await page.fill('[data-testid="diary-title-input"]', '상세페이지 이동 테스트 제목');
    await page.fill('[data-testid="diary-content-input"]', '상세페이지 이동 테스트 내용입니다.');
    
    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-submit-button"]');
    
    // 등록완료 모달이 표시될 때까지 대기
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 500 });
    
    // 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 상세페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/diaries\/1$/);
    
    // 상세페이지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });
  });

  test('다양한 감정 선택 시 올바르게 저장되는지 확인', async ({ page }) => {
    // 콘솔 로그 캡처 설정
    page.on('console', msg => {
      if (msg.type() === 'log' && (msg.text().includes('Emotion change') || msg.text().includes('Form submit data') || msg.text().includes('New diary data'))) {
        console.log('Browser console:', msg.text());
      }
    });

    // 슬픔 감정 선택 테스트
    await page.click('[data-testid="emotion-sad"]');
    await page.waitForTimeout(100);
    
    // 선택된 감정이 올바른지 확인
    const isSadChecked = await page.isChecked('[data-testid="emotion-sad"]');
    expect(isSadChecked).toBe(true);
    
    // 폼 필드 입력
    await page.fill('[data-testid="diary-title-input"]', '슬픔 감정 테스트 제목');
    await page.fill('[data-testid="diary-content-input"]', '슬픔 감정 테스트 내용입니다.');
    
    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-submit-button"]');
    
    // 등록완료 모달이 표시될 때까지 대기
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 500 });
    
    // 확인 버튼 클릭
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 상세페이지에서 감정이 올바르게 표시되는지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toContainText('슬퍼요');
  });

  test('일기 등록 시 ID가 올바르게 증가하는지 확인', async ({ page }) => {
    // 첫 번째 일기 등록
    await page.fill('[data-testid="diary-title-input"]', '첫 번째 일기');
    await page.fill('[data-testid="diary-content-input"]', '첫 번째 일기 내용입니다.');
    await page.click('[data-testid="diary-submit-button"]');
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 500 });
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 상세페이지에서 ID가 1인지 확인
    await expect(page).toHaveURL(/\/diaries\/1$/);
    
    // 일기 목록으로 돌아가기
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
    await page.click('[data-testid="diary-write-button"]');
    await page.waitForSelector('[data-testid="diary-write-modal"]', { timeout: 500 });
    
    // 두 번째 일기 등록
    await page.fill('[data-testid="diary-title-input"]', '두 번째 일기');
    await page.fill('[data-testid="diary-content-input"]', '두 번째 일기 내용입니다.');
    await page.click('[data-testid="diary-submit-button"]');
    await page.waitForSelector('[data-testid="modal-content"]', { timeout: 500 });
    await page.click('[data-testid="modal-confirm-button"]');
    
    // 상세페이지에서 ID가 2인지 확인
    await expect(page).toHaveURL(/\/diaries\/2$/);
    
    // 로컬스토리지에서 두 개의 일기가 모두 저장되었는지 확인
    const diariesData = await page.evaluate(() => {
      return localStorage.getItem('diaries');
    });
    
    const diaries = JSON.parse(diariesData!);
    expect(diaries).toHaveLength(2);
    expect(diaries[0].id).toBe(1);
    expect(diaries[1].id).toBe(2);
  });
});