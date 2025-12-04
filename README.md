<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# YouTube Trend Analyzer

YouTube 영상의 트렌드를 분석하고 성과를 평가하는 웹 애플리케이션입니다.

## 기능

- 키워드 기반 YouTube 영상 검색
- 다양한 필터 옵션 (국가, 영상 길이, 업로드 날짜, 구독자 수, 조회수)
- 성과 레벨 분석 (조회수 / 구독자 수 비율)
- 그리드 및 테이블 뷰 지원
- CSV 파일로 데이터 내보내기

## 로컬 실행 방법

**사전 요구사항:** Node.js

1. **의존성 설치:**
   ```bash
   npm install
   ```

2. **환경변수 설정:**
   
   `.env.example` 파일을 `.env` 파일로 복사하고 YouTube API 키를 설정합니다.
   
   ```bash
   cp .env.example .env
   ```
   
   그런 다음 `.env` 파일을 열어 `VITE_YOUTUBE_API_KEY`에 본인의 YouTube API 키를 입력합니다:
   
   ```env
   VITE_YOUTUBE_API_KEY=your_actual_api_key_here
   ```
   
   **YouTube API 키 발급 방법:**
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에 접속
   - 프로젝트 생성 또는 선택
   - "사용자 인증 정보 만들기" > "API 키" 선택
   - YouTube Data API v3 활성화

3. **개발 서버 실행:**
   ```bash
   npm run dev
   ```

4. 브라우저에서 표시된 로컬 주소(보통 `http://localhost:5173`)로 접속합니다.

## 보안 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요. (`.gitignore`에 이미 추가됨)
- API 키는 외부에 노출되지 않도록 주의하세요.
- API 키는 Google Cloud Console에서 사용 제한을 설정하는 것이 좋습니다.

## 기술 스택

- **프레임워크:** React 19 + TypeScript
- **빌드 도구:** Vite
- **스타일링:** Tailwind CSS
- **아이콘:** Lucide React
- **API:** YouTube Data API v3

