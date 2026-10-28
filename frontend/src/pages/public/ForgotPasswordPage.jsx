import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your registered email address to receive reset instructions</p>
          </div>

          {submitted ? (
            <div className="portal-card bg-white p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Reset Link Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account with <strong>{email}</strong> exists, you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-secondary w-full py-2 mt-4">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="portal-card bg-white p-6 space-y-4">
              <div>
                <label className="label-text">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-2.5">
                Send Reset Link
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link to="/login" className="text-xs text-indigo-600 hover:underline font-bold">
                  Remember password? Log in
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
