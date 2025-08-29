import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './shared/pages/Landing.jsx';
import Login from './shared/pages/Login.jsx';
import Signup from './shared/pages/Signup.jsx';
import AnimatedBackground from './shared/components/AnimatedBackground.jsx';
import Header from './shared/components/Header.jsx';
import Footer from './shared/components/Footer.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';

// Candidate Pages
import Dashboard from './candidate/pages/Dashboard.jsx';
import AppliedJobs from './candidate/pages/AppliedJobs.jsx';
import JobAlerts from './candidate/pages/JobAlerts.jsx';
import Settings from './candidate/pages/Settings.jsx';

// Recruiter Pages
import RecruiterDashboard from './recruiter/pages/RecruiterDashboard.jsx';
import RecruiterJobs from './recruiter/pages/RecruiterJobs.jsx';
import PostJob from './recruiter/pages/PostJob.jsx';

function AppContent() {
  const location = useLocation();
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/applied-jobs') ||
                         location.pathname.includes('/job-alerts') ||
                         location.pathname.includes('/settings') ||
                         location.pathname.includes('/recruiter/');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      {!isDashboardPage && <Header />}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Candidate Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/job-alerts" element={<JobAlerts />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/candidates" element={<div className="p-8 text-white">Candidates Page - Coming Soon</div>} />
          <Route path="/recruiter/interviews" element={<div className="p-8 text-white">Interviews Page - Coming Soon</div>} />
          <Route path="/recruiter/analytics" element={<div className="p-8 text-white">Analytics Page - Coming Soon</div>} />
          <Route path="/recruiter/messages" element={<div className="p-8 text-white">Messages Page - Coming Soon</div>} />
          <Route path="/recruiter/settings" element={<div className="p-8 text-white">Recruiter Settings Page - Coming Soon</div>} />
        </Routes>
      </AnimatePresence>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;


