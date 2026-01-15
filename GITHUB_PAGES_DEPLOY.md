# GitHub Pages 배포 가이드

이 가이드는 QR 코드 생성기를 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 빠른 배포 (GitHub Actions - 자동 배포)

### 1단계: GitHub 저장소 생성 및 코드 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

**중요**: 저장소 이름을 기억해두세요! (예: `qr-code-generator`)

### 2단계: GitHub Pages 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - **Source**: `GitHub Actions` 선택
5. 저장 (Save)

### 3단계: 자동 배포 확인

- `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다
- **Actions** 탭에서 배포 진행 상황을 확인할 수 있습니다
- 배포 완료 후 `https://your-username.github.io/your-repo-name/` 에서 접속 가능합니다

## 📝 수동 배포 (gh-pages 사용)

GitHub Actions 대신 수동으로 배포하려면:

### 1단계: gh-pages 패키지 설치

```bash
npm install --save-dev gh-pages
```

### 2단계: vite.config.js 수정

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // 저장소 이름으로 변경
  // ...
})
```

### 3단계: 배포 실행

```bash
npm run deploy
```

### 4단계: GitHub Pages 활성화

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: `Deploy from a branch` 선택
3. **Branch**: `gh-pages` 선택
4. **Folder**: `/ (root)` 선택
5. **Save** 클릭

## ⚙️ 저장소 이름 변경 시

만약 저장소 이름을 변경했다면:

1. **vite.config.js**에서 `base` 경로 수정
2. **.github/workflows/deploy.yml**에서 `VITE_BASE_URL` 확인
3. 다시 빌드 및 배포

## 🔍 배포 확인

배포가 완료되면 다음 URL로 접속할 수 있습니다:

```
https://your-username.github.io/your-repo-name/
```

예시:
- 저장소: `https://github.com/johndoe/qr-generator`
- 배포 URL: `https://johndoe.github.io/qr-generator/`

## ⚠️ 주의사항

1. **저장소 이름이 base 경로가 됩니다**
   - 저장소 이름: `qr-code-generator`
   - 배포 URL: `https://username.github.io/qr-code-generator/`

2. **루트 도메인 사용 시**
   - 저장소 이름을 `username.github.io`로 만들면
   - 배포 URL: `https://username.github.io/` (루트 경로)
   - 이 경우 `vite.config.js`의 `base`를 `/`로 설정

3. **커스텀 도메인 사용**
   - GitHub Pages Settings에서 Custom domain 설정
   - `base` 경로는 `/`로 설정

## 🐛 문제 해결

### 배포가 안 될 때

1. **Actions 탭 확인**
   - 빌드 에러가 있는지 확인
   - 로그를 확인하여 문제 파악

2. **빌드 로컬 테스트**
   ```bash
   npm run build
   npm run preview
   ```

3. **base 경로 확인**
   - `vite.config.js`의 `base`가 올바른지 확인
   - 저장소 이름과 일치하는지 확인

### 404 에러가 발생할 때

- `base` 경로가 올바르게 설정되었는지 확인
- GitHub Pages 설정에서 Source가 올바른지 확인

## 📚 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html#github-pages)
