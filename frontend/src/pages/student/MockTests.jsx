import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { FileCheck2, Clock, CheckCircle2, Award, Play, Layers } from 'lucide-react';
import API from '../../api';

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await API.get('/mock-tests');
      setTests(res.data);
    } catch (e) {
      setTests([
        {
          id: 1,
          title: 'Python & Backend Assessment',
          role_category: 'Python Developer',
          duration_mins: 15,
          total_marks: 100,
          pass_percentage: 60,
          questions: Array.from({ length: 15 }, (_, i) => i + 1)
        },
        {
          id: 2,
          title: 'Frontend React & JS Screening',
          role_category: 'Frontend Developer',
          duration_mins: 15,
          total_marks: 100,
          pass_percentage: 60,
          questions: Array.from({ length: 15 }, (_, i) => i + 1)
        }
      ]);
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
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h1 className="text-xl font-bold text-slate-900">AI Computer-Based Mock Assessments</h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete assigned 3-tier mock tests (5 Basic, 5 Medium/Logical, 5 Advanced Industry level) to validate domain expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="portal-card bg-white p-6 border border-slate-200 rounded-xl space-y-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="badge-ai text-xs font-semibold">
                      Category: {test.role_category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                      3 Tier Division (Basic • Medium • Advanced)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{test.title}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Duration</span>
                    <span className="font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" /> {test.duration_mins} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Questions</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{test.questions?.length || 15} MCQs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Pass Threshold</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">{test.pass_percentage}%</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Test Question Breakdown:
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                    <span className="bg-cyan-100 text-cyan-800 py-0.5 px-1 rounded font-semibold text-[10px]">Q1-5: Basic</span>
                    <span className="bg-indigo-100 text-indigo-800 py-0.5 px-1 rounded font-semibold text-[10px]">Q6-10: Medium</span>
                    <span className="bg-purple-100 text-purple-800 py-0.5 px-1 rounded font-semibold text-[10px]">Q11-15: Advanced</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">Auto-evaluates upon submission</span>
                  <Link to={`/student/mock-test-exam/${test.id}`} className="btn-primary text-xs py-2 px-4">
                    <Play className="w-3.5 h-3.5" /> Start Test
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
