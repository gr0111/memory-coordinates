# 📍 기억의 좌표 (Memory Coordinates)

> 지도 위에 나의 기억을 남기고,  
> 시간의 흐름에 따라 다시 꺼내볼 수 있는 감성 기록 서비스

---

## ✨ 프로젝트 소개

**기억의 좌표**는 사용자가 특정 장소에 자신의 기억을 기록하고,  
지도(Map)와 타임라인(Timeline) 두 가지 뷰로 다시 꺼내볼 수 있는 웹 애플리케이션입니다.

- 지도 위에서 기억을 생성·탐색
- 태그로 기억을 분류하고 색상으로 구분
- 클러스터링으로 많은 기억도 한눈에 보기
- 타임라인으로 시간 순서대로 되짚어 보기
- 계정별 로그인/프로필/기억 통계 제공  
- 백엔드 서버 + DB에 영구 저장 (LocalStorage 사용 X)

---

## 🛠 Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI + shadcn/ui 기반 컴포넌트
- lucide-react (아이콘)
- react-hook-form
- sonner (toast)

### Backend (별도 서버)

- Node.js
- Express
- Prisma
- SQLite (dev.db, 개발용)
- JWT 기반 인증 미들웨어

---

## 🧱 주요 기능

### 1. 지도(Map) 뷰

- 화면 전체를 사용하는 커스텀 지도 뷰
- 더블 클릭으로 해당 위치에 새 기억 생성
- 마커/클러스터를 클릭해서 기억 상세 보기
- 현재 위치로 이동 기능 (Geolocation API)
- 줌 인/아웃, 서울 초기 위치로 리셋

### 2. 클러스터링

- 줌 레벨에 따라 클러스터링 동작
  - 줌이 크면 개별 마커
  - 줌을 줄이면 가까운 기억들이 하나의 클러스터로 묶임
- Haversine 거리 계산으로 지도 상 거리 기반 클러스터링
- 클러스터 클릭 시 주변 기억들을 원형으로 펼쳐서 보여주는 UI

### 3. 타임라인(Timeline) 뷰

- 시간 순서대로 기억 카드 목록을 보여주는 타임라인
- 날짜, 제목, 태그, 위치 등의 정보 표시
- 타임라인에서 기억 선택 → 지도/상세 뷰와 연동
- 기억 수정 / 삭제

### 4. 기억 상세 / 폼

- **MemoryFormSheet**
  - 제목 / 설명 / 날짜 / 태그 / 사진 업로드 / 위치 정보 입력
  - 지도에서 더블 클릭 시 좌표 자동 입력
- **MemoryDetailSheet**
  - 저장된 기억 상세 정보 표시
  - 태그/날짜/사진/주소/간단 위치 등
  - 편집 / 삭제 / 태그 기반 필터링 트리거

### 5. 인증 및 마이페이지

- 이메일 + 비밀번호 기반 로그인/회원가입
- JWT를 사용한 서버 인증 토큰
- 로그인 상태 유지
- **MyPage**
  - 사용자 이름 / 프로필 이미지 / 한 줄 소개 수정
  - 내 기억 통계 표시 (총 기억 개수, 태그 종류 수, 첫 기억 날짜 등)

---

## 🧠 데이터 모델

프론트에서 사용하는 `Memory` 타입은 다음과 같습니다.

```ts
export type Memory = {
  id: string;
  title: string;
  description?: string;
  date: string;         // ISO 문자열
  tags: string[];
  lat: number;
  lng: number;
  address?: string;     // 사람이 읽을 수 있는 주소
  placeName?: string;   // 장소명 (예: 한성대학교)
  shortLocation?: string; // 간단 위치 (예: 서울 성북구)
  photo?: string;       // base64 인코딩 이미지
  createdAt: string;
};
```
태그 옵션은 다음과 같이 미리 정의되어 있습니다.
```ts
export const TAG_OPTIONS = [
  { value: "work",   label: "일",   icon: "Briefcase" },
  { value: "love",   label: "연애", icon: "Heart" },
  { value: "school", label: "학교", icon: "GraduationCap" },
  { value: "cafe",   label: "카페", icon: "Coffee" },
  { value: "travel", label: "여행", icon: "Plane" },
  { value: "friend", label: "친구", icon: "Users" },
  { value: "family", label: "가족", icon: "Home" },
  { value: "food",   label: "맛집", icon: "UtensilsCrossed" },
] as const;
```
백엔드는 Prisma 스키마 기반으로, users, memories 테이블 및 관련 필드를 가진 구조로 구현되어 있습니다. (개발용 DB는 dev.db)

---

## 🌐 아키텍처
```
[Browser]
  React + Vite + TS
        │
        │ HTTP (REST, JSON, JWT)
        ▼
[Backend Server]
  Node.js + Express
  /auth, /memories, ...
        │
        ▼
[Database]
  Prisma + SQLite (dev.db)
```
- 프론트엔드는 /auth/*, /memories/* 엔드포인트로 REST API 호출
- 서버는 JWT 토큰을 검증하고, Prisma를 통해 DB CRUD 수행

---

## 🔑 주요 API (요약)

> 실제 구현은 auth.routes.ts, auth.controller.ts,
> memory.routes.ts, memory.controller.ts 등에서 확인 가능

### Auth
- POST /auth/register
  - Body: { name, email, password }
  - Response: { user, token }
- POST /auth/login
  - Body: { email, password }
  - Response: { user, token }
- GET /auth/me
  - Header: Authorization: Bearer <token>
  - Response: { user }
### Memories
- GET /memories
  - Header: Authorization: Bearer <token>
  - Response: { memories: Memory[] }
- POST /memories
  - Body: Memory 생성에 필요한 필드 (title, date, tags, lat, lng, etc.)
- PUT /memories/:id
  - Body: 수정할 필드
  - DELETE /memories/:id

---

## 🗺 클러스터링 로직
src/utils/clustering.ts 에서 클러스터링을 수행합니다.
- Haversine formula로 두 좌표 간 거리(km) 계산
- 줌 레벨에 따라 threshold(km)를 다르게 적용
```ts
// 줌 레벨에 따른 클러스터 거리 임계값 (km)
function getClusterThreshold(zoom: number): number {
  if (zoom >= 15) return 0;   // 줌이 크면 클러스터링 안 함
  if (zoom >= 13) return 0.5; // 500m
  if (zoom >= 11) return 2;   // 2km
  if (zoom >= 9) return 5;    // 5km
  return 10;                  // 10km
}
```
클러스터는 아래와 같은 타입으로 표현됩니다.
```ts
export type Cluster = {
  id: string;
  lat: number;
  lng: number;
  memories: Memory[];
  isCluster: boolean;
};
```

---

## 📦 설치 및 실행
### 1. 프론트엔드
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
기본 개발 서버 주소는 Vite 설정에 따릅니다. (예: http://localhost:5173)

### 2. 백엔드 (별도 서버)

백엔드 코드는 별도 server 디렉터리(또는 별도 레포)에서 관리합니다.
```bash
cd server

# 의존성 설치
npm install

# Prisma 마이그레이션 (필요 시)
npx prisma migrate dev

# 개발 서버 실행 (예: http://localhost:4000)
npm run dev
```
프론트에서 API를 호출하기 위해 .env 또는 Vite 설정에서 API base URL/프록시를 맞춰야 합니다.

---

## 🧭 개발 메모
- 지도는 OpenStreetMap 타일 이미지를 활용한 커스텀 구현
- 마커/클러스터 위치는 lat/lng → 화면 좌표로 직접 계산
- 마커 드래그가 아닌 지도 패닝 기반 UX
- 폼/ 시트/ 토스트 등은 shadcn 스타일 UI 컴포넌트 + Tailwind로 구성

---

## 📄 License
BSD
