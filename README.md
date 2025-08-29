# Recruitify - AI-Powered Job Portal

A modern, futuristic job portal application built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Landing Page**: Futuristic design with animated background, typewriter effects, and glassmorphism cards
- **Authentication**: Role-based signup and login system
- **Candidate Dashboard**: Complete dashboard with sidebar navigation, job management, and settings
- **Responsive Design**: Mobile-first approach with smooth animations
- **Professional Theme**: Consistent color scheme and typography throughout

## Demo Accounts

### Candidate Account
- **Email**: candidate@demo.com
- **Password**: Demo123!
- **Features**: Access to candidate dashboard with job applications, alerts, and settings

### Recruiter Account
- **Email**: recruiter@demo.com
- **Password**: Demo123!
- **Features**: Full recruiter dashboard with job posting, candidate management, and analytics

## Registration Flows

### Multi-Step Recruiter Registration
The platform includes a comprehensive 3-step registration process for recruiters:

1. **Company Information Step**:
   - Company name, address (street, city, state, postal code, country)
   - Company size and industry selection
   - Company website and description (minimum 50 characters)
   - Form validation with real-time error feedback

2. **Recruiter Information Step**:
   - Personal details (full name, job title)
   - Work email and phone number
   - Password creation with confirmation
   - Show/hide password functionality

3. **Email Verification Step**:
   - Account summary review
   - Email verification process simulation
   - Automatic redirect to recruiter dashboard after verification

### Features:
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Form Validation**: Real-time validation with smooth error animations
- **Responsive Design**: Works seamlessly on all device sizes
- **Smooth Animations**: Step transitions and micro-interactions
- **Data Persistence**: Form data maintained across steps

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - Use the demo accounts above to test functionality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedBackground.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── DashboardLayout.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Input.tsx
│   ├── Sidebar.tsx
│   └── TypewriterText.tsx
├── pages/              # Main application pages
│   ├── Dashboard.tsx
│   ├── AppliedJobs.tsx
│   ├── JobAlerts.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Settings.tsx
│   └── Signup.tsx
└── App.tsx            # Main application component
```

## Key Features

### Theme Consistency
- Gradient backgrounds matching landing page design
- Consistent color palette (teal, purple, sky blue)
- Professional typography and spacing
- Glassmorphism effects throughout

### Dashboard Features
- **Overview**: Statistics cards, profile completion alerts, recent applications
- **Applied Jobs**: Comprehensive job listing with status tracking
- **Job Alerts**: Job recommendations with apply functionality
- **Settings**: Profile management, resume uploads, account settings

### Recruiter Dashboard Features
- **Overview**: Job posting statistics, recent job performance, application tracking
- **Job Management**: Create, edit, delete, and manage job postings
- **Candidate Pipeline**: Track candidates through different hiring stages
- **Analytics**: Hiring metrics, time-to-hire, and source effectiveness
- **Post Job**: Comprehensive job posting form with all necessary fields

### Animations & Interactions
- Smooth page transitions with Framer Motion
- Hover effects on all interactive elements
- Loading states and micro-interactions
- Responsive design with mobile-first approach

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized animations (60fps)
- Lazy loading where appropriate
- Efficient component structure
- Mobile-optimized responsive design