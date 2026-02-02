# Channel MBTI

채널 엔지니어팀의 MBTI 통계 및 팀 매칭 웹 애플리케이션

## 🚀 배포 구조

### Vercel 무료 배포
```
channel-mbti.vercel.app/           → 메인 대시보드 (공개)
channel-mbti.vercel.app/admin      → 검색 & 매칭 (비밀번호 필요)
```

## 📁 폴더 구조

```
/
├── index.html              # 메인 대시보드 (누구나 접근)
├── admin/
│   ├── index.html          # 검색 & 매칭 페이지
│   ├── search.js           # 메인 진입점
│   ├── admin-styles.css    # Admin 전용 스타일
│   ├── modules/            # 비즈니스 로직 모듈
│   │   ├── matcher.js      # MBTI 매칭 알고리즘
│   │   ├── search.js       # 검색 로직
│   │   └── ui.js           # UI 렌더링
│   └── utils/              # 유틸리티 함수
│       ├── mbti-utils.js   # MBTI 관련 유틸
│       └── ui-utils.js     # UI 관련 유틸
├── shared/                 # 공통 모듈
│   ├── auth.js             # 인증 (비밀번호: devrel2026)
│   ├── config.js           # Supabase 설정
│   ├── constants.js        # 공통 상수
│   ├── supabase.js         # DB 연동
│   ├── stats-common.js     # 통계 로직
│   ├── common-styles.css   # 공통 스타일
│   └── dashboard-styles.css# 대시보드 스타일
├── vercel.json             # 배포 설정
└── supabase-schema.sql     # DB 스키마
```

## 🎯 주요 페이지

### 1. 메인 대시보드 (`/`)
- 누구나 접근 가능
- 전체/팀별 MBTI 분포
- Top 5 MBTI 순위
- 실시간 통계

### 2. 검색 & 매칭 (`/admin`)
- 🔐 비밀번호 필요 (`devrel2026`)
- 이름으로 프로필 검색
- MBTI 기반 3명 매칭 추천
  - 🤝 Bestie Match
  - ⚖️ Balancer
  - 🎲 Wild Card

## 🏗️ 아키텍처

### 모듈화 구조
- **modules/**: 핵심 비즈니스 로직 (Matcher, Search, UI)
- **utils/**: 재사용 가능한 유틸리티 함수
- **shared/**: 전체 앱에서 공유하는 코드

### 스타일 구조
- **common-styles.css**: 모든 페이지의 공통 스타일
- **dashboard-styles.css**: 대시보드 전용 스타일
- **admin-styles.css**: Admin 페이지 전용 스타일

### 설정 관리
- **constants.js**: 매직 넘버/스트링 제거, 중앙 집중식 상수 관리
- **config.js**: Supabase 및 환경 설정

## 🚀 로컬 개발

### 1. 서버 실행
```bash
python3 -m http.server 8080
```

### 2. 브라우저 접속
- 메인: `http://localhost:8080/`
- Admin: `http://localhost:8080/admin`

## 📦 Vercel 배포

### 1. GitHub 연결
```bash
git init
git add .
git commit -m "Refactored: modular architecture"
git remote add origin https://github.com/your-username/channel-mbti.git
git push -u origin main
```

### 2. Vercel 배포
1. https://vercel.com 접속
2. "New Project" → GitHub 레포 선택
3. Project Name 입력 (예: `channel-mbti`)
4. Deploy 클릭

## 🎨 디자인

Apple Liquid Glass 컨셉:
- 글래스모피즘 (frosted glass)
- 다층 그라데이션 배경
- 부드러운 애니메이션
- 반투명 카드 UI

## 📝 기술 스택

- **Frontend:** Vanilla JS (ES6 Modules)
- **CSS:** Tailwind CDN + Custom Styles (모듈화)
- **Charts:** Chart.js
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel
- **Auth:** SessionStorage + Password

## 🔧 주요 개선사항 (리팩토링)

### 코드 구조
- ✅ 600줄 search.js → 4개 모듈로 분리
- ✅ 유틸리티 함수 분리 (MBTI, UI)
- ✅ 비즈니스 로직과 UI 분리

### 스타일 관리
- ✅ 인라인 스타일 제거
- ✅ 공통 CSS 파일 추출
- ✅ 페이지별 스타일 분리

### 상수 관리
- ✅ 하드코딩된 값들을 constants.js로 이동
- ✅ 설정값 중앙화 (config.js)
- ✅ 매직 넘버/스트링 제거

### 가독성
- ✅ 명확한 함수명과 변수명
- ✅ JSDoc 타입 주석
- ✅ 일관된 네이밍 컨벤션

## 🔐 보안

현재 구조:
- Admin 페이지: 비밀번호 인증 (`devrel2026`)
- SessionStorage에 인증 정보 저장
- 인증 실패 시 메인 페이지로 리다이렉트

추후 개선 가능:
- 환경변수로 비밀번호 관리
- Vercel Password Protection
- IP 화이트리스트

## 📊 Supabase 테이블

### ch-eng-mbti
```sql
- Pk: SERIAL PRIMARY KEY
- name_eng: TEXT (영어 이름)
- name_kor: TEXT (한글 이름)
- team: TEXT (팀명: Frontend, Backend, AI, Mobile, FDE, ETC)
- mbti: TEXT (4글자 MBTI)
- welcome_url: TEXT (Notion URL)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## 📌 참고

- Vercel 무료 플랜으로 충분히 운영 가능
- 커스텀 도메인 연결도 무료 플랜에서 지원
- Supabase 무료 플랜: 500MB DB, 무제한 API 요청
- 모듈화된 구조로 유지보수 용이
