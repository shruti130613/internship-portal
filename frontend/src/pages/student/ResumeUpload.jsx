import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import {
  FileText, Sparkles, AlertCircle, ArrowRight,
  Upload, CheckCircle2, X, RefreshCw, UserCheck, ShieldCheck
} from 'lucide-react';
import API from '../../api';
import { AuthContext } from '../../context/AuthContext';

const SAMPLE_RESUME_TEXT = `Rahul Sharma
Email: rahul.sharma@example.com | Phone: +91 98765 43210
Location: New Delhi, India

EDUCATION
Delhi Technological University (DTU)
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
CGPA: 8.7 / 10.0

TECHNICAL SKILLS
Languages: Python, JavaScript, SQL, HTML5, CSS3, C++
Frameworks & Libraries: Django, React.js, Express.js, REST APIs, Tailwind CSS
Databases & Tools: PostgreSQL, MySQL, SQLite, MongoDB, Git, Docker, Linux
Core Concepts: Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS

EXPERIENCE / INTERNSHIPS
Software Engineering Intern | Web Solutions Project (June 2024 - Aug 2024)
- Developed responsive REST APIs using Python and Django REST Framework.
- Built reusable frontend components in React.js for student placement tracking.
- Optimized database queries and created automated testing workflows using Git.

PROJECTS
InternPath AI - Campus Placement & ATS Portal
- Built a full-stack platform connecting engineering students with tier-1 technology internships.
- Integrated AI resume keyword extraction, skill gap analytics, and company applicant matching.
- Implemented JWT authentication and responsive dashboards.

Cloud-Based Task & Inventory Management System
- Created a microservices backend with Node.js and MongoDB.
- Implemented real-time status updates and role-based access control.

CERTIFICATIONS
- Python for Data Science and Machine Learning - Coursera
- Full Stack Web Development Specialization - NPTEL
`;

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { user, role, login } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [mode, setMode] = useState('FILE'); // FILE or TEXT
  const [uploading, setUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [authNotice, setAuthNotice] = useState('');

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      const res = await API.get('/students/resume');
      if (res.data && res.data.file_name) {
        setCurrentResume(res.data);
      }
    } catch (e) {
      // No resume uploaded yet or guest user
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selected = files[0];
      if (selected.size > 8 * 1024 * 1024) {
        setError('File size exceeds maximum allowed limit of 8 MB.');
        return;
      }
      const ext = selected.name.split('.').pop().toLowerCase();
      if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
        setError('Please upload a PDF, DOCX, or TXT resume file.');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleQuickLogin = async () => {
    try {
      const res = await login('rahul@student.edu', 'Password123!', 'STUDENT');
      if (res.success) {
        setAuthNotice('Logged in as Rahul Sharma (Demo Student). Ready to upload!');
        fetchCurrentResume();
      } else {
        setError(res.error || 'Demo login failed');
      }
    } catch (err) {
      setError('Unable to auto-authenticate demo student.');
    }
  };

  const handleLoadSampleText = () => {
    setPastedText(SAMPLE_RESUME_TEXT);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'FILE' && !file) {
      setError('Please select a PDF or DOCX resume file.');
      return;
    }
    if (mode === 'TEXT' && !pastedText.trim()) {
      setError('Please paste your resume text content or click "Insert Sample Resume".');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    if (mode === 'FILE' && file) {
      formData.append('file', file);
    } else {
      formData.append('text', pastedText);
    }

    try {
      // Note: We do NOT pass explicit 'Content-Type': 'multipart/form-data'
      // so Axios / browser sets multipart/form-data with the correct boundary!
      const res = await API.post('/students/resume', formData);

      // If backend returned auth session for guest/admin, store it seamlessly
      if (res.data?.token && !localStorage.getItem('internpath_token')) {
        localStorage.setItem('internpath_token', res.data.token);
        if (res.data.user) {
          localStorage.setItem('internpath_user', JSON.stringify(res.data.user));
          localStorage.setItem('internpath_role', res.data.role || 'STUDENT');
        }
      }

      // Store in session for instantaneous render on AI analysis page
      try {
        sessionStorage.setItem('latest_resume_analysis', JSON.stringify(res.data));
      } catch (err) {
        // quota ignore
      }

      navigate('/student/ai-analysis');
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to analyze resume. Please try again.';
      setError(serverMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          {/* Header Bar */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-ai text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Resume Parser
                </span>
                <span className="text-xs text-slate-400 font-medium">| ATS Benchmark Screening</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Upload Resume for AI Analysis</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your PDF/DOCX resume to detect technical skills, compute your ATS score, and unlock matched internships.
              </p>
            </div>

            {currentResume && (
              <button
                onClick={() => navigate('/student/ai-analysis')}
                className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                View Current Analysis ({currentResume.overall_score}/100)
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Auth State Notification Banner */}
          {(!user || role !== 'STUDENT') && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {user ? (
                    <>Logged in as <strong>{user.email || user.username}</strong> ({role}). Resume analysis test mode is enabled.</>
                  ) : (
                    <>You are browsing as <strong>Demo Student (Guest Evaluation Mode)</strong>. Resume uploads and AI parsing work seamlessly!</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!user && (
                  <button
                    type="button"
                    onClick={handleQuickLogin}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    1-Click Demo Login
                  </button>
                )}
                <Link to="/login" className="text-blue-700 font-semibold hover:underline text-[11px]">
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {authNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{authNotice}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-0.5"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Upload Card */}
          <div className="portal-card bg-white p-6 md:p-8 space-y-6">
            
            {/* Mode Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => { setMode('FILE'); setError(''); }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  mode === 'FILE'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Upload PDF / DOCX File
              </button>
              <button
                type="button"
                onClick={() => { setMode('TEXT'); setError(''); }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  mode === 'TEXT'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Paste Plain Resume Text
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {mode === 'FILE' ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 md:p-10 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
                    <Upload className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-800">
                    Drag and drop your resume file here
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Supported formats: PDF, DOCX, DOC, or TXT (Max size: 8 MB)
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-file-input"
                  />
                  
                  <label
                    htmlFor="resume-file-input"
                    className="btn-secondary text-xs px-5 py-2.5 mt-4 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Browse From Computer
                  </label>

                  {file && (
                    <div className="mt-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-3 text-xs text-emerald-900 shadow-2xs max-w-md w-full justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate">{file.name}</span>
                        <span className="text-[11px] text-emerald-700 shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Paste Plain Resume Text Content
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSampleText}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      + Insert Sample Technical Resume
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste resume text including Education, Technical Skills, Internships, Projects, and Certifications..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <p className="text-[11px] text-slate-500">
                    Tip: The parser automatically extracts languages, frameworks, education, and computes ATS deductions.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Analyzing Resume with InternPath AI Engine...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      Analyze Resume & Calculate Score
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">1</span>
              <h4 className="text-xs font-bold text-slate-800">Automated Skill Extraction</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Scans 60+ industry languages, frameworks, and developer tooling across your resume.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-4">
              <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs mb-2">2</span>
              <h4 className="text-xs font-bold text-slate-800">Strict ATS Flaw Detection</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Flags missing GitHub/LinkedIn links, brief bullet points, and prevents unearned 100/100 scores.
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-4">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs mb-2">3</span>
              <h4 className="text-xs font-bold text-slate-800">Live Internship Matching</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Computes genuine match percentages against live openings at Google, Microsoft, Infosys, and Cisco.
              </p>
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
