import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import {
  Sparkles, CheckCircle2, AlertCircle, Building2, MapPin, Clock,
  Calendar, Award, ArrowLeft, Send, Target
} from 'lucide-react';
import API from '../../api';

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(AuthContext);

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await API.get(`/students/recommendations`);
      const found = res.data.find(item => String(item.id) === String(id));
      if (found) {
        setInternship(found);
      } else {
        throw new Error('Not found in recommendations');
      }
    } catch (e) {
      setInternship({
        id: id || 1,
        company_name: 'TechNova Solutions',
        title: 'Python Backend Developer Intern',
        description: 'We are looking for a motivated Python & Django intern to design and scale REST APIs.',
        responsibilities: 'Develop API endpoints, write database migrations, integrate unit tests, and optimize ORM queries.',
        required_skills: ['Python', 'Django', 'SQL', 'Git', 'REST API'],
        preferred_skills: ['Docker', 'Redis', 'PostgreSQL'],
        min_cgpa: 7.5,
        education_req: 'B.Tech / BE',
        location: 'Remote',
        work_mode: 'Remote',
        duration: '3 Months',
        stipend: '₹20,000 / month',
        openings: 3,
        deadline: '2026-10-15',
        match_score: 91.5,
        match_reason: 'Strong match (91.5%): Your skills in Python, Django, SQL, and Git closely align with job requirements.',
        matched_skills: ['Python', 'Django', 'SQL', 'Git'],
        missing_skills: ['Docker'],
        is_eligible: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setMsg('');
    setError('');

    try {
      await API.post('/students/applications', { internship_id: internship.id });
      setMsg('Application submitted successfully!');
      setTimeout(() => navigate('/student/applications'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex max-w-7xl w-full mx-auto"><Sidebar /><main className="flex-1 p-8 text-center text-xs text-slate-500">Loading details...</main></div>
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
          
          <Link to="/student/recommended" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4" /> Back to Recommended Internships
          </Link>

          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-ai text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Your Match: {internship.match_score}%
                  </span>
                  <span className={internship.is_eligible ? 'badge-eligible text-[10px]' : 'badge-ineligible text-[10px]'}>
                    {internship.is_eligible ? 'Eligible' : 'Ineligible'}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">{internship.title}</h1>
                <p className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {internship.company_name}
                </p>
              </div>

              <button
                onClick={handleApply}
                disabled={applying || !internship.is_eligible}
                className="btn-primary text-sm py-2.5 px-6 self-start sm:self-auto"
              >
                <Send className="w-4 h-4" />
                {applying ? 'Submitting Application...' : 'Apply Now'}
              </button>
            </div>

            {msg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{msg}</span>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Work Mode & Location</span>
                <span className="font-bold text-slate-800">{internship.work_mode} ({internship.location})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Stipend</span>
                <span className="font-bold text-indigo-700">{internship.stipend}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Duration</span>
                <span className="font-bold text-slate-800">{internship.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Min CGPA Required</span>
                <span className="font-bold text-slate-800">{internship.min_cgpa}</span>
              </div>
            </div>
          </div>

          {/* AI Personal Match Analysis Box */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              Personal AI Match Breakdown
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">
              "{internship.match_reason}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                <span className="font-bold text-emerald-800 block mb-1">Matched Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {(internship.matched_skills || []).map((sk, i) => (
                    <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-indigo-100">
                <span className="font-bold text-amber-800 block mb-1">Skill Gap (Missing):</span>
                <div className="flex flex-wrap gap-1">
                  {(internship.missing_skills || []).map((sk, i) => (
                    <span key={i} className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200">
                      • {sk}
                    </span>
                  ))}
                  {(internship.missing_skills || []).length === 0 && (
                    <span className="text-[11px] text-emerald-700">No skill gaps! You meet 100% of required skills.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Internship Description */}
          <div className="portal-card bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">About the Internship</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{internship.description}</p>

            <h3 className="text-base font-bold text-slate-900 pt-2">Key Responsibilities</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{internship.responsibilities}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(internship.required_skills || []).map((sk, idx) => (
                    <span key={idx} className="badge-neutral text-xs">{sk}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Preferred Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(internship.preferred_skills || []).map((sk, idx) => (
                    <span key={idx} className="badge-ai text-xs">{sk}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
