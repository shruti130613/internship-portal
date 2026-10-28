import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Briefcase, Plus, Sparkles, MapPin, Clock, Users } from 'lucide-react';
import API from '../../api';

export default function MyInternships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await API.get('/company/internships');
      setItems(res.data);
    } catch (e) {
      setItems([
        {
          id: 1,
          title: 'Python Backend Developer Intern',
          location: 'Remote',
          work_mode: 'Remote',
          duration: '3 Months',
          stipend: '₹20,000 / month',
          openings: 3,
          status: 'APPROVED',
          required_skills: ['Python', 'Django', 'SQL', 'Git']
        },
        {
          id: 2,
          title: 'Frontend Developer Intern (React)',
          location: 'Bengaluru / Hybrid',
          work_mode: 'Hybrid',
          duration: '6 Months',
          stipend: '₹18,000 / month',
          openings: 2,
          status: 'APPROVED',
          required_skills: ['React', 'JavaScript', 'HTML', 'CSS']
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
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Manage Internship Postings</h1>
              <p className="text-xs text-slate-500 mt-1">Active campus job listings and candidate ranking shortcuts.</p>
            </div>
            <Link to="/company/post-internship" className="btn-primary text-xs py-2 px-4">
              <Plus className="w-4 h-4" /> Post New Listing
            </Link>
          </div>

          <div className="space-y-4">
            {items.map((job) => (
              <div key={job.id} className="portal-card bg-white p-5 border border-slate-200 rounded-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge-eligible text-[10px] uppercase font-bold">
                        Status: {job.status}
                      </span>
                      <span className="badge-neutral text-[10px]">{job.work_mode}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.duration}</span>
                      <span className="font-semibold text-slate-700">{job.stipend}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/company/applicant-ranking?internship_id=${job.id}`}
                      className="btn-primary text-xs py-2 px-3 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Applicant Ranking
                    </Link>
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
