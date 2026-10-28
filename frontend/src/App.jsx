import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ResumeUpload from './pages/student/ResumeUpload';
import AIResumeAnalysis from './pages/student/AIResumeAnalysis';
import RecommendedInternships from './pages/student/RecommendedInternships';
import InternshipDetails from './pages/student/InternshipDetails';
import MyApplications from './pages/student/MyApplications';
import SkillGapAnalysis from './pages/student/SkillGapAnalysis';
import MockTests from './pages/student/MockTests';
import ExamInterface from './pages/student/ExamInterface';
import TestResults from './pages/student/TestResults';
import StudentAnalytics from './pages/student/StudentAnalytics';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import PostInternship from './pages/company/PostInternship';
import MyInternships from './pages/company/MyInternships';
import AIApplicantRanking from './pages/company/AIApplicantRanking';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CompanyVerification from './pages/admin/CompanyVerification';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Portal Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/resume-upload" element={<ResumeUpload />} />
          <Route path="/student/ai-analysis" element={<AIResumeAnalysis />} />
          <Route path="/student/internships" element={<RecommendedInternships />} />
          <Route path="/student/recommended" element={<RecommendedInternships />} />
          <Route path="/student/internships/:id" element={<InternshipDetails />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/skill-gap" element={<SkillGapAnalysis />} />
          <Route path="/student/mock-tests" element={<MockTests />} />
          <Route path="/student/mock-test-exam/:id" element={<ExamInterface />} />
          <Route path="/student/test-results/:id" element={<TestResults />} />
          <Route path="/student/performance" element={<StudentAnalytics />} />
          <Route path="/student/notifications" element={<MyApplications />} />

          {/* Company Portal Routes */}
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/post-internship" element={<PostInternship />} />
          <Route path="/company/internships" element={<MyInternships />} />
          <Route path="/company/applications" element={<AIApplicantRanking />} />
          <Route path="/company/applicant-ranking" element={<AIApplicantRanking />} />
          <Route path="/company/mock-tests" element={<MyInternships />} />
          <Route path="/company/analytics" element={<CompanyDashboard />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/companies" element={<CompanyVerification />} />
          <Route path="/admin/internships" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminDashboard />} />
          <Route path="/admin/mock-tests" element={<AdminDashboard />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
