import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Briefcase, Users, CheckCircle2, Sparkles, Plus, ArrowRight, Layers, Building2 } from 'lucide-react';
import API from '../../api';

export default function CompanyDashboard() {
  const { user, profile } = useContext(AuthContext);

  const [stats, setStats] = useState({
    activeInternships: 2,
    totalApplications: 3,
    shortlistedCount: 2,
    testsPending: 1,
    internships: [],
    recentApplicants: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const res = await API.get('/company/internships');
      setStats({
        activeInternships: res.data.length,
        totalApplications: 3,
        shortlistedCount: 2,
        testsPending: 1,
        internships: res.data,
        recentApplicants: [
          { id: 1, student_name: 'Rahul Sharma', title: 'Python Backend Developer Intern', match_score: 91.5, status: 'SHORTLISTED' },
          { id: 2, student_name: 'Ananya Patel', title: 'Data Analyst Intern', match_score: 94.0, status: 'SHORTLISTED' },
          { id: 3, student_name: 'Rahul Sharma', title: 'Frontend Developer Intern', match_score: 83.0, status: 'UNDER_REVIEW' }
        ]
      });
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-eligible text-[10px]">
                  ✓ {profile?.verification_status || 'VERIFIED'} COMPANY
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {profile?.company_name || 'TechNova Solutions'} Recruiter Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Campus Hiring & AI Candidate Ranking Dashboard</p>
            </div>

            <Link to="/company/post-internship" className="btn-primary text-xs py-2 px-4">
              <Plus className="w-4 h-4" /> Post New Internship
            </Link>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="portal-card bg-white p-5">
              <span className="text-xs font-semibold text-slate-500 uppercase">Active Postings</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.activeInternships}</div>
            </div>
            <div className="portal-card bg-white p-5">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Applicants</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{stats.totalApplications}</div>
            </div>
            <div className="portal-card bg-white p-5">
              <span className="text-xs font-semibold text-slate-500 uppercase">Shortlisted Candidates</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.shortlistedCount}</div>
            </div>
            <div className="portal-card bg-white p-5">
              <span className="text-xs font-semibold text-slate-500 uppercase">Mock Tests Pending</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{stats.testsPending}</div>
            </div>
          </div>

          {/* Recent Applicants with AI Ranking Action */}
          <div className="portal-card bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Recent Candidates & AI Applicant Ranking
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top candidate matches automatically computed by AI</p>
              </div>
              <Link to="/company/applicant-ranking" className="btn-secondary text-xs">
                View AI Leaderboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.recentApplicants.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{app.student_name}</h4>
                    <p className="text-[11px] text-slate-500">{app.title}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge-ai text-xs font-bold">
                      Match: {app.match_score}%
                    </span>
                    <span className="badge-eligible text-[10px]">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
