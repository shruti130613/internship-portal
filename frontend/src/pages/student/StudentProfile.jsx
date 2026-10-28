import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { User, BookOpen, Wrench, Compass, CheckCircle2, Save, Sparkles, Plus, X } from 'lucide-react';
import API from '../../api';

export default function StudentProfile() {
  const { user, profile, updateProfileState } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    college: '',
    degree: '',
    branch: '',
    graduation_year: 2027,
    cgpa: '',
    skills: [],
    soft_skills: [],
    preferred_role: '',
    preferred_location: '',
    work_mode: 'Remote',
    internship_duration: '3 Months'
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/students/profile');
      setFormData(res.data);
      updateProfileState(res.data);
    } catch (e) {
      if (profile) {
        setFormData({ ...profile });
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkillTag = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkillTag = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await API.put('/students/profile', formData);
      setFormData(res.data);
      updateProfileState(res.data);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Student Profile & Academic Record</h1>
              <p className="text-xs text-slate-500 mt-1">
                Keep your academic CGPA, skills, and preferences updated for accurate AI Internship Matching.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-indigo-700 block">Completion</span>
              <span className="text-lg font-bold text-indigo-900">{formData.profile_completion || 85}%</span>
            </div>
          </div>

          {msg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Personal Information */}
            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-indigo-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label-text">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-slate-50 text-slate-500"
                  />
                </div>

                <div>
                  <label className="label-text">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Current Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="Delhi / Bengaluru / Remote"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* 2. Education */}
            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Education & Academic Standing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-text">College / University</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college || ''}
                    onChange={handleChange}
                    placeholder="National Institute of Technology"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree || ''}
                    onChange={handleChange}
                    placeholder="B.Tech / BE"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Branch / Specialization</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch || ''}
                    onChange={handleChange}
                    placeholder="Computer Science & Engineering"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year || 2027}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">CGPA (Out of 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa !== undefined && formData.cgpa !== null ? formData.cgpa : ''}
                    onChange={handleChange}
                    placeholder="e.g. 8.5"
                    className="input-field font-semibold text-indigo-700"
                  />
                </div>
              </div>
            </div>

            {/* 3. Skills */}
            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Wrench className="w-4 h-4 text-indigo-600" />
                Technical & Soft Skills
              </h3>

              <div>
                <label className="label-text">Technical Skills Tag Grid</label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Python, React, SQL, Docker"
                    className="input-field max-w-sm"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillTag(); } }}
                  />
                  <button type="button" onClick={addSkillTag} className="btn-secondary py-2 px-3 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[60px]">
                  {(formData.skills || []).map((sk, idx) => (
                    <span key={idx} className="badge-ai text-xs font-semibold py-1 px-2.5 bg-white border border-indigo-200 text-indigo-800 flex items-center gap-1">
                      {sk}
                      <button type="button" onClick={() => removeSkillTag(sk)} className="text-indigo-400 hover:text-rose-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(formData.skills || []).length === 0 && (
                    <span className="text-xs text-slate-400 italic">No skill tags added yet. Type a skill and click Add Tag.</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Career Preferences */}
            <div className="portal-card bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-4 h-4 text-indigo-600" />
                Career & Internship Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Preferred Role Title</label>
                  <input
                    type="text"
                    name="preferred_role"
                    value={formData.preferred_role || ''}
                    onChange={handleChange}
                    placeholder="Python Developer Intern / React Intern"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Preferred Location</label>
                  <input
                    type="text"
                    name="preferred_location"
                    value={formData.preferred_location || ''}
                    onChange={handleChange}
                    placeholder="Remote / Bengaluru / Hyderabad"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Work Mode Preference</label>
                  <select
                    name="work_mode"
                    value={formData.work_mode || 'Remote'}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div>
                  <label className="label-text">Internship Duration</label>
                  <select
                    name="internship_duration"
                    value={formData.internship_duration || '3 Months'}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6">
                <Save className="w-4 h-4" />
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>

        </main>
      </div>

      <Footer />
    </div>
  );
}
