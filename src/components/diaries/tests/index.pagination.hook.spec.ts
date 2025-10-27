import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

// 테스트용 일기 데이터 생성 함수
const createTestDiaries = (count: number) => {
  const emotions: EmotionType[] = ['Happy', 'Sad', 'Angry', 'Surprise', 'Etc'];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `테스트 일기 ${index + 1}`,
    content: `테스트 내용 ${index + 1}`,
    emotion: emotions[index % emotions.length],
    createdAt: new Date().toISOString(),
  }));
};

test.describe('일기 페이지네이션 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터 생성 (25개)
    const testDiaries = createTestDiaries(25);
    
    // 로컬스토리지에 테스트 데이터 저장
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test('한 페이지에 3행 4열로 총 12개의 일기카드가 노출되는지 확인', async ({ page }) => {
    // 일기 카드들이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 첫 페이지의 일기 카드 개수 확인 (12개)
    const diaryCards = await page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(12);
  });

  test('페이지 번호가 1, 2, 3 형태로 노출되는지 확인', async ({ page }) => {
    // 페이지네이션 컴포넌트가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
    
    // 페이지네이션 버튼들 확인 (1, 2, 3 페이지)
    const pageButtons = page.locator('[data-testid="pagination-page-button"]');
    await expect(pageButtons).toHaveCount(3); // 25개 데이터로 3페이지 생성
    
    // 첫 번째 페이지 버튼이 활성화되어 있는지 확인
    const firstPageButton = page.locator('[data-testid="pagination-page-button"]').first();
    await expect(firstPageButton).toHaveAttribute('data-active', 'true');
    
    // 페이지 번호들이 올바르게 표시되는지 확인
    const pageNumbers = await pageButtons.allTextContents();
    expect(pageNumbers).toEqual(['1', '2', '3']);
  });

  test('페이지번호 클릭하여 해당 페이지번호에 맞는 일기 컨텐츠목록이 보여지는지 확인', async ({ page }) => {
    // 일기 카드들이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 두 번째 페이지 버튼 클릭
    const secondPageButton = page.locator('[data-testid="pagination-page-button"]').nth(1);
    await secondPageButton.click();
    
    // 페이지 변경 후 일기 카드들이 다시 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 두 번째 페이지의 일기 카드 개수 확인 (12개)
    const diaryCards = await page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(12);
    
    // 두 번째 페이지 버튼이 활성화되어 있는지 확인
    await expect(secondPageButton).toHaveAttribute('data-active', 'true');
  });

  test('검색결과 페이지네이션하기', async ({ page }) => {
    // 검색창에 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('테스트 일기 1');
    
    // 검색 버튼 클릭
    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();
    
    // 검색 결과 로드 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 검색 결과가 1개인지 확인
    const diaryCards = await page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(1);
    
    // 페이지네이션이 숨겨져 있는지 확인 (검색 결과가 1개이므로)
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });

  test('필터결과 페이지네이션하기', async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-select"]');
    await filterSelect.click();
    
    // '행복해요' 옵션 선택
    const happyOption = page.locator('[data-testid="filter-option-Happy"]');
    await happyOption.click();
    
    // 필터 결과 로드 대기
    await page.waitForSelector('[data-testid="diary-card"]');
    
    // 필터된 결과의 일기 카드 개수 확인 (5개 - Happy emotion이 5개)
    const diaryCards = await page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(5);
    
    // 모든 카드의 emotion이 '행복해요'인지 확인
    const emotionElements = await page.locator('[data-testid="diary-emotion"]').all();
    for (const emotionElement of emotionElements) {
      await expect(emotionElement).toHaveText('행복해요');
    }
    
    // 페이지네이션이 숨겨져 있는지 확인 (필터 결과가 5개이므로 1페이지)
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });

  test('빈 상태에서 페이지네이션이 숨겨지는지 확인', async ({ page }) => {
    // 로컬스토리지 비우기
    await page.evaluate(() => {
      localStorage.removeItem('diaries');
    });
    
    // 페이지 새로고침
    await page.reload();
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.locator('[data-testid="empty-message"]');
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toHaveText('등록된 일기가 없습니다.');
    
    // 페이지네이션이 숨겨져 있는지 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).not.toBeVisible();
  });
});
