# 📍 기억의 좌표 (Memory Coordinates)

> 기억이 머문 자리를 지도 위에 기록하는 풀스택 웹 애플리케이션

------------------------------------------------------------------------

## 🧭 Overview

**기억의 좌표**는 사용자가 자신의 추억을 지도 위에 기록하고, 타임라인
형태로 관리할 수 있는 지도 기반 기록 플랫폼입니다.

-   📌 위치 기반 기억 기록
-   🗺 지도 클러스터링 지원
-   🗂 타임라인 뷰 제공
-   🔐 JWT 기반 인증 시스템
-   🧠 서버 기반 데이터 저장 (Prisma + SQLite)

------------------------------------------------------------------------

## 🏗 Architecture

Client (React + Vite) ↓ REST API (Express) ↓ Prisma ORM ↓ SQLite
Database

------------------------------------------------------------------------

## ⚙️ Tech Stack

### 🖥 Frontend

-   React 18
-   TypeScript
-   Vite
-   TailwindCSS
-   MapLibre GL
-   Sonner (Toast UI)

### 🛠 Backend

-   Node.js
-   Express
-   Prisma ORM
-   SQLite
-   JWT (Authentication)
-   bcrypt (Password Hashing)

------------------------------------------------------------------------

## 📦 Database Schema

### User

-   id (Int)
-   name (String)
-   email (String, unique)
-   password (String)
-   profileImage (String?)
-   bio (String?)
-   createdAt (DateTime)
-   updatedAt (DateTime)

### Memory

-   id (Int)
-   userId (Int)
-   title (String)
-   memo (String?)
-   date (DateTime)
-   tags (String?)
-   lat (Float?)
-   lng (Float?)
-   addressText (String?)
-   fullAddress (String?)
-   createdAt (DateTime)
-   updatedAt (DateTime)

------------------------------------------------------------------------

## 🚀 Features

### 🔐 Authentication

-   회원가입
-   로그인
-   JWT 기반 세션 유지
-   보호된 API 라우트

### 📍 Memory Management

-   기억 생성 / 수정 / 삭제
-   위치 좌표 저장
-   태그 저장
-   서버 DB 영구 저장

### 🗺 Map System

-   MapLibre GL 기반 지도
-   마커 렌더링
-   클러스터링 지원
-   마커 클릭 시 상세 모달 표시

### 👤 My Page

-   프로필 이미지 업로드
-   소개 작성
-   기억 통계 표시

------------------------------------------------------------------------

## 🛠 Local Development

### 1️⃣ Server

``` bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### 2️⃣ Client

``` bash
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔐 Environment Variables

### Server (.env)

    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-secret-key"

### Client (.env)

    VITE_API_BASE_URL=""

------------------------------------------------------------------------

## ScreenShot

- 회원가입/로그인
<img width="439" height="853" alt="image" src="https://github.com/user-attachments/assets/e7db52bd-1d42-4e24-8938-b1be1cfd8b2c" />
<img width="439" height="853" alt="image" src="https://github.com/user-attachments/assets/e7b5a0b3-fd50-448e-8a91-831c295ced6f" />

- 지도
<img width="395" height="853" alt="image" src="https://github.com/user-attachments/assets/a2b2484a-6d54-4269-851c-45093a901202" />
<img width="471" height="918" alt="image" src="https://github.com/user-attachments/assets/371d737e-b50e-4cc3-a74c-7cbda4e8a506" />

- 기억 추가 모달 창
<img width="471" height="916" alt="image" src="https://github.com/user-attachments/assets/977939cd-788e-48e4-bf48-7fae03969a8d" />
<img width="471" height="916" alt="image" src="https://github.com/user-attachments/assets/c3f34afb-2c92-4eae-8992-e553a7d9b850" />
<img width="940" height="1830" alt="image" src="https://github.com/user-attachments/assets/af22c359-aa45-4f10-a16a-5c6a818fc596" />

- 타임라인
<img width="394" height="853" alt="image" src="https://github.com/user-attachments/assets/0ac3ff0b-2cd1-4167-9332-ab68405fe43c" />
<img width="788" height="1704" alt="image" src="https://github.com/user-attachments/assets/c87b235d-fb97-4597-8fb5-8ad0ec470e0a" />
<img width="394" height="853" alt="image" src="https://github.com/user-attachments/assets/e35bce4f-11d5-4937-be52-032dba1cc82b" />

- 마이페이지
<img width="470" height="917" alt="image" src="https://github.com/user-attachments/assets/40ed8433-9aa2-475c-841d-92b8f2f66320" />
<img width="470" height="917" alt="image" src="https://github.com/user-attachments/assets/37af90f9-3093-4cea-8f53-b674786e331f" />




