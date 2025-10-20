import { test, expect } from '@playwright/test';

/**
 * Pictures 컴포넌트 Playwright 테스트
 * 
 * Dog CEO API를 사용한 강아지 사진 목록 조회 기능을 테스트합니다.
 * TDD 기반으로 작성되었으며, 실제 API를 사용합니다.
 */
test.describe('Pictures 컴포넌트 - 강아지 사진 목록 조회', () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
  });

  test('페이지 로드 시 강아지 사진 목록이 표시되어야 함', async ({ page }) => {
    // 초기 로딩 스플래시 스크린이 표시되는지 확인
    const splashScreens = await page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens).toHaveCount(6);
    
    // 스플래시 스크린이 사라지고 실제 이미지가 로드될 때까지 대기
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 5000 });
    
    // 강아지 이미지가 6개 표시되는지 확인
    const dogImages = page.locator('img[src*="dog.ceo"]');
    await expect(dogImages).toHaveCount(6);
    
    // 각 이미지가 dog.ceo 도메인을 포함하는지 확인
    for (let i = 0; i < 6; i++) {
      const imageSrc = await dogImages.nth(i).getAttribute('src');
      expect(imageSrc).toContain('dog.ceo');
    }
  });

  test('무한스크롤 시 추가 강아지 사진이 로드되어야 함', async ({ page }) => {
    // 초기 6개 이미지가 로드될 때까지 대기
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 5000 });
    
    // 초기 이미지 개수 확인
    let dogImages = page.locator('img[src*="dog.ceo"]');
    await expect(dogImages).toHaveCount(6);
    
    // 페이지를 스크롤하여 무한스크롤 트리거
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // 추가 이미지가 로드될 때까지 대기 (더 긴 타임아웃)
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img[src*="dog.ceo"]');
      return images.length >= 12;
    }, { timeout: 5000 });
    
    // 총 12개 이상의 이미지가 표시되는지 확인
    dogImages = page.locator('img[src*="dog.ceo"]');
    await expect(dogImages).toHaveCount(12);
  });

  test('로딩 중 스플래시 스크린이 올바르게 표시되어야 함', async ({ page }) => {
    // 페이지 새로고침으로 로딩 상태 재현
    await page.reload();
    
    // 스플래시 스크린이 6개 표시되는지 확인
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens).toHaveCount(6);
    
    // 스플래시 스크린의 스타일이 올바른지 확인
    const firstSplash = splashScreens.first();
    await expect(firstSplash).toHaveCSS('background-color', 'rgb(243, 244, 246)'); // #f3f4f6
    await expect(firstSplash).toHaveCSS('border-radius', '24px');
    
    // 스플래시 라인이 1개 있는지 확인 (CSS 모듈 클래스명 사용)
    const splashLines = firstSplash.locator('div').filter({ hasText: '' });
    await expect(splashLines).toHaveCount(1);
  });

  test('API 에러 시 에러 메시지가 표시되어야 함', async ({ page }) => {
    // API 요청을 실패하도록 모킹
    await page.route('https://dog.ceo/api/breeds/image/random/6*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // 페이지 새로고침
    await page.reload();
    
    // 에러 메시지가 표시되는지 확인 (CSS 모듈 클래스명 사용)
    const errorMessage = page.locator('[class*="errorMessage"]');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    await expect(errorMessage).toContainText('강아지 사진을 불러오는데 실패했습니다.');
  });

  test('필터 기능이 정상적으로 작동해야 함', async ({ page }) => {
    // 필터 셀렉트박스가 표시되는지 확인
    const filterSelectbox = page.locator('[role="combobox"]').first();
    await expect(filterSelectbox).toBeVisible();
    
    // 셀렉트박스를 클릭하여 드롭다운 열기
    await filterSelectbox.click();
    
    // 필터 옵션들이 올바르게 표시되는지 확인 (Selectbox 컴포넌트 구조에 맞게 수정)
    const filterOptions = page.locator('[role="option"]');
    await expect(filterOptions).toHaveCount(3);
  });

  test('이미지가 올바른 크기와 스타일로 표시되어야 함', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 5000 });
    
    // 첫 번째 이미지의 크기와 스타일 확인
    const firstImage = page.locator('img[src*="dog.ceo"]').first();
    await expect(firstImage).toHaveCSS('width', '640px');
    await expect(firstImage).toHaveCSS('height', '640px');
    await expect(firstImage).toHaveCSS('border-radius', '24px');
    await expect(firstImage).toHaveCSS('object-fit', 'cover');
  });

  test('반응형 레이아웃이 올바르게 작동해야 함', async ({ page }) => {
    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 컨테이너가 올바르게 표시되는지 확인
    const container = page.locator('[data-testid="pictures-container"]');
    await expect(container).toBeVisible();
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 5000 });
    
    // 이미지가 여전히 표시되는지 확인
    const dogImages = page.locator('img[src*="dog.ceo"]');
    await expect(dogImages).toHaveCount(6);
  });
});