# QR 코드 생성기

중앙에 이미지를 배치한 맞춤형 QR코드를 생성하는 웹 애플리케이션입니다.

## 주요 기능

- ✅ 링크(URL) 입력 및 복사/붙여넣기 지원
- ✅ 중앙에 이미지 배치 (사이즈 조절 가능)
- ✅ 이미지 뒷배경 하얀색 처리로 QR코드 가독성 보장
- ✅ 최대 10개까지 다중 링크 관리
- ✅ 일괄 생성 및 ZIP 파일로 다운로드
- ✅ 실시간 미리보기
- ✅ 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 배포하기

이 프로젝트는 여러 플랫폼에 배포할 수 있습니다. 가장 추천하는 방법은 **GitHub Pages**, **Vercel** 또는 **Netlify**입니다.

### 방법 1: GitHub Pages로 배포 (추천 ⭐)

GitHub Pages는 GitHub 저장소와 함께 무료로 제공되는 정적 사이트 호스팅 서비스입니다.

#### 자동 배포 (GitHub Actions)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **GitHub Pages 활성화**
   - GitHub 저장소 → **Settings** → **Pages**
   - **Source**: `GitHub Actions` 선택
   - 저장

3. **완료!** `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다.
   - 배포 URL: `https://your-username.github.io/your-repo-name/`

자세한 내용은 [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md)를 참고하세요.

### 방법 2: Vercel로 배포

Vercel은 가장 간단하고 빠른 배포 방법입니다.

#### GitHub를 통한 배포 (자동 배포)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Vercel에 연결**
   - [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정 확인:
     - Framework Preset: `Vite`
     - Build Command: `npm run build` (자동 감지됨)
     - Output Directory: `dist` (자동 감지됨)
   - "Deploy" 클릭

3. **완료!** 몇 분 후 배포된 URL을 받게 됩니다.

#### Vercel CLI를 통한 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 3: Netlify로 배포

#### GitHub를 통한 배포 (자동 배포)

1. **GitHub에 프로젝트 푸시** (위와 동일)

2. **Netlify에 연결**
   - [Netlify](https://www.netlify.com)에 접속하여 GitHub 계정으로 로그인
   - "Add new site" → "Import an existing project" 클릭
   - GitHub 저장소 선택
   - 빌드 설정 확인:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - "Deploy site" 클릭

3. **완료!** 배포된 URL을 받게 됩니다.

#### Netlify CLI를 통한 배포

```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod --dir=dist
```

### 방법 4: 기타 호스팅 서비스

- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: AWS 콘솔에서 설정
- **Cloudflare Pages**: GitHub 연동 후 자동 배포

### 배포 전 확인사항

1. ✅ 빌드 테스트
   ```bash
   npm run build
   npm run preview
   ```

2. ✅ 환경 변수 확인 (현재 프로젝트는 환경 변수 불필요)

3. ✅ `.gitignore` 확인 (`node_modules`, `dist` 제외 확인)

## 사용 방법

1. 링크(URL)를 입력합니다
2. 중앙에 배치할 이미지를 선택합니다
3. 이미지 크기를 조절합니다 (10% ~ 30%)
4. 필요시 [+추가] 버튼으로 더 많은 항목을 추가합니다 (최대 10개)
5. [QR코드 생성] 버튼을 눌러 ZIP 파일로 다운로드합니다

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **qrcode** - QR코드 생성 라이브러리
- **jszip** - ZIP 파일 생성

## 프로젝트 구조

```
QR/
├── src/
│   ├── components/
│   │   └── QRItem.jsx      # 개별 QR 항목 컴포넌트
│   ├── utils/
│   │   └── qrGenerator.js  # QR코드 생성 유틸리티
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── main.jsx            # 진입점
│   └── index.css           # 전역 스타일
├── index.html
├── package.json
└── vite.config.js
```
