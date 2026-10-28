import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import {
  Sparkles, CheckCircle2, UserCheck, FileText, Briefcase, ThumbsUp,
  Clock, ArrowRight, MapPin, Building2, Award, ChevronRight, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import API from '../../api';

export default function StudentDashboard() {
  const { user, profile } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profileCompletion: 85,
    resumeScore: 84,
    recommendedCount: 3,
    activeAppsCount: 2,
    recommendedList: [],
    applications: [],
    performanceChart: []
  });

  useEffect(() => {
    fetchDashboardInfo();
  }, []);

  const fetchDashboardInfo = async () => {
    try {
      const [recsRes, appsRes, perfRes] = await Promise.all([
        API.get('/students/recommendations'),
        API.get('/students/applications'),
        API.get('/students/performance')
      ]);

      setDashboardData({
        profileCompletion: profile?.profile_completion || 85,
        resumeScore: perfRes.data.resume_score || 84,
        recommendedCount: recsRes.data.length,
        activeAppsCount: appsRes.data.length,
        recommendedList: recsRes.data.slice(0, 3),
        applications: appsRes.data,
        performanceChart: perfRes.data.test_performance_chart || [
          { test: 'Python Q1', score: 75, date: 'Sep 10' },
          { test: 'Backend Screening', score: 85, date: 'Sep 14' }
        ]
      });
    } catch (err) {
      console.warn("Using fallback demo dashboard data");
      setDashboardData({
        profileCompletion: 85,
        resumeScore: 84,
        recommendedCount: 3,
        activeAppsCount: 2,
        recommendedList: [
          {
            id: 1,
            company_name: 'Infosys Limited',
            title: 'Software Engineering Intern (InStep Global Program)',
            location: 'Bengaluru / Pune',
            duration: '3 Months',
            required_skills: ['Python', 'Django', 'SQL', 'Git'],
            match_score: 91.5,
            min_cgpa: 7.5
          },
          {
            id: 2,
            company_name: 'Zomato',
            title: 'Frontend Engineering Intern (React / Web)',
            location: 'Gurugram / Remote',
            duration: '3 Months',
            required_skills: ['React', 'JavaScript', 'HTML', 'CSS'],
            match_score: 88.0,
            min_cgpa: 7.0
          },
          {
            id: 3,
            company_name: 'Cisco Systems India',
            title: 'Cloud Software & Network Engineer Intern',
            location: 'Bengaluru / Hybrid',
            duration: '6 Months',
            required_skills: ['Python', 'SQL', 'Pandas', 'Data Analysis'],
            match_score: 84.5,
            min_cgpa: 7.5
          }
        ],
        applications: [
          {
            id: 1,
            internship_title: 'Software Engineering Intern (InStep Global Program)',
            company_name: 'Infosys Limited',
            applied_at: '2026-09-15',
            status: 'SHORTLISTED',
            match_score: 91.5
          },
          {
            id: 2,
            internship_title: 'Frontend Engineering Intern (React / Web)',
            company_name: 'Zomato',
            applied_at: '2026-09-14',
            status: 'UNDER_REVIEW',
            match_score: 88.0
          }
        ],
        performanceChart: [
          { test: 'Aptitude Test', score: 72, date: 'Sep 05' },
          { test: 'Python CBT', score: 80, date: 'Sep 12' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (statusStr) => {
    switch (statusStr) {
      case 'APPLIED': return 1;
      case 'UNDER_REVIEW': return 2;
      case 'SHORTLISTED': return 3;
      case 'MOCK_TEST': return 4;
      case 'SELECTED': return 5;
      case 'REJECTED': return 0;
      default: return 1;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          {/* Top Greeting Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0] || 'Student'} 👋
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                College Placement & Internship AI Dashboard
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Link to="/student/recommended" className="btn-primary text-xs py-2 px-3">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommendations
              </Link>
              <Link to="/student/internships?view=all" className="btn-secondary text-xs py-2 px-3">
                <Briefcase className="w-3.5 h-3.5" />
                Browse All Internships
              </Link>
            </div>
          </div>

          {/* 4 Dashboard KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="portal-card bg-white p-5 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Profile Completion</span>
                <UserCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{dashboardData.profileCompletion}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${dashboardData.profileCompletion}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                {dashboardData.profileCompletion >= 80 ? 'Complete profile' : 'Update profile details'}
              </span>
            </div>

            <div className="portal-card bg-white p-5 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Resume Status</span>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{dashboardData.resumeScore}/100</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="badge-ai text-[10px]">
                  <Sparkles className="w-3 h-3" /> Analyzed
                </span>
                <span className="text-[11px] text-slate-500">Good score</span>
              </div>
            </div>

            <div className="portal-card bg-white p-5 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
                <ThumbsUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{dashboardData.recommendedCount}</div>
              <span className="text-[11px] text-indigo-600 font-medium mt-2 block">
                Matches your skill profile
              </span>
            </div>

            <div className="portal-card bg-white p-5 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Applications</span>
                <Briefcase className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{dashboardData.activeAppsCount}</div>
              <span className="text-[11px] text-slate-500 mt-2 block">
                1 application shortlisted
              </span>
            </div>

          </div>

          {/* Recommended Internships Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Recommended Internships
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top intelligent matches based on your skills & preferences</p>
              </div>
              <Link to="/student/recommended" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All ({dashboardData.recommendedCount}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.recommendedList.map((item) => (
                <div key={item.id} className="border border-slate-200 hover:border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.company_name[0]}
                      </div>
                      <span className="badge-ai text-xs font-bold">
                        Match: {item.match_score}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{item.company_name}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {(item.required_skills || []).slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Min CGPA: {item.min_cgpa}</span>
                    <Link to={`/student/internships/${item.id}`} className="btn-secondary text-xs px-3 py-1.5">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Status Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-700" />
                Application Progress Tracking
              </h3>
              <Link to="/student/applications" className="text-xs font-bold text-indigo-600 hover:underline">
                View All Applications
              </Link>
            </div>

            {dashboardData.applications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No applications submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.applications.map((app) => {
                  const stepIndex = getStatusStepIndex(app.status);
                  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Mock Test', 'Selected'];

                  return (
                    <div key={app.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{app.internship_title}</h4>
                          <p className="text-xs text-slate-500">{app.company_name} • Applied on {app.applied_at}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                          app.status === 'SHORTLISTED' || app.status === 'SELECTED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          Status: {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Step Progress Bar */}
                      <div className="grid grid-cols-5 gap-1 pt-2">
                        {steps.map((st, idx) => {
                          const isDone = idx + 1 <= stepIndex;
                          const isCurrent = idx + 1 === stepIndex;
                          return (
                            <div key={idx} className="text-center">
                              <div className={`h-2 rounded-full mb-1 transition-all ${
                                isDone ? 'bg-indigo-600' : 'bg-slate-200'
                              }`} />
                              <span className={`text-[10px] block truncate font-medium ${
                                isCurrent ? 'text-indigo-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Performance Chart Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Recent Mock Test Scores
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.performanceChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
