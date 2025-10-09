# Recruitify

Recruitify is a modern web-based job portal built for efficiency and simplicity. It empowers recruiters to automate candidate screening and enables candidates to showcase their profiles with ease. Featuring intelligent resume parsing and skill-matched feeds, Recruitify helps reduce downtime and streamlines job discovery for both recruiters and job seekers.

## 🚀 Features

- **Automatic Resume Parsing & ATS Sorting**  
  Candidates' resumes are auto-parsed and sorted based on advanced ATS (Applicant Tracking System) algorithms, letting recruiters focus on the best-fit profiles instantly.

- **Skill-Based Feed Filtering**  
  Candidates only see jobs that precisely match the skills they possess, eliminating irrelevant listings and doom scrolling.

- **Secure Resume Storage**  
  Candidates can upload and manage PDFs of their resumes securely. Recruiters can fetch resumes for screening and download as needed.

- **Role-Based Dashboards**  
  Separate dashboards for recruiters and candidates, ensuring specialized workflows and seamless experiences.

- **Google OAuth & JWT Authentication**  
  Secure sign-in options with Google OAuth, refresh tokens for session management, and robust password reset flows.

- **Real-Time Application Status**  
  Both candidates and recruiters get live updates on application statuses, feedback, and onboarding next steps.

## 🗂️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** Passport.js (Google OAuth, JWT)
- **Cloud & Storage:** AWS S3 (for resume PDFs)
- **Caching & Queue:** Redis (ATS scoring tasks)
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🔄 Core Architecture

- **Decoupled Frontend & Backend**  
  The frontend (React) and backend (Node/Express) are developed and deployed in separate repositories for flexibility and scalability.

- **Redis Queue**  
  ATS-related compute tasks are processed asynchronously through Redis for fast sorting and ranking.

- **RESTful API Design**  
  Organized endpoints for `auth`, `candidate`, `recruiter`, `job`, and `application` with granular role-based access.

## 📝 Candidate Experience

- Sign up, create profile, and upload resume (PDF).
- Auto-matching with skill-relevant jobs—no irrelevant postings.
- Track applications, update status, and communicate securely.

## 💼 Recruiter Experience

- Create and manage job posts with skill requirements.
- Instantly view and sort applicants by ATS score (from parsed resumes).
- Filter, update application statuses, and download resumes.

## 🌐 Demo Links

- **Frontend:** [https://recruitify-pi.vercel.app](https://recruitify-pi.vercel.app)
- **Backend:** See link below.

## 📦 Backend Repository

Recruitify’s backend is maintained as a separate repository.
**[👉 View the Recruitify Backend Repo](https://github.com/AnshuTanwar/Recruitify-Backend)**

## 🛠️ Local Setup

### Setup Instructions

```bash
# Clone the frontend
git clone https://github.com/AnshuTanwar/Recruitify

# Install dependencies
cd recruitify-frontend
npm install

# Start development server
npm run dev


**Backend Setup:**  
Clone and configure the backend as per instructions in [the main backend README](https://github.com/AnshuTanwar/Recruitify-Backend).


## 📚 API Reference

- `POST /api/auth/signup` — Candidate/Recruiter Registration
- `POST /api/auth/login` — Email/Password Sign-In
- `GET /api/auth/google` — Google OAuth
- `POST /api/candidate/resumes` — Resume upload (PDF)
- `GET /api/candidate/feed` — Skill-matched job feed
- `POST /api/recruiter/job` — Create job post with required skills
- `GET /api/recruiter/job/:id/applications` — ATS-sorted applicant view

_For complete API routes and usage, check the backend repo documentation._

## 📢 Status

Recruitify is actively being developed. New features and improvements roll out regularly—  
**Contributions, feedback, and suggestions are welcome!**

---
