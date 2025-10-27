import { test, expect } from '@playwright/test';

// 테스트 데이터 설정
const testDiaries = [
  {
    id: 1,
    title: '행복한 하루',
    content: '오늘은 정말 행복한 하루였어요!',
    emotion: 'Happy',
    createdAt: '2024-01-01T00:00:00.000Z',
    date: '2024-01-01'
  },
  {
    id: 2,
    title: '슬픈 하루',
    content: '오늘은 정말 슬픈 하루였어요.',
    emotion: 'Sad',
    createdAt: '2024-01-02T00:00:00.000Z',
    date: '2024-01-02'
  },
  {
    id: 3,
    title: '놀라운 하루',
    content: '오늘은 정말 놀라운 하루였어요!',
    emotion: 'Surprise',
    createdAt: '2024-01-03T00:00:00.000Z',
    date: '2024-01-03'
  },
  {
    id: 4,
    title: '화난 하루',
    content: '오늘은 정말 화난 하루였어요.',
    emotion: 'Angry',
    createdAt: '2024-01-04T00:00:00.000Z',
    date: '2024-01-04'
  },
  {
    id: 5,
    title: '기타 하루',
    content: '오늘은 정말 특별한 하루였어요.',
    emotion: 'Etc',
    createdAt: '2024-01-05T00:00:00.000Z',
    date: '2024-01-05'
  }
];

test.describe('일기 필터 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 이동
    await page.goto('/diaries', { waitUntil: 'domcontentloaded' });
    
    // 로컬스토리지에 테스트 데이터 설정
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 10000 });
  });

  test('필터 선택박스 클릭 시 메뉴 확인', async ({ page }) => {
    // 필터 선택박스 클릭
    const selectbox = page.locator('select').first();
    await selectbox.click();
    
    // 선택 가능한 옵션들 확인
    const options = page.locator('select option');
    await expect(options).toHaveCount(6); // 전체 + 5개 감정
    
    // 각 옵션의 텍스트 확인
    await expect(options.nth(0)).toHaveText('전체');
    await expect(options.nth(1)).toHaveText('행복해요');
    await expect(options.nth(2)).toHaveText('슬퍼요');
    await expect(options.nth(3)).toHaveText('놀랐어요');
    await expect(options.nth(4)).toHaveText('화나요');
    await expect(options.nth(5)).toHaveText('기타');
  });

  test('전체 필터 선택 시 모든 일기 카드 노출', async ({ page }) => {
    // 전체 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('all');
    
    // 모든 일기 카드가 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(5);
  });

  test('행복해요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 행복해요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Happy');
    
    // 행복한 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('행복해요');
  });

  test('슬퍼요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 슬퍼요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Sad');
    
    // 슬픈 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('슬퍼요');
  });

  test('놀랐어요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 놀랐어요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Surprise');
    
    // 놀라운 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('놀랐어요');
  });

  test('화나요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 화나요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Angry');
    
    // 화난 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('화나요');
  });

  test('기타 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 기타 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Etc');
    
    // 기타 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('기타');
  });

  test('검색 결과 필터하기 - 행복한 일기 검색 후 필터 적용', async ({ page }) => {
    // 검색창에 "행복" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('행복');
    
    // 검색 실행
    const searchButton = page.locator('button[type="submit"]');
    await searchButton.click();
    
    // 검색 결과 확인 (행복한 일기 1개)
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 행복해요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Happy');
    
    // 필터 적용 후에도 행복한 일기 1개만 노출되는지 확인
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('행복해요');
  });

  test('검색 결과 필터하기 - 슬픈 일기 검색 후 필터 적용', async ({ page }) => {
    // 검색창에 "슬픈" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('슬픈');
    
    // 검색 실행
    const searchButton = page.locator('button[type="submit"]');
    await searchButton.click();
    
    // 검색 결과 확인 (슬픈 일기 1개)
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 슬퍼요 필터 선택
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Sad');
    
    // 필터 적용 후에도 슬픈 일기 1개만 노출되는지 확인
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('슬퍼요');
  });

  test('검색 결과 필터하기 - 존재하지 않는 감정 필터 선택 시 빈 결과', async ({ page }) => {
    // 검색창에 "행복" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('행복');
    
    // 검색 실행
    const searchButton = page.locator('button[type="submit"]');
    await searchButton.click();
    
    // 슬퍼요 필터 선택 (행복한 일기 검색 결과에 슬픈 일기는 없음)
    const selectbox = page.locator('select').first();
    await selectbox.selectOption('Sad');
    
    // 빈 결과 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(0);
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.locator('.emptyText');
    await expect(emptyMessage).toHaveText('검색 결과가 없습니다.');
  });
});
