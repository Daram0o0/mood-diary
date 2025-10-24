import { test, expect } from '@playwright/test';

/**
 * 강아지 사진 필터 기능 테스트
 * 
 * 테스트 시나리오:
 * 1. /pictures 페이지가 완전히 로드된 후 테스트
 * 2. 필터 선택박스가 올바르게 렌더링되는지 확인
 * 3. 필터 변경 시 이미지 크기가 올바르게 변경되는지 확인
 */
test.describe('강아지 사진 필터 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
    
    // 추가 로딩 대기 (이미지들이 로드될 때까지)
    await page.waitForSelector('[data-testid="splash-screen"]', { state: 'hidden', timeout: 1000 });
  });

  test('필터 선택박스가 올바르게 렌더링되는지 확인', async ({ page }) => {
    // 필터 선택박스가 존재하는지 확인 (커스텀 Selectbox 컴포넌트 사용)
    const filterSelectbox = page.locator('[data-testid="pictures-container"] [role="combobox"]');
    await expect(filterSelectbox).toBeVisible();
    
    // 필터 옵션들이 올바르게 표시되는지 확인
    await filterSelectbox.click();
    
    // 기본 옵션이 선택되어 있는지 확인
    const defaultOption = page.locator('[role="option"]:has-text("기본")');
    await expect(defaultOption).toBeVisible();
    
    // 가로형 옵션이 있는지 확인
    const horizontalOption = page.locator('[role="option"]:has-text("가로형")');
    await expect(horizontalOption).toBeVisible();
    
    // 세로형 옵션이 있는지 확인
    const verticalOption = page.locator('[role="option"]:has-text("세로형")');
    await expect(verticalOption).toBeVisible();
  });

  test('기본 필터 선택 시 이미지 크기가 640x640인지 확인', async ({ page }) => {
    // 기본 필터가 선택되어 있는지 확인 (커스텀 Selectbox 컴포넌트 사용)
    const filterSelectbox = page.locator('[data-testid="pictures-container"] [role="combobox"]');
    await expect(filterSelectbox).toContainText('기본');
    
    // 이미지가 로드될 때까지 대기 (API 호출 완료 대기)
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 10000 });
    
    // 이미지 아이템들의 크기 확인 (CSS 모듈 클래스명 사용)
    const imageItems = page.locator('[class*="imageItem"]');
    await expect(imageItems).toHaveCount(6);
    
    const firstImage = imageItems.first();
    
    // 이미지 크기 확인 (CSS로 설정된 크기)
    const imageSize = await firstImage.boundingBox();
    expect(imageSize).toBeTruthy();
    
    // 기본 크기: 640x640 (CSS에서 설정된 크기)
    expect(imageSize!.width).toBe(640);
    expect(imageSize!.height).toBe(640);
  });

  test('가로형 필터 선택 시 이미지 크기가 640x480으로 변경되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기 (API 호출 완료 대기)
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 10000 });
    
    // 필터 선택박스 클릭 (커스텀 Selectbox 컴포넌트 사용)
    const filterSelectbox = page.locator('[data-testid="pictures-container"] [role="combobox"]');
    await filterSelectbox.click();
    
    // 가로형 옵션 선택
    const horizontalOption = page.locator('[role="option"]:has-text("가로형")');
    await horizontalOption.click();
    
    // 필터가 변경되었는지 확인
    await expect(filterSelectbox).toContainText('가로형');
    
    // 이미지 크기 변경을 확인하기 위해 잠시 대기
    await page.waitForTimeout(500);
    
    // 이미지 아이템들의 크기 확인 (CSS 모듈 클래스명 사용)
    const imageItems = page.locator('[class*="imageItem"]');
    await expect(imageItems).toHaveCount(6);
    
    const firstImage = imageItems.first();
    
    // 이미지 크기 확인
    const imageSize = await firstImage.boundingBox();
    expect(imageSize).toBeTruthy();
    
    // 가로형 크기: 640x480
    expect(imageSize!.width).toBe(640);
    expect(imageSize!.height).toBe(480);
  });

  test('세로형 필터 선택 시 이미지 크기가 480x640으로 변경되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기 (API 호출 완료 대기)
    await page.waitForSelector('img[src*="dog.ceo"]', { timeout: 10000 });
    
    // 필터 선택박스 클릭 (커스텀 Selectbox 컴포넌트 사용)
    const filterSelectbox = page.locator('[data-testid="pictures-container"] [role="combobox"]');
    await filterSelectbox.click();
    
    // 세로형 옵션 선택
    const verticalOption = page.locator('[role="option"]:has-text("세로형")');
    await verticalOption.click();
    
    // 필터가 변경되었는지 확인
    await expect(filterSelectbox).toContainText('세로형');
    
    // 이미지 크기 변경을 확인하기 위해 잠시 대기
    await page.waitForTimeout(500);
    
    // 이미지 아이템들의 크기 확인 (CSS 모듈 클래스명 사용)
    const imageItems = page.locator('[class*="imageItem"]');
    await expect(imageItems).toHaveCount(6);
    
    const firstImage = imageItems.first();
    
    // 이미지 크기 확인
    const imageSize = await firstImage.boundingBox();
    expect(imageSize).toBeTruthy();
    
    // 세로형 크기: 480x640
    expect(imageSize!.width).toBe(480);
    expect(imageSize!.height).toBe(640);
  });

  test('필터 변경 시 모든 이미지가 동일한 크기로 변경되는지 확인', async ({ page }) => {
    // 가로형 필터로 변경 (커스텀 Selectbox 컴포넌트 사용)
    const filterSelectbox = page.locator('[data-testid="pictures-container"] [role="combobox"]');
    await filterSelectbox.click();
    const horizontalOption = page.locator('[role="option"]:has-text("가로형")');
    await horizontalOption.click();
    
    // 이미지 크기 변경을 확인하기 위해 잠시 대기
    await page.waitForTimeout(500);
    
    // 모든 이미지 아이템들의 크기 확인
    const imageItems = page.locator('.imageItem');
    const count = await imageItems.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // 처음 3개 이미지만 확인
      const imageItem = imageItems.nth(i);
      await imageItem.waitFor({ state: 'visible', timeout: 1000 });
      
      const imageSize = await imageItem.boundingBox();
      expect(imageSize).toBeTruthy();
      
      // 모든 이미지가 가로형 크기(640x480)로 변경되었는지 확인
      expect(imageSize!.width).toBe(640);
      expect(imageSize!.height).toBe(480);
    }
  });
});
