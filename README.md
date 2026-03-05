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
<img width="1841" height="1706" alt="image" src="https://github.com/user-attachments/assets/38d060fc-37d3-4b57-bcc4-481a256cde50" />

- 지도
<img width="1829" height="1836" alt="image" src="https://github.com/user-attachments/assets/1e23ad9d-04aa-4e1e-8aff-b4e4765d2a3e" />

- 기억 추가 모달 창
<img width="2868" height="1832" alt="image" src="https://github.com/user-attachments/assets/e6804674-37f5-4b3d-88a5-4436b5a37bc0" />

- 타임라인
<img width="2716" height="1706" alt="image" src="https://github.com/user-attachments/assets/bc5d81ff-0e48-4328-8621-a4f64290a706" />

- 마이페이지
<img width="1904" height="1834" alt="image" src="https://github.com/user-attachments/assets/35179288-5ed4-4967-854d-9aae748e59bb" />





