import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

// 테스트 데이터 타입 정의
interface TestDiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

// 테스트용 일기 데이터 생성 함수
const createTestDiary = (id: number, overrides: Partial<TestDiaryData> = {}): TestDiaryData => ({
  id,
  title: `테스트 일기 ${id}`,
  content: `테스트 내용 ${id}`,
  emotion: 'Happy',
  createdAt: new Date().toISOString(),
  ...overrides,
});

test.describe('일기 상세 수정 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터 생성
    const testDiaries: TestDiaryData[] = [
      createTestDiary(1, {
        title: '수정 테스트 일기',
        content: '수정 전 내용입니다.',
        emotion: 'Happy',
      }),
    ];

    // 로컬스토리지에 테스트 데이터 저장
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
  });

  test('일기 상세 페이지 로드 확인', async ({ page }) => {
    // 페이지가 정상적으로 로드되었는지 확인
    await expect(page.locator('[data-testid="diary-detail-page"]')).toBeVisible();
    
    // 일기 제목이 표시되는지 확인
    await expect(page.locator('h1')).toContainText('수정 테스트 일기');
    
    // 감정이 표시되는지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toContainText('행복해요');
    
    // 내용이 표시되는지 확인
    await expect(page.locator('.contentText')).toContainText('수정 전 내용입니다.');
    
    // 수정 버튼이 표시되는지 확인
    await expect(page.locator('button:has-text("수정")')).toBeVisible();
  });

  test('수정 버튼 클릭 시 수정 모드로 전환', async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('button:has-text("수정")');
    
    // 수정 모드로 전환되었는지 확인
    // 기분 선택 영역이 표시되는지 확인
    await expect(page.locator('text=오늘 기분은 어땟나요?')).toBeVisible();
    
    // 제목 입력 필드가 표시되는지 확인
    await expect(page.locator('input[placeholder*="제목"]')).toBeVisible();
    
    // 내용 입력 필드가 표시되는지 확인
    await expect(page.locator('textarea[placeholder*="내용"]')).toBeVisible();
    
    // 취소 버튼이 표시되는지 확인
    await expect(page.locator('button:has-text("취소")')).toBeVisible();
    
    // 수정하기 버튼이 표시되는지 확인
    await expect(page.locator('button:has-text("수정 하기")')).toBeVisible();
  });

  test('수정 모드에서 회고 입력창 비활성화 확인', async ({ page }) => {
    // 수정 버튼 클릭하여 수정 모드로 전환
    await page.click('button:has-text("수정")');
    
    // 회고 입력창이 비활성화되었는지 확인
    const retrospectInput = page.locator('input[placeholder*="회고"]');
    await expect(retrospectInput).toBeDisabled();
    
    // 회고 입력 버튼이 비활성화되었는지 확인
    const retrospectButton = page.locator('button:has-text("입력")');
    await expect(retrospectButton).toBeDisabled();
    
    // 비활성화 메시지가 표시되는지 확인
    await expect(page.locator('text=수정중일땐 회고를 작성할 수 없어요.')).toBeVisible();
  });

  test('일기 수정 기능 테스트', async ({ page }) => {
    // 수정 버튼 클릭하여 수정 모드로 전환
    await page.click('button:has-text("수정")');
    
    // 감정 변경 (슬퍼요로 변경)
    await page.click('text=슬퍼요');
    
    // 제목 변경
    const titleInput = page.locator('input[placeholder*="제목"]');
    await titleInput.clear();
    await titleInput.fill('수정된 제목');
    
    // 내용 변경
    const contentInput = page.locator('textarea[placeholder*="내용"]');
    await contentInput.clear();
    await contentInput.fill('수정된 내용입니다.');
    
    // 수정하기 버튼 클릭
    await page.click('button:has-text("수정 하기")');
    
    // 수정 완료 후 원래 화면으로 돌아가는지 확인
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 수정된 내용이 반영되었는지 확인
    await expect(page.locator('h1')).toContainText('수정된 제목');
    await expect(page.locator('[data-testid="diary-emotion"]')).toContainText('슬퍼요');
    await expect(page.locator('.contentText')).toContainText('수정된 내용입니다.');
    
    // 수정 버튼이 다시 표시되는지 확인
    await expect(page.locator('button:has-text("수정")')).toBeVisible();
  });

  test('수정 취소 기능 테스트', async ({ page }) => {
    // 수정 버튼 클릭하여 수정 모드로 전환
    await page.click('button:has-text("수정")');
    
    // 제목과 내용 변경
    const titleInput = page.locator('input[placeholder*="제목"]');
    await titleInput.clear();
    await titleInput.fill('취소 테스트 제목');
    
    const contentInput = page.locator('textarea[placeholder*="내용"]');
    await contentInput.clear();
    await contentInput.fill('취소 테스트 내용');
    
    // 취소 버튼 클릭
    await page.click('button:has-text("취소")');
    
    // 원래 화면으로 돌아가는지 확인
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 원래 내용이 그대로 유지되는지 확인
    await expect(page.locator('h1')).toContainText('수정 테스트 일기');
    await expect(page.locator('.contentText')).toContainText('수정 전 내용입니다.');
  });

  test('수정 모드에서 폼 검증 테스트', async ({ page }) => {
    // 수정 버튼 클릭하여 수정 모드로 전환
    await page.click('button:has-text("수정")');
    
    // 제목을 비워두고 수정하기 버튼 클릭
    const titleInput = page.locator('input[placeholder*="제목"]');
    await titleInput.clear();
    
    // 수정하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('button:has-text("수정 하기")');
    await expect(submitButton).toBeDisabled();
    
    // 제목 입력
    await titleInput.fill('유효한 제목');
    
    // 내용을 비워두기
    const contentInput = page.locator('textarea[placeholder*="내용"]');
    await contentInput.clear();
    
    // 수정하기 버튼이 여전히 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();
    
    // 내용 입력
    await contentInput.fill('유효한 내용');
    
    // 수정하기 버튼이 활성화되는지 확인
    await expect(submitButton).toBeEnabled();
  });
});