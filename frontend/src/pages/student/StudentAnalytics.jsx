import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { BarChart3, TrendingUp, Award, Briefcase, FileCheck2, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import API from '../../api';

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/students/performance');
      setData(res.data);
    } catch (e) {
      setData({
        resume_score: 84,
        total_applications: 3,
        shortlisted_count: 2,
        tests_taken: 2,
        average_test_score: 82.5,
        test_performance_chart: [
          { test: 'Aptitude Test', score: 75, date: 'Sep 05' },
          { test: 'Python CBT', score: 85, date: 'Sep 12' },
          { test: 'React Screening', score: 88, date: 'Sep 15' }
        ],
        application_status_counts: {
          Applied: 1,
          'Under Review': 1,
          Shortlisted: 1,
          'Mock Test': 1,
          Selected: 0,
          Rejected: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto"><Sidebar /><main className="flex-1 p-8 text-center text-xs text-slate-500">Loading analytics...</main></div>
        <Footer />
      </div>
    );
  }

  const appStatusData = Object.entries(data.application_status_counts || {}).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h1 className="text-xl font-bold text-slate-900">Student Performance Analytics</h1>
            <p className="text-xs text-slate-500 mt-1">
              Visual analytics tracking test scores, application conversions, and skill metrics.
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="portal-card bg-white p-5 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Resume Score</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{data.resume_score}/100</div>
            </div>
            <div className="portal-card bg-white p-5 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Applications</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">{data.total_applications}</div>
            </div>
            <div className="portal-card bg-white p-5 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Shortlisted</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{data.shortlisted_count}</div>
            </div>
            <div className="portal-card bg-white p-5 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Avg Test Score</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{data.average_test_score}%</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Test Scores Progression
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.test_performance_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="test" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Application Status Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
