import { test, expect } from '@playwright/test';

/**
 * 일기 카드 링크 라우팅 테스트
 * TDD 기반으로 구현된 링크 라우팅 기능을 테스트합니다.
 */
test.describe('일기 카드 링크 라우팅 테스트', () => {
  // 테스트용 실제 데이터 (로컬스토리지에 저장)
  const testDiaries = [
    {
      id: 1,
      title: '오늘의 행복한 일',
      content: '오늘은 정말 행복한 하루였어요.',
      emotion: 'Happy',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: '슬픈 하루',
      content: '오늘은 조금 슬픈 하루였어요.',
      emotion: 'Sad',
      createdAt: '2024-01-14T15:30:00Z'
    },
    {
      id: 3,
      title: '놀라운 발견',
      content: '오늘 놀라운 것을 발견했어요.',
      emotion: 'Surprise',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ];

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 실제 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test('일기 카드 클릭 시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 첫 번째 일기 카드 클릭
    const firstDiaryCard = page.locator('[data-testid="diary-card"]').first();
    await firstDiaryCard.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('두 번째 일기 카드 클릭 시 해당 ID로 이동해야 함', async ({ page }) => {
    // 두 번째 일기 카드 클릭
    const secondDiaryCard = page.locator('[data-testid="diary-card"]').nth(1);
    await secondDiaryCard.click();

    // URL이 /diaries/2로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/2');
  });

  test('세 번째 일기 카드 클릭 시 해당 ID로 이동해야 함', async ({ page }) => {
    // 세 번째 일기 카드 클릭
    const thirdDiaryCard = page.locator('[data-testid="diary-card"]').nth(2);
    await thirdDiaryCard.click();

    // URL이 /diaries/3으로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/3');
  });

  test('일기 카드에 cursor: pointer 스타일이 적용되어야 함', async ({ page }) => {
    const diaryCard = page.locator('[data-testid="diary-card"]').first();
    
    // CSS cursor 속성 확인
    const cursorStyle = await diaryCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursorStyle).toBe('pointer');
  });

  test('삭제 아이콘 클릭 시 페이지 이동하지 않아야 함', async ({ page }) => {
    // 삭제 아이콘 클릭 (CSS 모듈 클래스명 사용)
    const deleteIcon = page.locator('[class*="closeIcon"]').first();
    await deleteIcon.click();

    // URL이 변경되지 않았는지 확인 (여전히 /diaries 페이지에 있어야 함)
    await expect(page).toHaveURL('/diaries');
  });

  test('일기 카드의 다른 영역 클릭 시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 일기 카드의 제목 영역 클릭
    const diaryTitle = page.locator('[data-testid="diary-title"]').first();
    await diaryTitle.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('일기 카드의 감정 영역 클릭 시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 일기 카드의 감정 영역 클릭
    const diaryEmotion = page.locator('[data-testid="diary-emotion"]').first();
    await diaryEmotion.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('일기 카드의 날짜 영역 클릭 시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 일기 카드의 날짜 영역 클릭
    const diaryDate = page.locator('[data-testid="diary-date"]').first();
    await diaryDate.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('여러 일기 카드가 있을 때 각각 올바른 ID로 이동해야 함', async ({ page }) => {
    // 모든 일기 카드의 개수 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBe(3);

    // 각 카드를 클릭하여 올바른 ID로 이동하는지 확인
    for (let i = 0; i < cardCount; i++) {
      await page.goto('/diaries');
      await page.waitForSelector('[data-testid="diaries-page"]');
      
      const card = diaryCards.nth(i);
      await card.click();
      
      const expectedId = testDiaries[i].id;
      await expect(page).toHaveURL(`/diaries/${expectedId}`);
    }
  });
});
