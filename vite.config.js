import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 base 경로 설정
  // 로컬 개발: '/' (환경 변수 없음)
  // GitHub Pages: '/qr_maker/' (GitHub Actions에서 VITE_BASE_URL 설정)
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
