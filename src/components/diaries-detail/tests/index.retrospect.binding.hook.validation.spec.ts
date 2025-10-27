import { test, expect } from '@playwright/test';

/**
 * 회고 데이터 바인딩 훅 데이터 타입 검증 테스트
 * 
 * 요구사항에 명시된 정확한 데이터 타입 구조를 검증합니다.
 */
test.describe('회고 데이터 바인딩 훅 데이터 타입 검증 테스트', () => {
  test('요구사항에 명시된 데이터 타입 구조가 올바르게 처리되어야 함', async ({ page }) => {
    // 요구사항에 명시된 정확한 데이터 타입 구조
    const testRetrospects = [
      {
        id: 1, // number
        content: '3년이 지나고 다시 보니 이때가 그립다.', // string
        diaryId: 1, // number
        createdAt: '2024-09-24T10:00:00.000Z' // string (ISO 8601)
      },
      {
        id: 2,
        content: '이때는 정말 힘들었는데 지금은 추억이 되었다.',
        diaryId: 1,
        createdAt: '2024-09-25T14:30:00.000Z'
      }
    ];

    // 테스트용 일기 데이터도 함께 설정
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy' as const,
      createdAt: '2024-09-24T10:00:00.000Z'
    };

    await page.addInitScript((diary, retrospects) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, testDiary, testRetrospects);

    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 데이터 타입 검증: number 타입 id 필드
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(2);
    
    // 데이터 타입 검증: string 타입 content 필드
    const firstItem = retrospectItems.first();
    await expect(firstItem.locator('.retrospectItemText')).toContainText('3년이 지나고 다시 보니 이때가 그립다.');
    
    // 데이터 타입 검증: string 타입 createdAt 필드 (ISO 8601 형식)
    await expect(firstItem.locator('.retrospectItemDateText')).toContainText('[2024. 09. 24]');
    
    // 데이터 타입 검증: number 타입 diaryId 필터링
    const secondItem = retrospectItems.nth(1);
    await expect(secondItem.locator('.retrospectItemText')).toContainText('이때는 정말 힘들었는데 지금은 추억이 되었다.');
    await expect(secondItem.locator('.retrospectItemDateText')).toContainText('[2024. 09. 25]');
  });

  test('잘못된 데이터 타입은 에러 없이 처리되어야 함', async ({ page }) => {
    // 잘못된 데이터 타입 구조 (요구사항과 다른 타입)
    const invalidRetrospects = [
      {
        id: 'invalid-id', // string instead of number
        content: 123, // number instead of string
        diaryId: 'invalid-diary-id', // string instead of number
        createdAt: new Date() // Date object instead of string
      }
    ];

    // 테스트용 일기 데이터
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy' as const,
      createdAt: '2024-09-24T10:00:00.000Z'
    };

    await page.addInitScript((diary, retrospects) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, testDiary, invalidRetrospects);

    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 페이지가 정상적으로 로드되어야 함 (에러 없이)
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 잘못된 데이터는 필터링되어 표시되지 않아야 함
    const retrospectItems = retrospectList.locator('.retrospectItem');
    await expect(retrospectItems).toHaveCount(0);
  });

  test('빈 배열 데이터는 올바르게 처리되어야 함', async ({ page }) => {
    // 빈 배열 데이터
    const emptyRetrospects: unknown[] = [];

    // 테스트용 일기 데이터
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy' as const,
      createdAt: '2024-09-24T10:00:00.000Z'
    };

    await page.addInitScript((diary, retrospects) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, testDiary, emptyRetrospects);

    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 빈 상태 메시지가 표시되어야 함
    const emptyMessage = retrospectList.locator('.retrospectItemText');
    await expect(emptyMessage).toContainText('등록된 회고가 없습니다.');
  });
});
