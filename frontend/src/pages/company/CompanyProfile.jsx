import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Building2, Globe, MapPin, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import API from '../../api';

export default function CompanyProfile() {
  const { profile, updateProfileState } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry: '',
    company_size: '',
    location: '',
    description: '',
    verification_status: 'VERIFIED'
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/company/profile');
      setFormData(res.data);
      updateProfileState(res.data);
    } catch (e) {
      if (profile) setFormData({ ...profile });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await API.put('/company/profile', formData);
      setFormData(res.data);
      updateProfileState(res.data);
      setMsg('Company profile saved successfully!');
    } catch (err) {
      setMsg('Failed to update profile.');
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
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Company Recruiter Profile</h1>
              <p className="text-xs text-slate-500 mt-1">Manage organization details and official recruitment bio.</p>
            </div>
            <span className="badge-eligible text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verification Status: {formData.verification_status || 'VERIFIED'}
            </span>
          </div>

          {msg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-card bg-white p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  value={formData.company_name || ''}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Company Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Industry Sector</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleChange}
                  placeholder="Software Products / AI Services"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Company Size</label>
                <input
                  type="text"
                  name="company_size"
                  value={formData.company_size || ''}
                  onChange={handleChange}
                  placeholder="100-250 employees"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Headquarters Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="Bengaluru, India"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Company Description / Campus Bio</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Brief summary of company culture, products, and tech stack..."
                className="input-field"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Company Profile'}
              </button>
            </div>

          </form>

        </main>
      </div>

      <Footer />
    </div>
  );
}
