# CLAUDE.md — haru_FE/admin (dev/QA 대시보드)

이 디렉토리는 dev/QA 어드민 대시보드 전용 Next.js 프로젝트다. **`haru_FE/web/`(랜딩) 과 `haru_FE/src/`(Expo 앱) 모두와 격리**된 독립 워크스페이스이며, 자체 lockfile/tsconfig/node_modules 를 가진다.

## 목적

시드된 dev 계정(`auth.users.user_metadata.is_dev_seed=true`) 으로 매치 목록 확인, 채팅, 디스커버 스와이프를 BE 임퍼소네이션 경로(`X-Admin-Secret` + `X-Admin-Impersonate` 헤더) 로 수행. 출시 후 절대 실서비스 흐름에 끼면 안 됨 (사쿠라 리스크).

## 워크스페이스 격리 (중요)

| 항목 | haru_FE/ (Expo) | haru_FE/web/ (랜딩) | haru_FE/admin/ (이 디렉토리) |
| --- | --- | --- | --- |
| 번들러 | Metro | Turbopack/webpack | Turbopack/webpack |
| package.json | 별도 | 별도 | **별도** |
| node_modules | 별도 | 별도 | **별도** |
| tsconfig | 별도 | 별도 | **별도** (`extends` 금지) |

**금지:**
- web/ 또는 src/ 에서 admin/ 의 코드 import 금지 (반대도 마찬가지).
- 공유가 필요하면 admin/ 안에 type-only 복제 후 drift 검출 테스트 추가.

## BE 의존성

- 모든 BE 호출은 `NEXT_PUBLIC_API_URL` 환경변수의 주소로 감.
- BE 에 `ADMIN_DASHBOARD_ENABLED=true` + `ADMIN_SECRET` 설정 필수.
- BE `authMiddleware` 가 `X-Admin-Secret` + `X-Admin-Impersonate` 헤더 검증 후 `req.userId` 임퍼소네이션.
- 임퍼소네이션은 `user_metadata.is_dev_seed=true` 인 계정만 허용 (실유저 차단).

## 출시 시 비활성화 정책 (필수)

데이팅 앱 출시 시점 (앱스토어 심사 통과 직전 or 직후) 에 다음 조치 모두 수행:

1. **BE 측**: `ADMIN_DASHBOARD_ENABLED=false` 환경변수 설정 → admin 라우트 자체 부재.
2. **Web 측**: 본 Vercel 프로젝트 disable / delete 또는 production 빌드 차단.
3. **DB 측**: dev seed 계정 일괄 cleanup (`haru_BE/scripts/cleanup-dev-accounts.ts`).
4. **확인**: dashboard URL 접속 시 404 또는 BE 로그인 실패 확인.

위 4개 모두 통과해야 사쿠라 리스크 0.

## 스택

| 영역 | 선택 | 사유 |
| --- | --- | --- |
| 프레임워크 | Next.js 15 (App Router) | web/ 와 동일 버전 |
| React | 19.x | web/ 와 일치 |
| TypeScript | ~5.8 | web/ 와 일치 |
| 스타일 | Tailwind CSS v4 + 인라인 style | 빠른 dev 툴, 공유 컴포넌트 없음 |
| 폰트 | Pretendard fallback → system sans | 가독성 최우선, Galmuri11(픽셀)은 본문에 부적합 |
| 호스팅 | Vercel (별 도메인 안 사고 vercel.app 서브) | dev/QA 만 쓸 거라 충분 |

## 디렉토리 구조

```
haru_FE/admin/
├── app/
│   ├── layout.tsx          # <html> + <body>, globals.css import
│   ├── page.tsx            # 대시보드 (로그인 + Sidebar + Matches/Discover)
│   ├── api.ts              # BE API 헬퍼 + 타입
│   └── globals.css         # Tailwind import + color-scheme
├── next.config.ts          # 최소 (reactStrictMode 만)
├── postcss.config.mjs      # Tailwind v4
├── tsconfig.json           # web/ 와 동일 설정 (paths @/* )
├── package.json            # 자체 lockfile
├── .env.local.example      # NEXT_PUBLIC_API_URL
├── .gitignore
└── CLAUDE.md               # 이 파일
```

## 라우팅

`/` 한 페이지만. 로그인 안 됐으면 LoginScreen, 됐으면 Dashboard.
locale 분기 없음 (한국어 인라인).

## 환경변수

| 키 | 노출 | 용도 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | 클라이언트 | BE 주소. 없으면 `http://localhost:3000` 폴백 |

추가 시크릿 없음. ADMIN_SECRET 은 사용자가 직접 입력하고 sessionStorage 에 저장.

## 디자인 가드레일

- **중립 그레이 팔레트** 고정 (`page.tsx` 의 `C` 상수). 메인 앱(haru_FE/src) 의 warm rose 와 분리.
- 가독성 최우선: 본문 15px, 행간 1.55, 텍스트 `#111827` (gray-900).
- unread 뱃지만 red-600 (notification semantic). 그 외 모든 액센트는 그레이.

## 배포 (Vercel)

1. Vercel 새 프로젝트 생성 → GitHub repo 연결 → **Root Directory = `haru_FE/admin`** 지정.
2. Framework Preset = Next.js (자동 감지).
3. Environment Variables: `NEXT_PUBLIC_API_URL = <BE 호스팅 주소>` 추가.
4. Deploy.
5. 자동 부여된 `haru-admin-*.vercel.app` URL 로 접속.

## 금지 사항

1. 실유저 임퍼소네이션 (BE 의 `is_dev_seed` 게이트가 막아주지만 web 측에서도 확장 금지).
2. ADMIN_SECRET 또는 그 외 BE 시크릿을 코드/env 에 하드코딩.
3. 본 디렉토리에서 web/ 또는 src/ 의 코드 import.
4. 출시 후 본 대시보드를 실서비스 채팅 모니터링 용도로 전용 (별도 운영자 툴이 필요).
5. realtime 으로 실유저 메시지 엿보기 — RLS 우회 권한 갖고 있어도 정책상 금지.

## 변경 이력

| 날짜 | 변경 | 사유 |
| --- | --- | --- |
| 2026-05-13 | 초기 분리 (haru_FE/web/admin → haru_FE/admin) | 별 Vercel 프로젝트로 분리해 출시 시 통째로 disable 가능하게. monorepo 도구 미도입 |
