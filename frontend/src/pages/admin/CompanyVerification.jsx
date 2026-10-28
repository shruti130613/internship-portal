import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Building2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import API from '../../api';

export default function CompanyVerification() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      company_name: 'TechNova Solutions',
      website: 'https://technova.io',
      industry: 'Software & AI Products',
      location: 'Bengaluru, India',
      verification_status: 'VERIFIED'
    },
    {
      id: 2,
      company_name: 'NexaData Analytics',
      website: 'https://nexadata.ai',
      industry: 'Data & Machine Learning',
      location: 'Hyderabad / Remote',
      verification_status: 'VERIFIED'
    }
  ]);

  const handleVerify = async (cId, status) => {
    try {
      await API.post(`/admin/companies/${cId}/verify`, { status });
      setCompanies(companies.map(c => c.id === cId ? { ...c, verification_status: status } : c));
    } catch (e) {
      setCompanies(companies.map(c => c.id === cId ? { ...c, verification_status: status } : c));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h1 className="text-xl font-bold text-slate-900">Company Verification Queue</h1>
            <p className="text-xs text-slate-500 mt-1">Review recruiter organization profiles before granting active placement posting privileges.</p>
          </div>

          <div className="space-y-4">
            {companies.map((c) => (
              <div key={c.id} className="portal-card bg-white p-5 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      c.verification_status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {c.verification_status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{c.company_name}</h3>
                  <p className="text-xs text-slate-500">{c.industry} • {c.location} • {c.website}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerify(c.id, 'VERIFIED')}
                    className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Verify Company
                  </button>
                  <button
                    onClick={() => handleVerify(c.id, 'REJECTED')}
                    className="btn-danger text-xs py-1.5 px-3"
                  >
                    Reject
                  </button>
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
