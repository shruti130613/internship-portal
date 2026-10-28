import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Compass, Sparkles, CheckCircle2, ArrowRight, FileCheck2, Briefcase,
  Users, Building2, ShieldCheck, Award, FileText, Check, TrendingUp, Search
} from 'lucide-react';

export default function LandingPage() {
  const verifiedCompanies = [
    { name: 'Google India', role: 'Software Engineering Intern', stipend: '₹80,000/mo', location: 'Bengaluru / Hyderabad' },
    { name: 'Microsoft India', role: 'Cloud & Systems Intern', stipend: '₹75,000/mo', location: 'Hyderabad / Noida' },
    { name: 'Amazon India', role: 'SDE Intern (AWS Cloud)', stipend: '₹80,000/mo', location: 'Bengaluru' },
    { name: 'Infosys Limited', role: 'InStep Global Intern', stipend: '₹35,000/mo', location: 'Bengaluru / Pune' },
    { name: 'Flipkart', role: 'Data Analytics Intern', stipend: '₹35,000/mo', location: 'Bengaluru' },
    { name: 'Razorpay', role: 'Backend & FinTech Intern', stipend: '₹45,000/mo', location: 'Bengaluru / Hybrid' },
    { name: 'Zomato', role: 'Frontend React Intern', stipend: '₹35,000/mo', location: 'Gurugram / Remote' },
    { name: 'Cisco Systems', role: 'Cloud Network Intern', stipend: '₹50,000/mo', location: 'Bengaluru' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Verified Campus Placement & Career Platform
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Land high-impact internships with <span className="text-blue-600">objective AI matching</span>.
          </h1>

          <p className="text-slate-600 text-base md:text-lg mt-5 max-w-2xl mx-auto font-normal leading-relaxed">
            InternPath AI audits your resume against strict recruiter standards, pinpoints actionable skill gaps, and matches you directly with verified openings from premier technology enterprises.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3.5 flex-wrap">
            <Link to="/register" className="btn-primary text-sm px-6 py-3 shadow-md hover:shadow-lg">
              Create Student Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/login" className="btn-secondary text-sm px-6 py-3">
              Explore Active Openings
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> 100% Genuine Corporate Postings
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Explainable ATS Resume Audit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" /> Timed Technical CBT Screening
            </span>
          </div>

        </div>
      </section>

      {/* Real Hiring Enterprise Ticker / Logos */}
      <section id="companies" className="py-10 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Trusted by recruiters & hiring engineering teams from premier enterprises
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap opacity-80">
            {['Google India', 'Microsoft India', 'Amazon AWS', 'Infosys InStep', 'TCS NextStep', 'Flipkart', 'Zomato', 'Swiggy', 'Razorpay', 'Cisco Systems'].map((comp, idx) => (
              <span key={idx} className="text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs">
                {comp}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Placement Transparency
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            No synthetic hype. Real NLP extraction, rigorous deduction auditing, and deterministic qualification matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Strict ATS Resume Auditor</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Evaluates skill density, contact completeness, and quantified metric impact. Imperfections receive clear point deductions—meaning 100/100 is strictly reserved for flawless resumes.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
              Deductions Breakdown & Suggestions Included
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Smart Multi-Factor Matching</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Calculates compatibility percentages using exact technical skill overlap, CGPA eligibility thresholds, and student role preferences for genuine corporate listings.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              100% Original Company Openings
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Timed CBT Mock Assessments</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complete realistic role-based technical tests with countdown timers, question palette navigation, instant score calculation, and topic-wise gap reports.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              Objective Candidate Screening
            </div>
          </div>

        </div>
      </section>

      {/* Featured Genuine Internships Preview */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="badge-ai text-xs mb-1">Live Feed</span>
              <h2 className="text-2xl font-bold text-slate-900">Featured Real-World Internships</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verified postings currently open for campus & student applications</p>
            </div>
            <Link to="/login" className="btn-secondary text-xs">
              View All 10+ Openings <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verifiedCompanies.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.role}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{item.location}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.stipend}</span>
                  <Link to="/login" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                    Apply Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Structured Placement Journey</h2>
          <p className="text-slate-600 text-sm mt-1">Five clear phases connecting academic learning with industry hiring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Register Profile', desc: 'Add academic records, branch, degree, and current CGPA.' },
            { step: '02', title: 'Resume Audit', desc: 'Upload PDF/DOCX to extract skills and identify point deductions.' },
            { step: '03', title: 'AI Match Analysis', desc: 'Review calculated compatibility scores across original company openings.' },
            { step: '04', title: 'CBT Assessment', desc: 'Take timed technical screening exams to demonstrate role proficiency.' },
            { step: '05', title: 'Direct Hiring', desc: 'Track shortlist reviews and interview schedules in real time.' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <span className="text-xs font-extrabold text-blue-600 block mb-1">Phase {s.step}</span>
              <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

