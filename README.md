# 🧠 Recruitify

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![AWS  S3](https://img.shields.io/badge/Storage-AWS%20S3-232F3E?logo=amazon-aws&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)

---

Modern full‑stack recruitment platform that connects exceptional talent with outstanding opportunities.

- Frontend: React 18, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express 5, MongoDB, Redis, Socket.IO
- AI: Gemini‑powered resume analyzer, voice interview, smart chat assistance
- Cloud: AWS S3, Render (backend), Vercel (frontend)
- Extras: PWA support, Swagger API docs, real‑time chat, background jobs

---

## Overview

Recruitify is a full‑stack recruitment platform designed to make hiring faster and more intelligent for both candidates and recruiters.

- Candidates get an AI‑assisted experience with **resume analysis**, **skill‑based job feeds**, and a guided **AI voice interview**.
- Recruiters get **ATS‑style candidate ranking**, **real‑time chat**, and **AI‑generated interview assistance** to communicate and shortlist efficiently.
- Admins get high‑level **reports and analytics**.

The stack is modern, production‑ready and optimized for performance, observability, and future expansion.

---

## Key Features

### Candidate Experience

- **Rich Candidate Profile**
  - Upload multiple resumes (with upload limits).
  - Manage skills, experience, location, and bio.
- **Skill‑Based Job Feed**
  - Personalized job recommendations based on skills and profile.
  - Detailed job view and application tracking per job.
- **Job Applications & Status**
  - Apply directly to jobs from the dashboard.
  - See application status (applied, shortlisted, interview, hired, rejected).

### Recruiter Experience

- **Job Management**
  - Create, update, and delete job postings with rich metadata:
    - Title, company, location, salary, experience level, education, skills, description, benefits.
  - View all jobs with quick stats (applications, status).
- **Application Management**
  - See all applicants per job with ATS scores and resume snapshots.
  - Update application status and add recruiter notes.
  - Retrieve secure resume URLs from S3.

### Admin & Analytics

- **Reports**
  - Candidates can report recruiters; Admins review and take actions.
- **Admin Analytics**
  - High‑level overview of platform usage and activity trends.
  - Summary endpoints for recent actions, key metrics, and trends.

### AI Capabilities

- **AI Resume Analyzer**
  - Candidate route: `/api/candidate/resume/analyze`.
  - Uses Gemini + ATS logic to:
    - Parse resume content.
    - Score suitability vs job description.
    - Provide strengths, weaknesses, missing skills, and improvement suggestions.
- **AI Voice Interview**
  - Endpoints under `/api/interview`.
  - Frontend voice interview flow:
    - Start interview for a job title.
    - AI generates structured interview questions.
    - Candidate answers via voice (SpeechRecognition) or text.
    - Gemini analyzes each answer: score, strengths, weaknesses, comments.
    - Final evaluation across technical fit, communication, confidence, and recommendation.
- **AI Chat Assistance**
  - Recruiter‑side: get AI‑generated question suggestions per application.
  - Candidate‑side: smart reply suggestions for chat messages.

### Real‑Time Chat

- **Candidate–Recruiter Chat Rooms**
  - Socket.IO‑powered real‑time messaging.
  - Rooms tied to a specific job, recruiter, and candidate.
- **Seen Status & Message History**
  - Mark messages as seen, fetch messages, close chat rooms.
- **Clean Data Model**
  - `ChatRoom` and `ChatMessage` models with indexes for efficient queries.

---

## Architecture

High‑level architecture:

- **Frontend (Recruitify)**
  - React 18 + Vite, Tailwind CSS.
  - React Router 7 with role‑based protected routes.
  - Global auth context with JWT access tokens and refresh token cookies.
  - PWA with offline‑ready shell and installable app.

- **Backend (Recruitify‑Backend)**
  - Express 5 API with modular routes:
    - `/api/auth`, `/api/candidate`, `/api/recruiter`, `/api/admin`, `/api/chat`, `/api/interview`, `/api/candidate/resume`.
  - MongoDB via Mongoose (User discriminators for `Candidate`, `Recruiter`, `Admin`).
  - Redis for caching & background jobs (ATS scoring via Bull/BullMQ).
  - AWS S3 for resume storage.
  - Swagger UI served on `/api-docs`.

- **Security**
  - JWT access tokens in `Authorization: Bearer ...`.
  - Refresh tokens in HTTP‑only cookies.
  - Role‑based access control middleware (`Candidate`, `Recruiter`, `Admin`).
  - CORS configured for local dev and deployed frontend.

---

## Tech Stack

**Frontend**

- React 18, Vite
- Tailwind CSS
- React Router 7
- Framer Motion
- lucide‑react
- Socket.IO Client
- PWA via `vite-plugin-pwa`

**Backend**

- Node.js, Express 5
- MongoDB, Mongoose 8
- Redis, Bull/BullMQ
- Socket.IO
- Passport (Google OAuth)
- JWT authentication
- AWS S3 SDK
- Swagger UI + YAML OpenAPI spec
- Gemini integration (for AI features)

**Deployment**

- Frontend: Vercel
- Backend: Render
- Assets: AWS S3

---

## Live Demo & API Docs

- Frontend: `https://recruitify-pi.vercel.app`
- Backend: `https://recruitify-backend-f2zw.onrender.com`
- API Docs (Swagger UI): `https://recruitify-backend-f2zw.onrender.com/api-docs`
  (also linked in the frontend footer as “API Docs”)

---

## Project Structure

This repository (`Recruitify`) holds the **frontend**. The backend lives in a separate repo.

```text
Recruitify-Final Year/
├─ Recruitify/                 # Frontend (this repo)
│  ├─ src/
│  │  ├─ App.jsx               # Routing, layouts
│  │  ├─ services/apiService.js
│  │  ├─ features/
│  │  │  ├─ auth/
│  │  │  ├─ candidate/         # dashboards, voice interview, resume analyzer
│  │  │  └─ recruiter/
│  │  ├─ components/
│  │  │  ├─ layout/Header.jsx
│  │  │  ├─ layout/Footer.jsx
│  │  │  └─ common/AnimatedBackground.jsx
│  ├─ public/
│  │  ├─ pwa-192x192.png
│  │  ├─ pwa-512x512.png
│  │  └─ pwa-maskable-512x512.png
│  ├─ vite.config.js
│  ├─ index.html
│  └─ package.json
└─ Recruitify-Backend/         # Backend API (separate repo)
```

Backend repository:
[`https://github.com/AnshuTanwar/Recruitify-Backend`](https://github.com/AnshuTanwar/Recruitify-Backend)

---

## Getting Started

### 1. Clone Repositories

```bash
# Frontend
git clone https://github.com/AnshuTanwar/Recruitify
cd Recruitify

# Backend (in a separate folder)
git clone https://github.com/AnshuTanwar/Recruitify-Backend
cd Recruitify-Backend
```

### 2. Backend Setup

1. Install dependencies:

   ```bash
   cd Recruitify-Backend
   npm install
   ```

2. Create `.env` in `Recruitify-Backend` (see [Environment Variables](#environment-variables)).

3. Start backend locally:

   ```bash
   npm run production     # or: npm start (with nodemon)
   ```

   Backend defaults to `http://localhost:5050`.

### 3. Frontend Setup

1. Install dependencies:

   ```bash
   cd Recruitify
   npm install
   ```

2. Configure API base URL in `src/services/apiService.js` if needed  
   (e.g. point to local `http://localhost:5050` or deployed Render URL).

3. Run development server:

   ```bash
   npm run dev
   ```

4. Open the app at `http://localhost:5173`.

---

## Environment Variables

Environment variables are primarily for the backend.  
In `Recruitify-Backend/.env`:

```bash
# Server
PORT=5050
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Client
CLIENT_ORIGINS=http://localhost:5173,yourclienturl

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASSWORD=...

# AWS S3
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com

# Redis
REDIS_HOST=...
REDIS_PORT=...
REDIS_USERNAME=...
REDIS_PASSWORD=...

# Gemini / AI
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=your_model_name

# Seed Admin
ADMIN_NAME=demo
ADMIN_EMAIL=demo@email.com
ADMIN_PASSWORD=Admin@123

# Environment variables for frontend in Recruitify/.env :
VITE_SOCKET_URL=your-backend-url
VITE_API_URL=your-backend-url
```

---

## PWA Support

The frontend is configured as a Progressive Web App:

- Uses `vite-plugin-pwa`.
- Manifest and icons defined in [vite.config.js](cci:7://file:///Users/aanshutanwar/Developer/Recruitify-Final%20Year/Recruitify/vite.config.js:0:0-0:0) and [/public](cci:7://file:///Users/aanshutanwar/Developer/Recruitify-Final%20Year/Recruitify/public:0:0-0:0).
- The app can be:
  - Installed on desktop and mobile.
  - Launched in standalone mode.
- Workbox configuration:
  - Caches static assets.
  - Uses a network‑first strategy for backend API calls.

To test locally:

```bash
npm run build
npm run preview
# open the preview URL, then check Application > Manifest in DevTools
```

---

## Swagger / API Documentation

Backend serves Swagger UI at:

- `/api-docs` (e.g. `https://recruitify-backend-f2zw.onrender.com/api-docs`)

The OpenAPI spec ([openapi.yaml](cci:7://file:///Users/aanshutanwar/Developer/Recruitify-Final%20Year/Recruitify-Backend/openapi.yaml:0:0-0:0)) documents:

- Authentication endpoints (`/api/auth/*`)
- Candidate APIs (`/api/candidate/*`)
- Recruiter APIs (`/api/recruiter/*`)
- Admin APIs (`/api/admin/*`)
- Chat and AI endpoints (`/api/chat/*`)
- AI resume analyzer and interview (`/api/candidate/resume/analyze`, `/api/interview/*`)
- Test/internal routes (tagged as `Internal`)

---

## Development Notes

- **Role‑based routing** on the frontend ensures candidates, recruiters, and admins see only their own dashboards.
- **Auth flow**:
  - Access tokens in memory + `Authorization` header.
  - Refresh tokens in HTTP‑only cookies for better security.
- **Background jobs**:
  - ATS scoring runs asynchronously using Redis/Bull, preventing long request times.
- **AI responses**:
  - Gemini responses are parsed server‑side (including Markdown code fence handling) before sending structured JSON to the frontend.

---

## License

This project includes a `LICENSE` file in the repository root.  
Please refer to that file for the exact license terms.




