# 배포 가이드

이 문서는 QR 코드 생성기를 배포하는 방법을 안내합니다.

## 빠른 시작 (Vercel - 추천)

### 1단계: GitHub에 코드 업로드

```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/your-username/qr-code-generator.git
git branch -M main
git push -u origin main
```

### 2단계: Vercel 배포

1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" → GitHub 계정으로 로그인
3. "Add New..." → "Project" 클릭
4. GitHub 저장소 선택
5. 프로젝트 설정:
   - **Framework Preset**: Vite (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `dist` (자동)
6. "Deploy" 클릭

✅ **완료!** 몇 분 후 배포된 URL을 받게 됩니다.

## 다른 배포 옵션

### Netlify

1. [netlify.com](https://www.netlify.com) 접속
2. GitHub 계정으로 로그인
3. "Add new site" → "Import an existing project"
4. 저장소 선택
5. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. "Deploy site" 클릭

### 수동 배포 (정적 호스팅)

1. 빌드:
   ```bash
   npm run build
   ```

2. `dist` 폴더의 내용을 호스팅 서비스에 업로드:
   - AWS S3
   - Google Cloud Storage
   - Azure Static Web Apps
   - 기타 정적 호스팅 서비스

## 커스텀 도메인 설정

### Vercel
1. 프로젝트 설정 → Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 진행

### Netlify
1. Site settings → Domain management
2. "Add custom domain" 클릭
3. DNS 설정 안내에 따라 진행

## 환경 변수

현재 프로젝트는 환경 변수가 필요하지 않습니다. 
향후 API 키 등이 필요하면 각 플랫폼의 환경 변수 설정을 사용하세요.

## 트러블슈팅

### 빌드 실패
- `npm install`이 제대로 실행되었는지 확인
- Node.js 버전 확인 (18 이상 권장)

### 라우팅 문제
- SPA이므로 모든 경로를 `index.html`로 리다이렉트해야 함
- `vercel.json` 또는 `netlify.toml` 확인

### 이미지/파일 로드 실패
- 경로가 상대 경로인지 확인
- 빌드 후 `dist` 폴더 구조 확인
