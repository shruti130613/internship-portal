import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Target, CheckCircle2, AlertCircle, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import API from '../../api';

export default function SkillGapAnalysis() {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      const res = await API.get('/students/skill-gap');
      setGapData(res.data);
    } catch (e) {
      setGapData({
        strong_skills: ['Python', 'Django', 'SQL', 'React', 'Git', 'JavaScript'],
        missing_required_skills: ['Docker', 'PostgreSQL'],
        missing_preferred_skills: ['AWS', 'Power BI'],
        total_missing_count: 3,
        recommended_plan: [
          { skill: 'Docker', resource: 'Learn Containerization & Dockerizing Django/React apps on Docker Docs / freeCodeCamp.' },
          { skill: 'AWS', resource: 'Study AWS EC2, S3 bucket storage & IAM basics.' },
          { skill: 'Power BI', resource: 'Build interactive data dashboards & DAX formulas.' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto"><Sidebar /><main className="flex-1 p-8 text-center text-xs text-slate-500">Loading skill gap data...</main></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <span className="badge-ai text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Skill Diagnostic Engine
            </span>
            <h1 className="text-xl font-bold text-slate-900">Skill Gap Analysis & Learning Roadmap</h1>
            <p className="text-xs text-slate-500 mt-1">
              Compare your current profile skills against target industry requirements to bridge skill gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strong Skills */}
            <div className="portal-card bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Strong Matched Skills ({gapData.strong_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(gapData.strong_skills || []).map((sk, idx) => (
                  <span key={idx} className="badge-eligible text-xs">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="portal-card bg-white p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Skill Gap (Missing Requirements) ({gapData.total_missing_count})
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(gapData.missing_required_skills || []).map((sk, idx) => (
                  <span key={idx} className="badge-ineligible text-xs">
                    • {sk} (Required)
                  </span>
                ))}
                {(gapData.missing_preferred_skills || []).map((sk, idx) => (
                  <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    • {sk} (Preferred)
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Recommended Learning Roadmap */}
          <div className="portal-card bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Recommended Learning Areas
            </h3>
            <p className="text-xs text-slate-500">
              Curated action steps to acquire missing competencies based on job market demands.
            </p>

            <div className="space-y-3 pt-2">
              {(gapData.recommended_plan || []).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.skill}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.resource}</p>
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
