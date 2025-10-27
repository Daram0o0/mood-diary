# 📝 일기 Mock 데이터 생성기

페이지네이션 테스트를 위한 일기 Mock 데이터를 생성하고 로컬스토리지에 등록하는 도구입니다.

## 🚀 사용 방법

### 1. npm 스크립트 사용 (권장)

```bash
# 기본 50개 데이터 생성
npm run mock:generate

# 50개 데이터 생성
npm run mock:generate:50

# 100개 데이터 생성
npm run mock:generate:100

# 직접 개수 지정
npm run mock:generate -- 30
```

### 2. 직접 스크립트 실행

```bash
# 기본 50개 데이터 생성
node scripts/generate-mock-diaries.js

# 개수 지정
node scripts/generate-mock-diaries.js 30
```

## 📁 생성되는 파일

스크립트 실행 후 `scripts/` 디렉토리에 다음 파일들이 생성됩니다:

- `mock-diaries.html` - 브라우저에서 실행할 수 있는 HTML 파일
- `mock-diaries.json` - 생성된 Mock 데이터 (참고용)

## 🌐 데이터 등록 방법

1. 브라우저에서 `scripts/mock-diaries.html` 파일을 열기
2. "Mock 데이터 등록하기" 버튼 클릭
3. 개발자 도구(F12) → Application → Local Storage에서 `diaries` 키 확인
4. 일기 목록 페이지에서 페이지네이션 테스트

## 📊 데이터 구조

생성되는 Mock 데이터는 다음 구조를 따릅니다:

```typescript
interface DiaryData {
  id: number;           // 고유 ID
  title: string;        // 일기 제목
  content: string;      // 일기 내용
  emotion: EmotionType; // 감정 ('Happy', 'Sad', 'Angry', 'Surprise', 'Etc')
  createdAt: string;    // 생성일 (ISO 8601 형식)
}
```

## 🎭 감정 타입

- `Happy` - 행복해요
- `Sad` - 슬퍼요
- `Angry` - 화나요
- `Surprise` - 놀랐어요
- `Etc` - 기타

## 🔧 기능

- ✅ 랜덤한 제목과 내용으로 일기 데이터 생성
- ✅ 다양한 감정 타입으로 분산 생성
- ✅ 최근 1년 내의 랜덤 날짜로 생성
- ✅ 최신순으로 정렬
- ✅ 브라우저에서 간편한 데이터 등록
- ✅ 데이터 통계 및 확인 기능
- ✅ 기존 데이터 삭제 기능

## 📈 페이지네이션 테스트

생성된 Mock 데이터를 사용하여 다음 기능들을 테스트할 수 있습니다:

- 일기 목록 페이지네이션
- 검색 기능
- 감정별 필터링
- 정렬 기능

## 🛠️ 개발자 도구 확인

브라우저 개발자 도구에서 다음을 확인할 수 있습니다:

```javascript
// 로컬스토리지에서 데이터 확인
const diaries = JSON.parse(localStorage.getItem('diaries'));
console.log('총 일기 개수:', diaries.length);

// 최신 일기 확인
console.log('최신 일기:', diaries[0]);

// 감정별 분포 확인
const emotionCounts = {};
diaries.forEach(diary => {
  emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1;
});
console.log('감정별 분포:', emotionCounts);
```
