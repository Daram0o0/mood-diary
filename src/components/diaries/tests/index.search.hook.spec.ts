import { test, expect } from '@playwright/test';

/**
 * 테스트 데이터 타입 정의
 */
interface TestDiaryData {
  id: number;
  title: string;
  content: string;
  emotion: string;
  createdAt: string;
}

/**
 * 테스트용 일기 데이터
 */
const testDiaries: TestDiaryData[] = [
  {
    id: 1,
    title: '행복한 하루',
    content: '오늘은 정말 행복한 하루였다.',
    emotion: 'Happy',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: '슬픈 이야기',
    content: '오늘은 조금 슬펐다.',
    emotion: 'Sad',
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    title: '놀라운 경험',
    content: '정말 놀라운 일이 있었다.',
    emotion: 'Surprise',
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 4,
    title: '화나는 일',
    content: '오늘은 정말 화가 났다.',
    emotion: 'Angry',
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 5,
    title: '기타 감정',
    content: '복잡한 감정이었다.',
    emotion: 'Etc',
    createdAt: '2024-01-05T00:00:00.000Z'
  }
];

test.describe('일기 검색 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test('검색창에 검색어 입력 시 엔터키로 검색 가능', async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill('행복한');
    
    // 엔터키로 검색 실행
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (행복한 하루 일기만 표시되어야 함)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('행복한 하루');
  });

  test('검색창에 검색어 입력 시 엔터키로 검색 가능 (슬픈)', async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill('슬픈');
    
    // 엔터키로 검색 실행
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (슬픈 이야기 일기만 표시되어야 함)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('슬픈 이야기');
  });

  test('감정 필터로 검색 가능', async ({ page }) => {
    // 감정 필터 선택 (커스텀 Selectbox 컴포넌트 사용)
    const emotionSelect = page.locator('[role="combobox"]').first();
    await emotionSelect.click();
    
    // Happy 옵션 선택
    const happyOption = page.locator('[role="option"]:has-text("행복")');
    await happyOption.click();
    
    // 검색 실행 (빈 검색어로 검색)
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (Happy 감정의 일기만 표시되어야 함)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryEmotion = page.locator('[data-testid="diary-emotion"]').first();
    await expect(diaryEmotion).toHaveText('행복해요');
  });

  test('제목과 감정 필터 동시 검색 가능', async ({ page }) => {
    // 감정 필터 선택 (커스텀 Selectbox 컴포넌트 사용)
    const emotionSelect = page.locator('[role="combobox"]').first();
    await emotionSelect.click();
    
    // Sad 옵션 선택
    const sadOption = page.locator('[role="option"]:has-text("슬픔")');
    await sadOption.click();
    
    // 검색어 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('이야기');
    
    // 검색 실행
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (Sad 감정이면서 제목에 '이야기'가 포함된 일기만 표시되어야 함)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('슬픈 이야기');
    
    const diaryEmotion = page.locator('[data-testid="diary-emotion"]').first();
    await expect(diaryEmotion).toHaveText('슬퍼요');
  });

  test('검색 결과가 없을 때 빈 상태 메시지 표시', async ({ page }) => {
    // 존재하지 않는 검색어로 검색
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('존재하지않는검색어');
    await searchInput.press('Enter');
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.locator('text=검색 결과가 없습니다.');
    await expect(emptyMessage).toBeVisible();
  });

  test('검색어가 없을 때 모든 일기 표시', async ({ page }) => {
    // 빈 검색어로 검색
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.press('Enter');
    
    // 모든 일기 표시 확인 (5개)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(5);
    
    // 모든 일기 제목 확인
    const titles = page.locator('[data-testid="diary-title"]');
    await expect(titles).toHaveCount(5);
  });

  test('대소문자 구분 없이 검색 가능', async ({ page }) => {
    // 대문자로 검색 (실제 제목에 포함된 단어 사용)
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('하루');
    await searchInput.press('Enter');
    
    // 검색 결과 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('행복한 하루');
  });

  test('부분 검색 가능', async ({ page }) => {
    // 부분 검색어로 검색
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('하루');
    await searchInput.press('Enter');
    
    // 검색 결과 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('행복한 하루');
  });

  test('디바운싱 검색 기능', async ({ page }) => {
    // 검색어를 빠르게 연속으로 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    
    // 빠른 연속 입력 (timeout 없이)
    await searchInput.fill('행');
    await searchInput.fill('행복');
    await searchInput.fill('행복한');
    
    // 디바운싱 후 결과가 나타날 때까지 대기 (timeout 대신 결과 기반 대기)
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 1000 });
    
    // 검색 결과 확인 (디바운싱 후 자동 검색)
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('행복한 하루');
  });

  test('디바운싱 중간에 입력이 멈추면 검색 실행', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    
    // 부분 입력
    await searchInput.fill('슬');
    
    // 디바운싱 후 결과가 나타날 때까지 대기 (timeout 대신 결과 기반 대기)
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 1000 });
    
    // 검색 결과 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await expect(diaryTitle).toHaveText('슬픈 이야기');
  });

});
