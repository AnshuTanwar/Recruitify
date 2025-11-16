import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';

// Static imports for critical pages
import Landing from './features/auth/Landing.jsx';
import Login from './features/auth/Login.jsx';
import Signup from './features/auth/Signup.jsx';
import ForgotPassword from './features/auth/ForgotPassword.jsx';
import ResetPassword from './features/auth/ResetPassword.jsx';
import OAuthSuccess from './features/auth/OAuthSuccess.jsx';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./features/candidate/pages/Dashboard.jsx'));
const CandidateJobs = React.lazy(() => import('./features/candidate/pages/CandidateJobs.jsx'));
const JobDetails = React.lazy(() => import('./features/candidate/pages/JobDetails.jsx'));
const ApplyNow = React.lazy(() => import('./features/candidate/pages/ApplyNow.jsx'));
const AppliedJobs = React.lazy(() => import('./features/candidate/pages/AppliedJobs.jsx'));
const AppliedJobDetails = React.lazy(() => import('./features/candidate/pages/AppliedJobDetails.jsx'));
const CandidateProfile = React.lazy(() => import('./features/candidate/pages/CandidateProfile.jsx'));
const Settings = React.lazy(() => import('./features/candidate/pages/Settings.jsx'));
const JobAlerts = React.lazy(() => import('./features/candidate/pages/JobAlerts.jsx'));
const Messages = React.lazy(() => import('./features/candidate/pages/Messages.jsx'));
const CandidateMessages = React.lazy(() => import('./features/candidate/pages/CandidateMessages.jsx'));
const ResumeAnalyzerPage = React.lazy(() => import('./features/candidate/pages/ResumeAnalyzerPage.jsx'));
const VoiceInterviewPage = React.lazy(() => import('./features/candidate/pages/VoiceInterviewPage.jsx'));
const Help = React.lazy(() => import('./features/candidate/pages/Help.jsx'));
const CompanyProfile = React.lazy(() => import('./features/candidate/pages/CompanyProfile.jsx'));

const RecruiterDashboard = React.lazy(() => import('./features/recruiter/pages/RecruiterDashboard.jsx'));
const RecruiterJobs = React.lazy(() => import('./features/recruiter/pages/RecruiterJobs.jsx'));
const PostJob = React.lazy(() => import('./features/recruiter/pages/PostJob.jsx'));
const ViewApplications = React.lazy(() => import('./features/recruiter/pages/ViewApplications.jsx'));
const ApplicationsManager = React.lazy(() => import('./features/recruiter/pages/ApplicationsManager.jsx'));
const EditJob = React.lazy(() => import('./features/recruiter/pages/EditJob.jsx'));
const RecruiterProfile = React.lazy(() => import('./features/recruiter/pages/RecruiterProfile.jsx'));
const RecruiterSettings = React.lazy(() => import('./features/recruiter/pages/RecruiterSettings.jsx'));
const RecruiterCandidates = React.lazy(() => import('./features/recruiter/pages/RecruiterCandidates.jsx'));
const RecruiterAnalytics = React.lazy(() => import('./features/recruiter/pages/RecruiterAnalytics.jsx'));
const RecruiterMessages = React.lazy(() => import('./features/recruiter/pages/RecruiterMessages.jsx'));
const RecruiterHelp = React.lazy(() => import('./features/recruiter/pages/RecruiterHelp.jsx'));
const TargetedJobSending = React.lazy(() => import('./features/recruiter/pages/TargetedJobSending.jsx'));

const AdminDashboard = React.lazy(() => import('./features/admin/pages/AdminDashboard.jsx'));
const AdminAnalytics = React.lazy(() => import('./features/admin/pages/AdminAnalytics.jsx'));
const AdminReports = React.lazy(() => import('./features/admin/pages/AdminReports.jsx'));
import NotFound from './components/common/NotFound.jsx';
import AnimatedBackground from './components/common/AnimatedBackground.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
            <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="relative min-h-screen overflow-hidden">
              <AnimatedBackground />
              <Header />
              <Landing />
              <Footer />
            </div>
          } />
          <Route path="/login" element={
            <div className="relative min-h-screen overflow-hidden">
              <AnimatedBackground />
              <Header />
              <Login />
              <Footer />
            </div>
          } />
          <Route path="/signup" element={
            <div className="relative min-h-screen overflow-hidden">
              <AnimatedBackground />
              <Header />
              <Signup />
              <Footer />
            </div>
          } />
          <Route path="/forgot-password" element={
            <div className="relative min-h-screen overflow-hidden">
              <AnimatedBackground />
              <Header />
              <ForgotPassword />
              <Footer />
            </div>
          } />
          <Route path="/reset-password/:userId/:token" element={
            <div className="relative min-h-screen overflow-hidden">
              <AnimatedBackground />
              <Header />
              <ResetPassword />
              <Footer />
            </div>
          } />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          
          {/* Dashboard Routes - Protected */}
          <Route path="/dashboard" element={<PrivateRoute requiredRole="candidate"><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard/jobs" element={<PrivateRoute requiredRole="candidate"><CandidateJobs /></PrivateRoute>} />
          <Route path="/dashboard/jobs/:id" element={<PrivateRoute requiredRole="candidate"><JobDetails /></PrivateRoute>} />
          <Route path="/dashboard/apply/:id" element={<PrivateRoute requiredRole="candidate"><ApplyNow /></PrivateRoute>} />
          <Route path="/dashboard/applied-jobs" element={<PrivateRoute requiredRole="candidate"><AppliedJobs /></PrivateRoute>} />
          <Route path="/dashboard/applied-jobs/:id" element={<PrivateRoute requiredRole="candidate"><AppliedJobDetails /></PrivateRoute>} />
          <Route path="/dashboard/messages" element={<PrivateRoute requiredRole="candidate"><CandidateMessages /></PrivateRoute>} />
          <Route path="/dashboard/resume-analyzer" element={<PrivateRoute requiredRole="candidate"><ResumeAnalyzerPage /></PrivateRoute>} />
          <Route path="/dashboard/ai-interview" element={<PrivateRoute requiredRole="candidate"><VoiceInterviewPage /></PrivateRoute>} />
          <Route path="/dashboard/profile" element={<PrivateRoute requiredRole="candidate"><CandidateProfile /></PrivateRoute>} />
          <Route path="/dashboard/job-alerts" element={<PrivateRoute requiredRole="candidate"><JobAlerts /></PrivateRoute>} />
          <Route path="/dashboard/help" element={<PrivateRoute requiredRole="candidate"><Help /></PrivateRoute>} />
          <Route path="/dashboard/settings" element={<PrivateRoute requiredRole="candidate"><Settings /></PrivateRoute>} />
          <Route path="/company/:companyId" element={<PrivateRoute><CompanyProfile /></PrivateRoute>} />
          
          {/* Recruiter Routes - Protected */}
          <Route path="/recruiter/dashboard" element={<PrivateRoute requiredRole="recruiter"><RecruiterDashboard /></PrivateRoute>} />
          <Route path="/recruiter/post-job" element={<PrivateRoute requiredRole="recruiter"><PostJob /></PrivateRoute>} />
          <Route path="/recruiter/jobs" element={<PrivateRoute requiredRole="recruiter"><RecruiterJobs /></PrivateRoute>} />
          <Route path="/recruiter/jobs/:jobId/applications" element={<PrivateRoute requiredRole="recruiter"><ApplicationsManager /></PrivateRoute>} />
          <Route path="/recruiter/jobs/:jobId/edit" element={<PrivateRoute requiredRole="recruiter"><EditJob /></PrivateRoute>} />
          <Route path="/recruiter/profile" element={<PrivateRoute requiredRole="recruiter"><RecruiterProfile /></PrivateRoute>} />
          <Route path="/recruiter/analytics" element={<PrivateRoute requiredRole="recruiter"><RecruiterAnalytics /></PrivateRoute>} />
          <Route path="/recruiter/messages" element={<PrivateRoute requiredRole="recruiter"><RecruiterMessages /></PrivateRoute>} />
          <Route path="/recruiter/help" element={<PrivateRoute requiredRole="recruiter"><RecruiterHelp /></PrivateRoute>} />
          <Route path="/recruiter/settings" element={<PrivateRoute requiredRole="recruiter"><RecruiterSettings /></PrivateRoute>} />
          <Route path="/recruiter/candidates" element={<PrivateRoute requiredRole="recruiter"><RecruiterCandidates /></PrivateRoute>} />
          <Route path="/recruiter/targeted-job-sending" element={<PrivateRoute requiredRole="recruiter"><TargetedJobSending /></PrivateRoute>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute requiredRole="admin"><AdminAnalytics /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute requiredRole="admin"><AdminReports /></PrivateRoute>} />
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </AnimatePresence>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
