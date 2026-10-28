import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('internpath_token') || localStorage.getItem('internmatch_token');
    const storedUser = localStorage.getItem('internpath_user') || localStorage.getItem('internmatch_user');
    const storedRole = localStorage.getItem('internpath_role') || localStorage.getItem('internmatch_role');
    const storedProfile = localStorage.getItem('internpath_profile') || localStorage.getItem('internmatch_profile');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        if (storedProfile) setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Error parsing stored auth:", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, roleChoice) => {
    try {
      const res = await API.post('/auth/login', { email, password, role: roleChoice });
      const { token, user: userData, role: userRole, profile: userProfile } = res.data;

      localStorage.setItem('internpath_token', token);
      localStorage.setItem('internpath_user', JSON.stringify(userData));
      localStorage.setItem('internpath_role', userRole);
      if (userProfile) localStorage.setItem('internpath_profile', JSON.stringify(userProfile));

      setUser(userData);
      setRole(userRole);
      setProfile(userProfile);
      return { success: true, role: userRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      const { token, user: userData, role: userRole, profile: userProfile } = res.data;

      localStorage.setItem('internpath_token', token);
      localStorage.setItem('internpath_user', JSON.stringify(userData));
      localStorage.setItem('internpath_role', userRole);
      if (userProfile) localStorage.setItem('internpath_profile', JSON.stringify(userProfile));

      setUser(userData);
      setRole(userRole);
      setProfile(userProfile);
      return { success: true, role: userRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Please check form values.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('internpath_token');
    localStorage.removeItem('internpath_user');
    localStorage.removeItem('internpath_role');
    localStorage.removeItem('internpath_profile');
    localStorage.removeItem('internmatch_token');
    localStorage.removeItem('internmatch_user');
    localStorage.removeItem('internmatch_role');
    localStorage.removeItem('internmatch_profile');
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('internpath_profile', JSON.stringify(updatedProfile));
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

