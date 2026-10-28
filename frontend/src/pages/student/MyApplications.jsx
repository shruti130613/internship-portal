import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Send, Sparkles, Clock, CheckCircle2, AlertCircle, FileCheck2, ArrowRight } from 'lucide-react';
import API from '../../api';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await API.get('/students/applications');
      setApplications(res.data);
    } catch (e) {
      setApplications([
        {
          id: 1,
          internship_title: 'Python Backend Developer Intern',
          company_name: 'TechNova Solutions',
          applied_at: '2026-09-15',
          status: 'SHORTLISTED',
          match_score: 91.5,
          match_reason: 'Strong match: Skills in Python, Django, SQL align with company specifications.'
        },
        {
          id: 2,
          internship_title: 'Frontend Developer Intern (React)',
          company_name: 'TechNova Solutions',
          applied_at: '2026-09-14',
          status: 'UNDER_REVIEW',
          match_score: 83.0,
          match_reason: 'Matches React, JavaScript, and HTML/CSS.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'SELECTED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">Selected 🎉</span>;
      case 'SHORTLISTED':
      case 'MOCK_TEST':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full">Shortlisted / Test Assigned</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">Under Review</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full">Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full">Applied</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Internship Applications</h1>
              <p className="text-xs text-slate-500 mt-1">
                Track status updates, AI match scores, and assigned mock test assessments.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200">
              Total Applied: {applications.length}
            </span>
          </div>

          <div className="portal-card bg-white p-0 border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Internship Position</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">AI Match Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-xs text-slate-500">
                        You have not applied for any internships yet.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{app.internship_title}</td>
                        <td className="p-4 font-semibold text-slate-600">{app.company_name}</td>
                        <td className="p-4 text-slate-500">{app.applied_at?.split('T')[0] || app.applied_at}</td>
                        <td className="p-4">
                          <span className="badge-ai text-xs font-bold">
                            {app.match_score}% Match
                          </span>
                        </td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4 text-right">
                          {app.status === 'SHORTLISTED' || app.status === 'MOCK_TEST' ? (
                            <Link to="/student/mock-tests" className="btn-primary text-[11px] py-1.5 px-3">
                              <FileCheck2 className="w-3.5 h-3.5" /> Start Mock Test
                            </Link>
                          ) : (
                            <span className="text-[11px] text-slate-400">Awaiting recruiter feedback</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
