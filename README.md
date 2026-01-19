# Portfolio Site

미니멀한 포트폴리오 사이트입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 빌드

```bash
npm run build
```

## GitHub Pages 배포

이 프로젝트는 GitHub Actions로 자동 배포되도록 설정되어 있습니다.

### 배포 절차

1. GitHub에 push
2. GitHub 저장소 → Settings → Pages → Source를 `GitHub Actions`로 선택
3. Actions 탭에서 `Deploy to GitHub Pages`가 성공하면 배포 완료

### 배포 URL

일반적으로 아래 형태입니다:

```
https://<username>.github.io/<repo>/
```

## 커스터마이징

### 프로젝트 데이터 수정

`src/data.ts` 파일에서 프로젝트 정보와 개인 정보를 수정할 수 있습니다.

### 스타일 수정

`tailwind.config.js`에서 테마를 커스터마이징할 수 있습니다.

### 이미지 추가

프로젝트 이미지는 `src/data.ts`의 `image` 필드에 URL을 추가하거나, `public` 폴더에 이미지를 추가한 후 경로를 지정할 수 있습니다.

## 구조

```
src/
├── components/     # React 컴포넌트
├── data.ts        # 프로젝트 및 개인 정보 데이터
├── types.ts       # TypeScript 타입 정의
├── App.tsx        # 메인 앱 컴포넌트
├── main.tsx       # 진입점
└── index.css      # 글로벌 스타일
```


