import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Users, Search, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import API from '../../api';

export default function UserManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setStudents(res.data);
    } catch (e) {
      setStudents([
        {
          id: 1,
          full_name: 'Rahul Sharma',
          college: 'National Institute of Technology',
          degree: 'B.Tech',
          branch: 'Computer Science',
          cgpa: 8.7,
          user: { email: 'rahul@student.edu', is_active: true }
        },
        {
          id: 2,
          full_name: 'Ananya Patel',
          college: 'Vellore Institute of Technology',
          degree: 'B.Tech',
          branch: 'Information Technology',
          cgpa: 9.1,
          user: { email: 'ananya@student.edu', is_active: true }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Student & User Management</h1>
              <p className="text-xs text-slate-500 mt-1">Audit student profiles, academic records, and account statuses.</p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 text-xs py-2"
              />
            </div>
          </div>

          <div className="portal-card bg-white p-0 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Degree & Branch</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{s.full_name}</td>
                    <td className="p-4 text-slate-600">{s.user?.email}</td>
                    <td className="p-4">{s.college}</td>
                    <td className="p-4">{s.degree} ({s.branch})</td>
                    <td className="p-4 font-bold text-indigo-700">{s.cgpa}</td>
                    <td className="p-4 text-right">
                      <span className="badge-eligible text-[10px]">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
