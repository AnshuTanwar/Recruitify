# 🧠 Recruitify

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![AWS S3](https://img.shields.io/badge/Storage-AWS%20S3-232F3E?logo=amazon-aws&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)

---

Recruitify is a modern web-based job portal built for efficiency and simplicity.  
It empowers **recruiters** to automate candidate screening and enables **candidates** to showcase their profiles with ease.  
Featuring intelligent resume parsing and skill-matched feeds, Recruitify helps reduce downtime and streamline job discovery for both recruiters and job seekers.

---

## 🚀 Features

- **Automatic Resume Parsing & ATS Sorting**  
  Candidates’ resumes are auto-parsed and ranked via advanced ATS algorithms, letting recruiters instantly focus on top profiles.

- **Skill-Based Feed Filtering**  
  Candidates see only jobs that match their skills — eliminating irrelevant listings and wasted time.

- **Secure Resume Storage**  
  Resumes are stored securely on AWS S3, accessible only to authorized recruiters and candidates.

- **Role-Based Dashboards**  
  Separate dashboards for recruiters and candidates, offering tailored experiences for both.

- **Google OAuth & JWT Authentication**  
  Secure login with Google OAuth, JWT-based session management, and password reset workflows.

- **Real-Time Application Status**  
  Live updates for both candidates and recruiters on application progress and next steps.

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | Passport.js (Google OAuth, JWT) |
| **Cloud & Storage** | AWS S3 |
| **Caching & Queue** | Redis (for ATS scoring and async tasks) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🔄 Core Architecture

- **Decoupled Frontend & Backend**  
  Independent repositories for flexibility, scalability, and CI/CD deployment.

- **Redis Queue System**  
  Handles ATS-related compute tasks asynchronously for performance and ranking accuracy.

- **RESTful API Design**  
  Endpoints grouped by `auth`, `candidate`, `recruiter`, `job`, and `application` with strict role-based access.

---

## 🧑‍💼 Candidate Experience

- Create an account, build a profile, and upload a PDF resume.  
- Get automatically matched with relevant jobs.  
- Track and manage job applications easily.

---

## 🏢 Recruiter Experience

- Post and manage jobs with skill requirements.  
- Instantly view applicants sorted by ATS score.  
- Filter, update application statuses, and download resumes directly.

---

## 🌐 Demo Links

- **Frontend:** [https://recruitify-pi.vercel.app](https://recruitify-pi.vercel.app)  
- **Backend:** See the link below.

---

## 📦 Backend Repository

Recruitify’s backend is maintained separately.  
👉 **[View the Recruitify Backend Repo](https://github.com/AnshuTanwar/Recruitify-Backend)**

---

## 🛠️ Local Setup

### Frontend Setup

```bash
# Clone the frontend
git clone https://github.com/AnshuTanwar/Recruitify.git

# Navigate to project
cd recruitify-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
````

### Backend Setup

Clone and configure the backend following the setup instructions in the
[Recruitify Backend README](https://github.com/AnshuTanwar/Recruitify-Backend).

---

## ⚙️ Environment Variables

Create a `.env` file in your **backend** directory and set the following:

```bash
PORT=
MONGO_URI=
CLIENT_URI=http://localhost:5174
JWT_SECRET=h
JWT_REFRESH_SECRET=S
GOOGLE_CLIENT_ID=com
GOOGLE_CLIENT_SECRET=GOk8HZlCFqp2pyt
MONGO_URI_TEST=mongodb+sr
EMAILJS_USER=acom
EMAILJS_PASSWORD=cv
AWS_REGION=us-
AWS_ACCESS_KEY_ID=O
AWS_SECRET_ACCESS_KEY=1cKOJ4tz/
S3_BUCKET=rec
S3_PUBLIC_URL=htmazonaws.com
MAX_RESUME_SIZE_BYTES=50

REDIS_HOST=red.com
REDIS_PORT=1558
REDIS_USERNAME=dault
REDIS_PASSWORD=
```

---

## 📚 API Reference

| Method | Endpoint                              | Description                             |
| ------ | ------------------------------------- | --------------------------------------- |
| `POST` | `/api/auth/signup`                    | Candidate/Recruiter registration        |
| `POST` | `/api/auth/login`                     | Email/Password sign-in                  |
| `GET`  | `/api/auth/google`                    | Google OAuth authentication             |
| `POST` | `/api/candidate/resumes`              | Upload candidate resume (PDF)           |
| `GET`  | `/api/candidate/feed`                 | Fetch skill-matched job feed            |
| `POST` | `/api/recruiter/job`                  | Create job post with skill requirements |
| `GET`  | `/api/recruiter/job/:id/applications` | View ATS-sorted applicants              |

*For detailed documentation, refer to the backend repository.*

---

## 📢 Status

Recruitify is **actively being developed** — new features and improvements roll out regularly.
💡 **Contributions, feedback, and suggestions are always welcome!**

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

⭐ **If you like Recruitify, consider giving it a star on GitHub!**
