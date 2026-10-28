import React from 'react';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            InternPath <span className="text-blue-600 font-extrabold">AI</span>
          </span>
          <span className="text-xs text-slate-400 font-medium">| Intelligent Career Placement & Internship Platform</span>
        </div>
        
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} InternPath AI. Verified Academic & Enterprise Placement Ecosystem.
        </p>
      </div>
    </footer>
  );
}

