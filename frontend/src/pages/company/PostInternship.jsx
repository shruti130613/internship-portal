import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Briefcase, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import API from '../../api';

export default function PostInternship() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: 'Python Backend Developer Intern',
    description: 'We are looking for a motivated Python & Django intern to design and scale REST APIs.',
    responsibilities: 'Develop API endpoints, write database migrations, integrate unit tests, and optimize ORM queries.',
    min_cgpa: '7.5',
    education_req: 'B.Tech / BE',
    location: 'Remote',
    work_mode: 'Remote',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    openings: '3',
    required_skills: ['Python', 'Django', 'SQL', 'Git'],
    preferred_skills: ['Docker', 'PostgreSQL']
  });

  const [reqSkillInput, setReqSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addReqSkill = () => {
    if (reqSkillInput.trim() && !formData.required_skills.includes(reqSkillInput.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, reqSkillInput.trim()]
      });
      setReqSkillInput('');
    }
  };

  const removeReqSkill = (skill) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await API.post('/company/internships', formData);
      navigate('/company/internships');
    } catch (err) {
      setError('Failed to post internship. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h1 className="text-xl font-bold text-slate-900">Post New Internship Opportunity</h1>
            <p className="text-xs text-slate-500 mt-1">
              Specify required skills, minimum CGPA eligibility, stipend, and job criteria.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-card bg-white p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-text">Internship Position Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Python Backend Developer Intern"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Minimum Required CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  name="min_cgpa"
                  value={formData.min_cgpa}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Degree Requirement</label>
                <input
                  type="text"
                  name="education_req"
                  value={formData.education_req}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Work Mode</label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="label-text">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Monthly Stipend</label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="₹20,000 / month"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Number of Openings</label>
                <input
                  type="number"
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Required Skills Tag List</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={reqSkillInput}
                  onChange={(e) => setReqSkillInput(e.target.value)}
                  placeholder="Type skill (e.g. Python) and click Add"
                  className="input-field max-w-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addReqSkill(); } }}
                />
                <button type="button" onClick={addReqSkill} className="btn-secondary text-xs py-2 px-3">
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px]">
                {formData.required_skills.map((sk, idx) => (
                  <span key={idx} className="badge-ai text-xs font-semibold py-1 px-2.5 bg-white border border-indigo-200 text-indigo-800 flex items-center gap-1">
                    {sk}
                    <button type="button" onClick={() => removeReqSkill(sk)} className="text-indigo-400 hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="label-text">Job Description</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-text">Key Responsibilities</label>
              <textarea
                rows={3}
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={submitting} className="btn-primary py-2.5 px-6">
                {submitting ? 'Publishing...' : 'Publish Internship'}
              </button>
            </div>

          </form>

        </main>
      </div>

      <Footer />
    </div>
  );
}
