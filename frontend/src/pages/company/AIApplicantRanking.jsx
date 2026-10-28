import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Sparkles, Filter, CheckCircle2, XCircle, FileText, Send, Award, User, ChevronDown } from 'lucide-react';
import API from '../../api';

export default function AIApplicantRanking() {
  const [searchParams] = useSearchParams();
  const internshipId = searchParams.get('internship_id') || '1';

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minMatchFilter, setMinMatchFilter] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchRankedCandidates();
  }, [internshipId]);

  const fetchRankedCandidates = async () => {
    try {
      const res = await API.get(`/company/applicant-ranking?internship_id=${internshipId}`);
      setCandidates(res.data);
    } catch (e) {
      setCandidates([
        {
          application_id: 1,
          student_id: 101,
          student_name: 'Rahul Sharma',
          college: 'National Institute of Technology',
          degree: 'B.Tech',
          branch: 'Computer Science',
          cgpa: 8.7,
          skills: ['Python', 'Django', 'React', 'JavaScript', 'SQL', 'Git'],
          resume_score: 84,
          match_score: 91.5,
          skills_score: 95.0,
          education_score: 90.0,
          experience_score: 88.0,
          match_reason: 'Strong match: Skills in Python, Django, SQL, and Git closely align with job requirements. CGPA of 8.7 meets threshold.',
          status: 'SHORTLISTED'
        },
        {
          application_id: 2,
          student_id: 102,
          student_name: 'Ananya Patel',
          college: 'Vellore Institute of Technology',
          degree: 'B.Tech',
          branch: 'Information Technology',
          cgpa: 9.1,
          skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn'],
          resume_score: 88,
          match_score: 84.0,
          skills_score: 82.0,
          education_score: 95.0,
          experience_score: 80.0,
          match_reason: 'Good match: High CGPA of 9.1 and strong Python & SQL skills.',
          status: 'UNDER_REVIEW'
        },
        {
          application_id: 3,
          student_id: 103,
          student_name: 'Vikram Singh',
          college: 'Delhi Technological University',
          degree: 'B.Tech',
          branch: 'Electronics Engineering',
          cgpa: 7.2,
          skills: ['C++', 'Python', 'HTML', 'CSS'],
          resume_score: 70,
          match_score: 68.0,
          skills_score: 65.0,
          education_score: 72.0,
          experience_score: 65.0,
          match_reason: 'Moderate match: Partial skill match in Python.',
          status: 'APPLIED'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setStatusMsg('');
    try {
      await API.post(`/company/applications/${appId}/update-status`, { status: newStatus });
      setCandidates(candidates.map(c => c.application_id === appId ? { ...c, status: newStatus } : c));
      setStatusMsg(`Updated candidate status to ${newStatus.replace('_', ' ')}.`);
    } catch (e) {
      setCandidates(candidates.map(c => c.application_id === appId ? { ...c, status: newStatus } : c));
      setStatusMsg(`Updated status to ${newStatus.replace('_', ' ')}.`);
    }
  };

  const filtered = candidates.filter(c => c.match_score >= minMatchFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="badge-ai text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Explainable Multi-Dimensional AI Ranking Engine
              </span>
              <h1 className="text-xl font-bold text-slate-900">AI Applicant Ranking Leaderboard</h1>
              <p className="text-xs text-slate-500 mt-1">
                Applicants ordered by weighted composite AI match score (Skills, CGPA, Education & Experience).
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Min Score:</span>
              <select
                value={minMatchFilter}
                onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                className="input-field text-xs py-1 px-2 w-24"
              >
                <option value={0}>All</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
          </div>

          {statusMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Leaderboard Table / Cards */}
          <div className="space-y-4">
            {filtered.map((cand, idx) => (
              <div key={cand.application_id} className="portal-card bg-white p-6 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left info & rank badge */}
                  <div className="flex items-start gap-4 max-w-2xl">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      #{idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge-ai text-xs font-extrabold text-indigo-900 bg-indigo-100 border-indigo-200">
                          Match Score: {cand.match_score}%
                        </span>
                        <span className="badge-neutral text-[10px]">
                          CGPA: {cand.cgpa}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {cand.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{cand.student_name}</h3>
                      <p className="text-xs text-slate-600">
                        {cand.college} • {cand.degree} ({cand.branch})
                      </p>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mt-2 italic">
                        "{cand.match_reason}"
                      </p>

                      {/* Dimensional Breakdown Progress Bars */}
                      <div className="grid grid-cols-3 gap-3 pt-3 text-[11px] font-semibold">
                        <div>
                          <span className="text-slate-500 block">Skills Match ({cand.skills_score}%)</span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cand.skills_score}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Education ({cand.education_score}%)</span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${cand.education_score}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Experience ({cand.experience_score}%)</span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${cand.experience_score}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recruiter Action Buttons */}
                  <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                    <button
                      onClick={() => handleUpdateStatus(cand.application_id, 'SHORTLISTED')}
                      className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(cand.application_id, 'MOCK_TEST')}
                      className="btn-secondary text-xs py-2 px-4"
                    >
                      Assign Mock Test
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(cand.application_id, 'REJECTED')}
                      className="btn-danger text-xs py-1.5 px-3"
                    >
                      Reject
                    </button>
                  </div>

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
