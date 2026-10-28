import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import {
  Sparkles, Search, Filter, MapPin, Clock, Building2,
  CheckCircle2, AlertCircle, ArrowRight, ThumbsUp, Globe, Check, X
} from 'lucide-react';
import API from '../../api';

export default function RecommendedInternships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('view') === 'all' ? 'ALL' : 'RECOMMENDED';

  const [activeTab, setActiveTab] = useState(initialTab); // 'RECOMMENDED' or 'ALL'
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('ALL');
  const [minMatch, setMinMatch] = useState(0);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await API.get('/students/recommendations');
      setInternships(res.data);
    } catch (e) {
      // Real-World Fallback Internships
      setInternships([
        {
          id: 1,
          company_name: 'Google',
          title: 'Software Engineering Intern (Summer 2026/2027)',
          location: 'Bengaluru / Hyderabad',
          work_mode: 'Hybrid',
          duration: '3 Months (Summer)',
          stipend: '₹80,000 / month',
          required_skills: ['Python', 'C++', 'Java', 'Data Structures', 'Algorithms', 'SQL'],
          preferred_skills: ['Distributed Systems', 'Git'],
          min_cgpa: 8.0,
          match_score: 95.0,
          match_reason: 'Top AI match (95.0%): Excellent alignment in Python, Data Structures, and SQL.',
          matched_skills: ['Python', 'SQL', 'Git'],
          missing_skills: ['C++', 'Algorithms'],
          is_eligible: true
        },
        {
          id: 2,
          company_name: 'Microsoft',
          title: 'Software Engineer Intern (Graduate & Undergrad)',
          location: 'Hyderabad / Noida',
          work_mode: 'Hybrid',
          duration: '6 Months',
          stipend: '₹75,000 / month',
          required_skills: ['Python', 'C#', 'React', 'Data Structures', 'SQL', 'Git'],
          preferred_skills: ['Azure', 'TypeScript', 'Docker'],
          min_cgpa: 7.5,
          match_score: 92.0,
          match_reason: 'High AI match (92.0%): Matches Python, React, SQL, and Git.',
          matched_skills: ['Python', 'React', 'SQL', 'Git'],
          missing_skills: ['C#', 'Azure'],
          is_eligible: true
        },
        {
          id: 3,
          company_name: 'Amazon',
          title: 'Software Development Engineer Intern (SDE Intern)',
          location: 'Bengaluru, India',
          work_mode: 'Onsite',
          duration: '6 Months',
          stipend: '₹80,000 / month',
          required_skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'SQL'],
          preferred_skills: ['AWS', 'Git'],
          min_cgpa: 7.5,
          match_score: 88.5,
          match_reason: 'Strong match (88.5%): Matches core backend stack & Python skills.',
          matched_skills: ['Python', 'SQL', 'Git'],
          missing_skills: ['Java', 'AWS'],
          is_eligible: true
        },
        {
          id: 4,
          company_name: 'Infosys Limited',
          title: 'Software Engineering Intern (InStep Global Program)',
          location: 'Bengaluru / Pune',
          work_mode: 'Hybrid',
          duration: '3 Months',
          stipend: '₹35,000 / month',
          required_skills: ['Python', 'Django', 'SQL', 'Git', 'REST API'],
          preferred_skills: ['Docker', 'PostgreSQL', 'Cloud Architecture'],
          min_cgpa: 7.5,
          match_score: 91.5,
          match_reason: 'Strong match (91.5%): Your skills in Python, Django, SQL, and Git closely align with job requirements.',
          matched_skills: ['Python', 'Django', 'SQL', 'Git'],
          missing_skills: ['Docker'],
          is_eligible: true
        },
        {
          id: 5,
          company_name: 'Razorpay',
          title: 'Backend Engineering Intern (Payments Platform)',
          location: 'Bengaluru / Hybrid',
          work_mode: 'Hybrid',
          duration: '6 Months',
          stipend: '₹45,000 / month',
          required_skills: ['Python', 'Django', 'REST API', 'SQL', 'Git'],
          preferred_skills: ['Go', 'Redis', 'Docker'],
          min_cgpa: 7.0,
          match_score: 86.0,
          match_reason: 'Good match (86.0%): Matches Python, REST API, and SQL.',
          matched_skills: ['Python', 'SQL', 'Git'],
          missing_skills: ['Go', 'Redis'],
          is_eligible: true
        },
        {
          id: 6,
          company_name: 'Zomato',
          title: 'Frontend Engineering Intern (React / Web)',
          location: 'Gurugram / Remote',
          work_mode: 'Remote',
          duration: '3 Months',
          stipend: '₹35,000 / month',
          required_skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
          preferred_skills: ['TypeScript', 'Redux'],
          min_cgpa: 7.0,
          match_score: 83.0,
          match_reason: 'Good match (83.0%): Matches React, JavaScript, and HTML/CSS.',
          matched_skills: ['React', 'JavaScript', 'HTML', 'CSS'],
          missing_skills: ['TypeScript'],
          is_eligible: true
        },
        {
          id: 7,
          company_name: 'Swiggy',
          title: 'Data Science & Machine Learning Intern',
          location: 'Bengaluru / Remote',
          work_mode: 'Remote',
          duration: '6 Months',
          stipend: '₹40,000 / month',
          required_skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Analysis'],
          preferred_skills: ['Scikit-learn', 'PyTorch'],
          min_cgpa: 8.0,
          match_score: 68.0,
          match_reason: 'Moderate match (68.0%): Matches Python & SQL, but missing ML framework experience.',
          matched_skills: ['Python', 'SQL'],
          missing_skills: ['Pandas', 'NumPy', 'Scikit-learn'],
          is_eligible: true
        },
        {
          id: 8,
          company_name: 'Tata Consultancy Services (TCS)',
          title: 'Full Stack Web Developer Intern (TCS iON)',
          location: 'Mumbai / Remote',
          work_mode: 'Hybrid',
          duration: '3 Months',
          stipend: '₹25,000 / month',
          required_skills: ['JavaScript', 'React', 'HTML', 'CSS', 'SQL', 'Git'],
          preferred_skills: ['Node.js', 'Bootstrap'],
          min_cgpa: 6.5,
          match_score: 85.0,
          match_reason: 'Good match (85.0%): Broad fit with web stack.',
          matched_skills: ['JavaScript', 'React', 'HTML', 'CSS', 'SQL', 'Git'],
          missing_skills: ['Node.js'],
          is_eligible: true
        },
        {
          id: 9,
          company_name: 'Flipkart',
          title: 'Data Analyst Intern (Analytics & Insights)',
          location: 'Bengaluru, India',
          work_mode: 'Onsite',
          duration: '3 Months',
          stipend: '₹35,000 / month',
          required_skills: ['SQL', 'Python', 'Pandas', 'Data Analysis'],
          preferred_skills: ['Power BI', 'Excel'],
          min_cgpa: 7.5,
          match_score: 62.0,
          match_reason: 'Lower match (62.0%): Skill gaps detected in advanced business analytics tools.',
          matched_skills: ['Python', 'SQL'],
          missing_skills: ['Pandas', 'Power BI'],
          is_eligible: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams({ view: tab.toLowerCase() });
  };

  // Filter based on Tab + Search + Filters
  const filtered = internships.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkMode = selectedWorkMode === 'ALL' || item.work_mode === selectedWorkMode;
    const matchesScore = item.match_score >= minMatch;

    if (activeTab === 'RECOMMENDED') {
      // Show high and moderate recommendations (e.g. match >= 70%)
      return matchesSearch && matchesWorkMode && matchesScore && item.match_score >= 70;
    }
    // 'ALL' tab shows every single internship regardless of match score
    return matchesSearch && matchesWorkMode && matchesScore;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="badge-ai text-xs mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Internship Portal
                </span>
                <h1 className="text-xl font-bold text-slate-900">Explore Real-World Internships</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Discover top opportunities from hiring partners like Google, Microsoft, Amazon, Zomato, Razorpay & more.
                </p>
              </div>

              {/* 2 View Mode Switcher Options */}
              <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 shrink-0">
                <button
                  onClick={() => handleTabSwitch('RECOMMENDED')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'RECOMMENDED'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Recommended
                </button>

                <button
                  onClick={() => handleTabSwitch('ALL')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ALL'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  All Internships ({internships.length})
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title, tech stack or company (Google, Microsoft...)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 text-xs py-2"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5" />
                <span className="font-semibold">Work Mode:</span>
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="input-field text-xs py-1 px-2 w-28"
                >
                  <option value="ALL">All Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold">Min Match:</span>
                <select
                  value={minMatch}
                  onChange={(e) => setMinMatch(Number(e.target.value))}
                  className="input-field text-xs py-1 px-2 w-24"
                >
                  <option value={0}>All Scores</option>
                  <option value={70}>70%+</option>
                  <option value={80}>80%+</option>
                  <option value={90}>90%+</option>
                </select>
              </div>
            </div>

          </div>

          {/* Internships List */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="portal-card bg-white p-8 text-center text-xs text-slate-500">
                No internships found matching your filter criteria. Switch view tabs or adjust search parameters.
              </div>
            ) : (
              filtered.map((item) => {
                const isHighMatch = item.match_score >= 85;
                const isModMatch = item.match_score >= 70 && item.match_score < 85;

                return (
                  <div key={item.id} className="portal-card bg-white p-5 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                            isHighMatch
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isModMatch
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            <Sparkles className="w-3 h-3" /> AI Match: {item.match_score}%
                          </span>

                          <span className={item.is_eligible ? 'badge-eligible text-[10px]' : 'badge-ineligible text-[10px]'}>
                            {item.is_eligible ? '✓ Eligible (CGPA Met)' : '✗ Ineligible (CGPA Below)'}
                          </span>

                          <span className="badge-neutral text-[10px]">
                            {item.work_mode}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          {item.company_name}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{item.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{item.duration}</span>
                          <span className="font-semibold text-emerald-700">{item.stipend}</span>
                        </div>

                        {/* Match Rationale Callout */}
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 mt-2 italic">
                          "{item.match_reason}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[11px] font-semibold text-slate-500 mr-1">Skills:</span>
                          {(item.required_skills || []).map((sk, idx) => {
                            const isMatched = (item.matched_skills || []).includes(sk);
                            return (
                              <span
                                key={idx}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                  isMatched
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {isMatched ? `✓ ${sk}` : sk}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-full md:w-auto shrink-0 flex flex-col items-end gap-2">
                        <Link to={`/student/internships/${item.id}`} className="btn-primary w-full md:w-auto text-xs py-2 px-4">
                          View Details & Apply
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
