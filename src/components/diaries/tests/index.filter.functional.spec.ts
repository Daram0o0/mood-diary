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

  test('전체 필터 선택 시 모든 일기 카드 노출', async ({ page }) => {
    // 전체 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const allOption = page.locator('[role="option"]').first();
    await allOption.click();
    
    // 모든 일기 카드가 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(5);
    
    console.log('✅ 전체 필터 테스트 완료');
  });

  test('행복해요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 행복해요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const happyOption = page.locator('[role="option"]').nth(1);
    await happyOption.click();
    
    // 행복한 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('행복해요');
    
    console.log('✅ 행복해요 필터 테스트 완료');
  });

  test('슬퍼요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 슬퍼요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const sadOption = page.locator('[role="option"]').nth(2);
    await sadOption.click();
    
    // 슬픈 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('슬퍼요');
    
    console.log('✅ 슬퍼요 필터 테스트 완료');
  });

  test('화나요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 화나요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const angryOption = page.locator('[role="option"]').nth(3);
    await angryOption.click();
    
    // 화난 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('화나요');
    
    console.log('✅ 화나요 필터 테스트 완료');
  });

  test('놀랐어요 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 놀랐어요 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const surpriseOption = page.locator('[role="option"]').nth(4);
    await surpriseOption.click();
    
    // 놀라운 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('놀랐어요');
    
    console.log('✅ 놀랐어요 필터 테스트 완료');
  });

  test('기타 필터 선택 시 해당 일기만 노출', async ({ page }) => {
    // 기타 필터 선택
    const selectbox = page.locator('[role="combobox"]').first();
    await selectbox.click();
    
    const etcOption = page.locator('[role="option"]').nth(5);
    await etcOption.click();
    
    // 기타 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 감정 라벨 확인
    const emotionLabel = page.locator('[data-testid="diary-emotion"]').first();
    await expect(emotionLabel).toHaveText('기타');
    
    console.log('✅ 기타 필터 테스트 완료');
  });
});
