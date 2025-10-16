import { test, expect } from '@playwright/test';

/**
 * 일기 상세 페이지 데이터 바인딩 테스트
 * 
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지의 실제 데이터를 바인딩하는 기능을 테스트합니다.
 * 
 * 테스트 조건:
 * - 실제 데이터 사용 (Mock 데이터 사용 금지)
 * - 로컬스토리지 모킹 금지
 * - timeout 500ms 미만
 * - data-testid 기반 페이지 로드 대기
 */
test.describe('일기 상세 페이지 데이터 바인딩', () => {
  test.beforeEach(async ({ context }) => {
    // 로컬스토리지에 테스트용 실제 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: '첫 번째 일기',
        content: '오늘은 정말 좋은 하루였어요. 새로운 경험을 많이 했습니다.',
        emotion: 'Happy',
        createdAt: '2024. 01. 15'
      },
      {
        id: 2,
        title: '두 번째 일기',
        content: '조금 슬픈 하루였지만, 그래도 괜찮아요.',
        emotion: 'Sad',
        createdAt: '2024. 01. 16'
      },
      {
        id: 3,
        title: '세 번째 일기',
        content: '놀라운 일이 있었어요! 정말 신기했습니다.',
        emotion: 'Surprise',
        createdAt: '2024. 01. 17'
      }
    ];

    // 컨텍스트를 통해 로컬스토리지에 실제 데이터 저장
    await context.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
  });

  test('ID 1번 일기 상세 데이터가 올바르게 바인딩되는지 확인', async ({ page }) => {
    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });

    // 제목이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('h1[class*="titleText"]')).toHaveText('첫 번째 일기');

    // 감정 텍스트가 올바르게 표시되는지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText('행복해요');

    // 감정 아이콘 이미지가 올바르게 표시되는지 확인
    const emotionIcon = page.locator('img[alt="행복해요"]');
    await expect(emotionIcon).toBeVisible();
    await expect(emotionIcon).toHaveAttribute('src', /emotion-happy-s\.png/);

    // 작성일이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('span[class*="dateText"]')).toHaveText('2024. 01. 15');

    // 내용이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('p[class*="contentText"]')).toHaveText('오늘은 정말 좋은 하루였어요. 새로운 경험을 많이 했습니다.');
  });

  test('ID 2번 일기 상세 데이터가 올바르게 바인딩되는지 확인', async ({ page }) => {
    // /diaries/2 페이지로 이동
    await page.goto('/diaries/2');

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });

    // 제목이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('h1[class*="titleText"]')).toHaveText('두 번째 일기');

    // 감정 텍스트가 올바르게 표시되는지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText('슬퍼요');

    // 감정 아이콘 이미지가 올바르게 표시되는지 확인
    const emotionIcon = page.locator('img[alt="슬퍼요"]');
    await expect(emotionIcon).toBeVisible();
    await expect(emotionIcon).toHaveAttribute('src', /emotion-sad-s\.png/);

    // 작성일이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('span[class*="dateText"]')).toHaveText('2024. 01. 16');

    // 내용이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('p[class*="contentText"]')).toHaveText('조금 슬픈 하루였지만, 그래도 괜찮아요.');
  });

  test('ID 3번 일기 상세 데이터가 올바르게 바인딩되는지 확인', async ({ page }) => {
    // /diaries/3 페이지로 이동
    await page.goto('/diaries/3');

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });

    // 제목이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('h1[class*="titleText"]')).toHaveText('세 번째 일기');

    // 감정 텍스트가 올바르게 표시되는지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText('놀랐어요');

    // 감정 아이콘 이미지가 올바르게 표시되는지 확인
    const emotionIcon = page.locator('img[alt="놀랐어요"]');
    await expect(emotionIcon).toBeVisible();
    await expect(emotionIcon).toHaveAttribute('src', /emotion-surprise-s\.png/);

    // 작성일이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('span[class*="dateText"]')).toHaveText('2024. 01. 17');

    // 내용이 올바르게 표시되는지 확인 (CSS Modules 해시화된 클래스명 사용)
    await expect(page.locator('p[class*="contentText"]')).toHaveText('놀라운 일이 있었어요! 정말 신기했습니다.');
  });

  test('존재하지 않는 ID로 접근 시 빈 데이터 처리 확인', async ({ page }) => {
    // /diaries/999 페이지로 이동 (존재하지 않는 ID)
    await page.goto('/diaries/999');

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });

    // 에러 상태 확인 - "오류 발생" 메시지 표시
    await expect(page.locator('h1[class*="titleText"]')).toHaveText('오류 발생');
    await expect(page.locator('p[class*="errorText"]')).toHaveText('ID 999에 해당하는 일기를 찾을 수 없습니다.');
  });

  test('로컬스토리지에 데이터가 없는 경우 처리 확인', async ({ page, context }) => {
    // 새로운 컨텍스트로 로컬스토리지 초기화
    await context.addInitScript(() => {
      localStorage.removeItem('diaries');
    });

    // /diaries/1 페이지로 이동
    await page.goto('/diaries/1');

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-page"]', { timeout: 500 });

    // 에러 상태 확인 - "오류 발생" 메시지 표시
    await expect(page.locator('h1[class*="titleText"]')).toHaveText('오류 발생');
    await expect(page.locator('p[class*="errorText"]')).toHaveText('저장된 일기가 없습니다.');
  });
});
