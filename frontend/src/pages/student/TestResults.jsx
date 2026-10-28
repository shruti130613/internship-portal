import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Award, CheckCircle2, XCircle, AlertCircle, Sparkles, ArrowRight, BarChart3 } from 'lucide-react';

export default function TestResults() {
  const location = useLocation();
  const attempt = location.state?.attempt || {
    score: 4,
    total_questions: 5,
    percentage: 80.0,
    status: 'PASSED',
    topic_breakdown: { Python: 100.0, Django: 100.0, OOP: 100.0, 'REST API': 50.0 },
    ai_feedback: 'Outstanding performance (80.0%)! You demonstrated strong technical mastery in Python and Django.'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="badge-ai text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Evaluation Engine
              </span>
              <h1 className="text-xl font-bold text-slate-900">Mock Test Evaluation Scorecard</h1>
              <p className="text-xs text-slate-500 mt-1">Instant topic breakdown and candidate qualification verdict</p>
            </div>

            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              attempt.status === 'PASSED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-rose-50 text-rose-700 border-rose-300'
            }`}>
              Verdict: {attempt.status}
            </span>
          </div>

          {/* Overview KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="portal-card bg-white p-5 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Score Percentage</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">{attempt.percentage}%</div>
            </div>

            <div className="portal-card bg-white p-5 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Correct Answers</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{attempt.score}</div>
            </div>

            <div className="portal-card bg-white p-5 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Questions</span>
              <div className="text-3xl font-extrabold text-slate-800 mt-1">{attempt.total_questions || 5}</div>
            </div>

            <div className="portal-card bg-white p-5 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Result Status</span>
              <div className="text-xl font-extrabold text-slate-900 mt-2">{attempt.status}</div>
            </div>
          </div>

          {/* Topic-wise Breakdown */}
          <div className="portal-card bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Topic-Wise Performance Breakdown
            </h3>

            <div className="space-y-3">
              {Object.entries(attempt.topic_breakdown || {}).map(([topic, acc]) => (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{topic}</span>
                    <span>{acc}% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${acc >= 75 ? 'bg-emerald-600' : acc >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Feedback Report */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              AI Performance Feedback Report
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
              "{attempt.ai_feedback || attempt.feedback}"
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link to="/student/applications" className="btn-primary text-xs py-2 px-5">
              View Application Status <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
