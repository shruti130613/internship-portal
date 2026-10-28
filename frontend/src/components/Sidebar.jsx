import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Sparkles, Briefcase, ThumbsUp,
  Send, Target, FileCheck, BarChart3, Bell, Settings, LogOut,
  Users, Building2, ShieldCheck, CheckSquare, Layers
} from 'lucide-react';

export default function Sidebar() {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/resume-upload', label: 'Resume', icon: FileText },
    { to: '/student/ai-analysis', label: 'AI Resume Analysis', icon: Sparkles, ai: true },
    { to: '/student/internships', label: 'Internships', icon: Briefcase },
    { to: '/student/recommended', label: 'Recommended', icon: ThumbsUp, ai: true },
    { to: '/student/applications', label: 'My Applications', icon: Send },
    { to: '/student/skill-gap', label: 'Skill Gap', icon: Target, ai: true },
    { to: '/student/mock-tests', label: 'Mock Tests', icon: FileCheck },
    { to: '/student/performance', label: 'Performance', icon: BarChart3 },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/company/profile', label: 'Company Profile', icon: Building2 },
    { to: '/company/post-internship', label: 'Post Internship', icon: Briefcase },
    { to: '/company/internships', label: 'My Internships', icon: Layers },
    { to: '/company/applications', label: 'Applications', icon: Send },
    { to: '/company/applicant-ranking', label: 'AI Applicant Ranking', icon: Sparkles, ai: true },
    { to: '/company/mock-tests', label: 'Mock Tests', icon: FileCheck },
    { to: '/company/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Students & Users', icon: Users },
    { to: '/admin/companies', label: 'Companies Verification', icon: Building2 },
    { to: '/admin/internships', label: 'Internships Approval', icon: Briefcase },
    { to: '/admin/applications', label: 'Applications Audit', icon: Send },
    { to: '/admin/mock-tests', label: 'Mock Test Bank', icon: FileCheck },
  ];

  const navLinks = role === 'STUDENT' ? studentLinks : role === 'COMPANY' ? companyLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {role} PORTAL
        </div>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </div>
                {link.ai && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded uppercase">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
