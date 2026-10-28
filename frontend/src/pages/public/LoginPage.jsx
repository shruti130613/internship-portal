import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Lock, Mail, AlertCircle, ArrowRight, GraduationCap, Briefcase, ShieldCheck, Compass } from 'lucide-react';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password, role);
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

  const fillDemo = (dEmail, dPass, dRole) => {
    setEmail(dEmail);
    setPassword(dPass);
    setRole(dRole);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">Portal Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your registered email and password to access your dashboard</p>
          </div>

          {/* Role Choice Pills */}
          <div className="bg-slate-200/70 p-1 rounded-xl flex gap-1 text-xs font-semibold border border-slate-200">
            {[
              { id: 'STUDENT', label: 'Student', icon: GraduationCap },
              { id: 'COMPANY', label: 'Company', icon: Briefcase },
              { id: 'ADMIN', label: 'Admin', icon: ShieldCheck },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${role === r.id
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3 text-xs">
            <div className="font-semibold text-slate-700 mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide">
              <span>Quick Test Credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('rahul@student.edu', 'student123', 'STUDENT')}
                className="bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-200 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center truncate cursor-pointer transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('recruiter@google.com', 'company123', 'COMPANY')}
                className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center truncate cursor-pointer transition-colors"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@internpath.ai', 'admin123', 'ADMIN')}
                className="bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center truncate cursor-pointer transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-card bg-white p-6 space-y-4">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.edu or corporate email"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-text mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 mt-2">
              {submitting ? 'Verifying Account...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">Need a new account? </span>
              <Link to="/register" className="text-xs text-blue-600 hover:underline font-bold">
                Register here
              </Link>
            </div>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}

