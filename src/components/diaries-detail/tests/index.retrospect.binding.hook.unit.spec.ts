import { test, expect } from '@playwright/test';

/**
 * 회고 데이터 바인딩 훅 단위 테스트
 * 
 * 컴포넌트가 올바르게 렌더링되는지 확인하는 간단한 테스트
 */
test.describe('회고 데이터 바인딩 훅 단위 테스트', () => {
  test('회고 데이터가 없는 경우 빈 상태 메시지가 표시되어야 함', async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy' as const,
      createdAt: '2024-09-24T10:00:00.000Z'
    };

    await page.addInitScript((diary) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.removeItem('retrospects');
    }, testDiary);

    // 컴포넌트를 직접 렌더링하는 페이지로 이동
    await page.goto('http://localhost:3000/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 빈 상태 메시지 확인
    const emptyMessage = retrospectList.locator('.retrospectItemText');
    await expect(emptyMessage).toContainText('등록된 회고가 없습니다.');
  });

  test('회고 데이터가 있는 경우 올바르게 표시되어야 함', async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiary = {
      id: 1,
      title: '테스트 일기',
      content: '테스트 내용입니다.',
      emotion: 'happy' as const,
      createdAt: '2024-09-24T10:00:00.000Z'
    };

    // 테스트용 회고 데이터 설정
    const testRetrospects = [
      {
        id: 1,
        content: '3년이 지나고 다시 보니 이때가 그립다.',
        diaryId: 1,
        createdAt: '2024-09-24T10:00:00.000Z'
      }
    ];

    await page.addInitScript((diary, retrospects) => {
      localStorage.setItem('diaries', JSON.stringify([diary]));
      localStorage.setItem('retrospects', JSON.stringify(retrospects));
    }, testDiary, testRetrospects);

    // 컴포넌트를 직접 렌더링하는 페이지로 이동
    await page.goto('http://localhost:3000/diaries/1');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diary-detail-page"]');
    
    // 회고 목록이 표시되는지 확인
    const retrospectList = page.locator('.retrospectList');
    await expect(retrospectList).toBeVisible();
    
    // 회고 내용 확인
    const retrospectItem = retrospectList.locator('.retrospectItem').first();
    await expect(retrospectItem.locator('.retrospectItemText')).toContainText('3년이 지나고 다시 보니 이때가 그립다.');
    await expect(retrospectItem.locator('.retrospectItemDateText')).toContainText('[2024. 09. 24]');
  });
});
