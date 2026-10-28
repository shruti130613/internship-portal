import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Compass, Bell, User, LogOut, ChevronDown,
  Briefcase, GraduationCap, LayoutDashboard, ShieldCheck, Sparkles, Menu, X
} from 'lucide-react';
import API from '../api';

export default function Navbar() {
  const { user, role, profile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      setNotifications([
        { id: 1, title: 'Welcome to InternPath AI', message: 'Your student placement profile is active and verified.', is_read: false },
        { id: 2, title: 'New Verified Openings', message: 'Explore internships from Google, Infosys, and Microsoft.', is_read: false }
      ]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getDashboardPath = () => {
    if (role === 'STUDENT') return '/student/dashboard';
    if (role === 'COMPANY') return '/company/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-slate-900 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none text-slate-900">
              InternPath <span className="text-blue-600 font-extrabold">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Career & Placement Portal
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        {!user ? (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link to="/" className={`hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600' : ''}`}>Home</Link>
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#companies" className="hover:text-blue-600 transition-colors">Companies</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            </nav>
            <div className="flex items-center gap-2.5">
              <Link to="/login" className="btn-secondary text-xs sm:text-sm px-3.5 sm:px-4 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm px-3.5 sm:px-4 py-2">
                Register
              </Link>
            </div>
          </div>
        ) : (
          /* Logged-in Header Actions */
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Role Badge */}
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 ${
              role === 'STUDENT' ? 'bg-blue-50 text-blue-700 border border-blue-200/80' :
              role === 'COMPANY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' :
              'bg-slate-100 text-slate-800 border border-slate-300'
            }`}>
              {role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5" />}
              {role === 'COMPANY' && <Briefcase className="w-3.5 h-3.5" />}
              {role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
              {role}
            </span>

            {/* Dashboard Quick Link */}
            <Link
              to={getDashboardPath()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/70 rounded-md transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                    <span className="text-[11px] text-slate-500">{notifications.length} updates</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div key={idx} className="p-3 hover:bg-slate-50 transition-colors">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {(profile?.full_name || profile?.company_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[110px] truncate hidden md:inline">
                  {profile?.full_name || profile?.company_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || user.email}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {role} Account
                    </span>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>

                  {role === 'STUDENT' && (
                    <Link
                      to="/student/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" /> Student Profile
                    </Link>
                  )}

                  {role === 'COMPANY' && (
                    <Link
                      to="/company/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" /> Company Profile
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  );
}

