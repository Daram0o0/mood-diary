import { test, expect } from '@playwright/test';

/**
 * 회고 데이터 바인딩 훅 Playwright 테스트
 * 
 * TDD 기반으로 구현된 회고 데이터 바인딩 기능을 테스트합니다.
 * 실제 로컬스토리지 데이터를 사용하여 테스트합니다.
 */
test.describe('회고 데이터 바인딩 훅 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 회고 데이터를 로컬스토리지에 설정
    const testRetrospects = [
      {
        id: 1,
        content: '3년이 지나고 다시 보니 이때가 그립다.',
        diaryId: 1,
        createdAt: '2024-09-24T10:00:00.000Z'
      },
      {
        id: 2,
        content: '이때는 정말 힘들었는데 지금은 추억이 되었다.',
        diaryId: 1,
        createdAt: '2024-09-25T14:30:00.000Z'
      },
      {
        id: 3,
        content: '다른 일기에 대한 회고입니다.',
        diaryId: 2,
        createdAt: '2024-09-26T09:15:00.000Z'
      }
    ];

    await page.addInitScript((retrospects) => {
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, testRetrospects);
  });

  test('일기 ID 1에 대한 회고 데이터가 올바르게 바인딩되어야 함', async ({ page }) => {
    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 첫 번째 회고 항목 확인
    const firstRetrospect = retrospectList.locator('.retrospectItem').first();
    await expect(firstRetrospect.locator('.retrospectItemText')).toContainText('3년이 지나고 다시 보니 이때가 그립다.');
    await expect(firstRetrospect.locator('.retrospectItemDateText')).toContainText('[2024. 09. 24]');
    
    // 두 번째 회고 항목 확인
    const secondRetrospect = retrospectList.locator('.retrospectItem').nth(1);
    await expect(secondRetrospect.locator('.retrospectItemText')).toContainText('이때는 정말 힘들었는데 지금은 추억이 되었다.');
    await expect(secondRetrospect.locator('.retrospectItemDateText')).toContainText('[2024. 09. 25]');
    
    // 구분선이 있는지 확인
    const retrospectLine = retrospectList.locator('.retrospectLine');
    await expect(retrospectLine).toBeVisible();
    
    // 총 2개의 회고 항목이 있는지 확인 (diaryId가 1인 것만)
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(2);
  });

  test('일기 ID 2에 대한 회고 데이터가 올바르게 바인딩되어야 함', async ({ page }) => {
    // /diaries/2 페이지로 이동
    await page.goto('/diaries/2');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // diaryId가 2인 회고 항목만 표시되는지 확인
    const retrospectItem = retrospectList.locator('.retrospectItem').first();
    await expect(retrospectItem.locator('.retrospectItemText')).toContainText('다른 일기에 대한 회고입니다.');
    await expect(retrospectItem.locator('.retrospectItemDateText')).toContainText('[2024. 09. 26]');
    
    // 총 1개의 회고 항목이 있는지 확인
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(1);
  });

  test('존재하지 않는 일기 ID에 대해서는 회고가 표시되지 않아야 함', async ({ page }) => {
    // /diaries/999 페이지로 이동 (존재하지 않는 일기)
    await page.goto('/diaries/999');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 비어있는지 확인
    const retrospectList = page.locator('.retrospectList');
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(0);
  });

  test('로컬스토리지에 회고 데이터가 없는 경우 빈 목록이 표시되어야 함', async ({ page }) => {
    // 로컬스토리지 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('retrospects');
    });
    
    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 비어있는지 확인
    const retrospectList = page.locator('.retrospectList');
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(0);
  });

  test('잘못된 JSON 형식의 로컬스토리지 데이터는 에러 없이 처리되어야 함', async ({ page }) => {
    // 잘못된 JSON 형식의 데이터를 로컬스토리지에 설정
    await page.addInitScript(() => {
      localStorage.setItem('retrospects', 'invalid-json');
    });
    
    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 페이지가 정상적으로 로드되고 회고 목록이 비어있는지 확인
    const retrospectList = page.locator('.retrospectList');
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(0);
  });
});
