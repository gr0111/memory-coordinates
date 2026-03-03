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
cd client
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

## 📄 License

This project is for educational and portfolio purposes.
