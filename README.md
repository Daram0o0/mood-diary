# Mood Diary - Component Library

Mood Diary는 Next.js와 Storybook을 활용한 재사용 가능한 컴포넌트 라이브러리 프로젝트입니다.

## 🚀 기술 스택

- **Frontend Framework**: Next.js 14.2.32
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Development**: Storybook
- **State Management**: React Query (@tanstack/react-query)
- **Theme**: next-themes
- **Testing**: Vitest, Playwright

## 📦 주요 컴포넌트

- **Button**: 다양한 스타일의 버튼 컴포넌트
- **Input**: 폼 입력을 위한 인풋 컴포넌트
- **Pagination**: 페이지네이션 컴포넌트
- **Searchbar**: 검색 기능을 위한 서치바 컴포넌트
- **Toggle**: 토글 스위치 컴포넌트
- **Selectbox**: 선택 박스 컴포넌트

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue 계열 (50-900)
- **Neutral**: Gray 계열 (0-950)
- **Error**: Red 계열 (50-600)
- **Success**: Green 계열 (50-600)
- **Warning**: Yellow 계열 (50-600)
- **Cool Gray**: Cool Gray 계열 (10-600)

### 폰트
- **Primary**: Geist Sans (Variable Font)
- **Monospace**: Geist Mono (Variable Font)

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

3. **Storybook 실행**
   ```bash
   npm run storybook
   ```
   브라우저에서 [http://localhost:6006](http://localhost:6006)을 열어 컴포넌트를 확인하세요.

## 📝 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행
- `npm run storybook`: Storybook 개발 서버 실행
- `npm run build-storybook`: Storybook 빌드

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── commons/               # 공통 컴포넌트 및 유틸리티
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── button/        # 버튼 컴포넌트
│   │   ├── input/         # 인풋 컴포넌트
│   │   ├── pagination/    # 페이지네이션 컴포넌트
│   │   ├── searchbar/     # 서치바 컴포넌트
│   │   ├── selectbox/     # 셀렉트박스 컴포넌트
│   │   └── toggle/        # 토글 컴포넌트
│   ├── constants/         # 상수 정의
│   └── providers/         # Context Provider들
│       ├── modal/         # 모달 Provider
│       ├── next-themes/   # 테마 Provider
│       └── react-query/   # React Query Provider
└── public/                # 정적 파일
    ├── icons/             # 아이콘 파일들
    └── images/            # 이미지 파일들
```

## 🎯 컴포넌트 개발 가이드

각 컴포넌트는 다음 구조를 따릅니다:

```
component-name/
├── index.tsx              # 컴포넌트 구현
├── index.stories.tsx      # Storybook 스토리
├── styles.module.css      # 컴포넌트 스타일
└── prompts/               # AI 프롬프트 파일들
    ├── prompt.101.ui.txt  # UI 프롬프트
    └── prompt.201.stories.txt # 스토리 프롬프트
```

## 🧪 테스팅

- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **Visual Testing**: Storybook + Chromatic

## 📚 추가 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Storybook 공식 문서](https://storybook.js.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [React Query 공식 문서](https://tanstack.com/query/latest)

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.