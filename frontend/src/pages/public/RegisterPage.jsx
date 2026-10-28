import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { GraduationCap, Briefcase, Mail, Lock, User, Building, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    college: 'National Institute of Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    cgpa: '8.5',
    company_name: '',
    industry: 'Technology & Cloud Software',
    website: 'https://careers.google.com'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = { ...formData, role };
    const result = await register(payload);
    setSubmitting(false);

    if (result.success) {
      if (result.role === 'STUDENT') navigate('/student/dashboard');
      else if (result.role === 'COMPANY') navigate('/company/dashboard');
      else if (result.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
            <p className="text-xs text-slate-500 mt-1">Register with your own email and password for immediate portal access</p>
          </div>

          {/* Role Choice Pills */}
          <div className="bg-slate-200/70 p-1 rounded-xl flex gap-1 text-xs font-semibold border border-slate-200">
            {[
              { id: 'STUDENT', label: 'Student', icon: GraduationCap },
              { id: 'COMPANY', label: 'Company', icon: Briefcase },
              { id: 'ADMIN', label: 'Admin / Placement Cell', icon: ShieldCheck },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex-1 py-2 px-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
                    role === r.id
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-card bg-white p-6 space-y-4">
            
            <div>
              <label className="label-text">Official Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={role === 'STUDENT' ? 'your.name@student.edu' : role === 'COMPANY' ? 'recruiter@company.com' : 'admin@internpath.ai'}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-text">Create Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a secure password"
                className="input-field"
              />
            </div>

            {role === 'STUDENT' && (
              <>
                <div>
                  <label className="label-text">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Shruti Sharma"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="B.Tech"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-text">Current CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text">College / Institute</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </>
            )}

            {role === 'COMPANY' && (
              <>
                <div>
                  <label className="label-text">Company / Enterprise Name</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Infosys, Razorpay, or Google"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Industry Sector</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Software, FinTech, AI"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Careers / Corporate Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com/careers"
                    className="input-field"
                  />
                </div>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <div>
                  <label className="label-text">Administrator Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Placement Officer / Dean"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">University / Institute Placement Cell</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Technology T&P Cell"
                    className="input-field"
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 mt-2">
              {submitting ? 'Creating Account...' : `Register & Continue`}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-xs text-blue-600 hover:underline font-bold">
                Sign in here
              </Link>
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}

