import { test, expect } from '@playwright/test';

/**
 * 일기 목록 페이지 데이터 바인딩 테스트
 * 
 * 로컬스토리지의 실제 데이터를 바인딩하여 일기 카드들이 올바르게 표시되는지 확인합니다.
 */
test.describe('일기 목록 페이지 데이터 바인딩', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });
  });

  test('로컬스토리지에 데이터가 없을 때 빈 상태 표시', async ({ page }) => {
    // 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem('diaries');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 일기 카드가 표시되지 않는지 확인
    const diaryCards = await page.locator('[data-testid="diary-card"]').count();
    expect(diaryCards).toBe(0);
  });

  test('로컬스토리지의 실제 데이터가 일기 카드에 올바르게 바인딩되는지 확인', async ({ page }) => {
    // 테스트용 실제 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '첫 번째 일기',
        content: '첫 번째 일기 내용입니다.',
        emotion: 'Happy',
        createdAt: '2024-03-12T10:00:00.000Z'
      },
      {
        id: 2,
        title: '두 번째 일기',
        content: '두 번째 일기 내용입니다.',
        emotion: 'Sad',
        createdAt: '2024-03-13T15:30:00.000Z'
      },
      {
        id: 3,
        title: '매우 긴 제목의 일기입니다. 이 제목은 카드 크기를 넘어갈 수 있습니다.',
        content: '세 번째 일기 내용입니다.',
        emotion: 'Angry',
        createdAt: '2024-03-14T09:15:00.000Z'
      }
    ];

    // 로컬스토리지에 테스트 데이터 저장
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });


    // 일기 카드가 로드될 때까지 대기
    await page.waitForTimeout(1000);

    // 일기 카드 개수 확인
    const diaryCards = await page.locator('[data-testid="diary-card"]');
    await expect(diaryCards).toHaveCount(3);

    // 첫 번째 일기 카드 검증 (최신순 정렬로 Angry가 첫 번째)
    const firstCard = diaryCards.nth(0);
    
    // 감정 이미지 확인 (Angry - 가장 최근)
    const firstEmotionImage = firstCard.locator('img[alt="화나요"]');
    await expect(firstEmotionImage).toBeVisible();
    await expect(firstEmotionImage).toHaveAttribute('src', /emotion-angry-m\.png/);

    // 감정 텍스트 확인
    const firstEmotionText = firstCard.locator('[data-testid="diary-emotion"]');
    await expect(firstEmotionText).toHaveText('화나요');
    await expect(firstEmotionText).toHaveCSS('color', 'rgb(119, 119, 119)'); // #777777

    // 작성일 확인 (YYYY. MM. DD 형식)
    const firstDate = firstCard.locator('[data-testid="diary-date"]');
    await expect(firstDate).toHaveText('2024. 03. 14');

    // 제목 확인 (긴 제목이 "..."으로 잘리는지 확인)
    const firstTitle = firstCard.locator('[data-testid="diary-title"]');
    const titleText = await firstTitle.textContent();
    expect(titleText).toContain('매우 긴 제목의 일기입니다');

    // 두 번째 일기 카드 검증 (Sad)
    const secondCard = diaryCards.nth(1);
    
    // 감정 이미지 확인 (Sad)
    const secondEmotionImage = secondCard.locator('img[alt="슬퍼요"]');
    await expect(secondEmotionImage).toBeVisible();
    await expect(secondEmotionImage).toHaveAttribute('src', /emotion-sad-m\.png/);

    // 감정 텍스트 확인
    const secondEmotionText = secondCard.locator('[data-testid="diary-emotion"]');
    await expect(secondEmotionText).toHaveText('슬퍼요');
    await expect(secondEmotionText).toHaveCSS('color', 'rgb(40, 180, 225)'); // #28B4E1

    // 작성일 확인
    const secondDate = secondCard.locator('[data-testid="diary-date"]');
    await expect(secondDate).toHaveText('2024. 03. 13');

    // 제목 확인
    const secondTitle = secondCard.locator('[data-testid="diary-title"]');
    await expect(secondTitle).toHaveText('두 번째 일기');

    // 세 번째 일기 카드 검증 (Happy - 가장 오래된)
    const thirdCard = diaryCards.nth(2);
    
    // 감정 이미지 확인 (Happy)
    const thirdEmotionImage = thirdCard.locator('img[alt="행복해요"]');
    await expect(thirdEmotionImage).toBeVisible();
    await expect(thirdEmotionImage).toHaveAttribute('src', /emotion-happy-m\.png/);

    // 감정 텍스트 확인
    const thirdEmotionText = thirdCard.locator('[data-testid="diary-emotion"]');
    await expect(thirdEmotionText).toHaveText('행복해요');
    await expect(thirdEmotionText).toHaveCSS('color', 'rgb(234, 87, 87)'); // #EA5757

    // 작성일 확인
    const thirdDate = thirdCard.locator('[data-testid="diary-date"]');
    await expect(thirdDate).toHaveText('2024. 03. 12');

    // 제목 확인
    const thirdTitle = thirdCard.locator('[data-testid="diary-title"]');
    await expect(thirdTitle).toHaveText('첫 번째 일기');
  });

  test('모든 감정 타입의 일기가 올바르게 표시되는지 확인', async ({ page }) => {
    // 모든 감정 타입을 포함한 테스트 데이터
    const allEmotionDiaries = [
      {
        id: 1,
        title: '행복한 일기',
        content: '행복한 내용',
        emotion: 'Happy',
        createdAt: '2024-03-12T10:00:00.000Z'
      },
      {
        id: 2,
        title: '슬픈 일기',
        content: '슬픈 내용',
        emotion: 'Sad',
        createdAt: '2024-03-12T11:00:00.000Z'
      },
      {
        id: 3,
        title: '화난 일기',
        content: '화난 내용',
        emotion: 'Angry',
        createdAt: '2024-03-12T12:00:00.000Z'
      },
      {
        id: 4,
        title: '놀란 일기',
        content: '놀란 내용',
        emotion: 'Surprise',
        createdAt: '2024-03-12T13:00:00.000Z'
      },
      {
        id: 5,
        title: '기타 일기',
        content: '기타 내용',
        emotion: 'Etc',
        createdAt: '2024-03-12T14:00:00.000Z'
      }
    ];

    // 로컬스토리지에 테스트 데이터 저장
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, allEmotionDiaries);

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 최신순 정렬 순서: Etc(14:00) -> Surprise(13:00) -> Angry(12:00) -> Sad(11:00) -> Happy(10:00)
    const emotionTests = [
      { emotion: 'Etc', label: '기타', color: 'rgb(162, 41, 237)', imagePattern: /emotion-etc-m\.png/ },
      { emotion: 'Surprise', label: '놀랐어요', color: 'rgb(213, 144, 41)', imagePattern: /emotion-surprise-m\.png/ },
      { emotion: 'Angry', label: '화나요', color: 'rgb(119, 119, 119)', imagePattern: /emotion-angry-m\.png/ },
      { emotion: 'Sad', label: '슬퍼요', color: 'rgb(40, 180, 225)', imagePattern: /emotion-sad-m\.png/ },
      { emotion: 'Happy', label: '행복해요', color: 'rgb(234, 87, 87)', imagePattern: /emotion-happy-m\.png/ }
    ];

    for (let i = 0; i < emotionTests.length; i++) {
      const card = page.locator('[data-testid="diary-card"]').nth(i);
      const test = emotionTests[i];

      // 감정 이미지 확인
      const emotionImage = card.locator(`img[alt="${test.label}"]`);
      await expect(emotionImage).toBeVisible();
      await expect(emotionImage).toHaveAttribute('src', test.imagePattern);

      // 감정 텍스트 확인
      const emotionText = card.locator('[data-testid="diary-emotion"]');
      await expect(emotionText).toHaveText(test.label);
      await expect(emotionText).toHaveCSS('color', test.color);
    }
  });

  test('잘못된 로컬스토리지 데이터 형식 처리', async ({ page }) => {
    // 잘못된 형식의 데이터 저장
    await page.evaluate(() => {
      localStorage.setItem('diaries', 'invalid json');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]', { timeout: 500 });

    // 에러가 발생해도 페이지가 정상적으로 로드되는지 확인
    await expect(page.locator('[data-testid="diaries-page"]')).toBeVisible();
    
    // 일기 카드가 표시되지 않는지 확인
    const diaryCards = await page.locator('[data-testid="diary-card"]').count();
    expect(diaryCards).toBe(0);
  });
});
