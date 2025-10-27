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

test.describe('검색과 필터 조합 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 이동
    await page.goto('/diaries', { waitUntil: 'networkidle' });
    
    // 로컬스토리지에 테스트 데이터 설정
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload({ waitUntil: 'networkidle' });
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 15000 });
  });

  test('행복한 일기 검색 후 필터 적용', async ({ page }) => {
    // 검색창에 "행복" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('행복');
    
    // 검색 실행 (Enter 키)
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (행복한 일기 1개)
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 행복해요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const happyOption = page.locator('[role="option"]').nth(1);
    await happyOption.click();
    
    // 필터 적용 후에도 행복한 일기 1개만 노출되는지 확인
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('행복해요');
    
    console.log('✅ 행복한 일기 검색 후 필터 적용 테스트 완료');
  });

  test('슬픈 일기 검색 후 필터 적용', async ({ page }) => {
    // 검색창에 "슬픈" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('슬픈');
    
    // 검색 실행 (Enter 키)
    await searchInput.press('Enter');
    
    // 검색 결과 확인 (슬픈 일기 1개)
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 슬퍼요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const sadOption = page.locator('[role="option"]').nth(2);
    await sadOption.click();
    
    // 필터 적용 후에도 슬픈 일기 1개만 노출되는지 확인
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('슬퍼요');
    
    console.log('✅ 슬픈 일기 검색 후 필터 적용 테스트 완료');
  });

  test('존재하지 않는 감정 필터 선택 시 빈 결과', async ({ page }) => {
    // 검색창에 "행복" 입력
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('행복');
    
    // 검색 실행 (Enter 키)
    await searchInput.press('Enter');
    
    // 슬퍼요 필터 선택 (행복한 일기 검색 결과에 슬픈 일기는 없음)
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const sadOption = page.locator('[role="option"]').nth(2);
    await sadOption.click();
    
    // 빈 결과 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(0);
    
    console.log('✅ 존재하지 않는 감정 필터 선택 시 빈 결과 테스트 완료');
  });

  test('필터 적용 후 검색어 변경', async ({ page }) => {
    // 행복해요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const happyOption = page.locator('[role="option"]').nth(1);
    await happyOption.click();
    
    // 행복한 일기 1개만 노출되는지 확인
    let diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 검색창에 "하루" 입력 (모든 일기 제목에 포함)
    const searchInput = page.locator('input[placeholder="검색어를 입력해 주세요."]');
    await searchInput.fill('하루');
    
    // 검색 실행 (Enter 키)
    await searchInput.press('Enter');
    
    // 검색 결과는 행복한 일기 1개만 (필터가 적용된 상태)
    diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('행복해요');
    
    console.log('✅ 필터 적용 후 검색어 변경 테스트 완료');
  });
});
