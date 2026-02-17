
import React from 'react';
import { Persona } from '../types';
import { PERSONA_CONFIG } from '../constants';

interface NavbarProps {
  currentPersona: Persona;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPersona, onMenuClick }) => {
  const config = PERSONA_CONFIG[currentPersona];

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-3 md:px-6 shrink-0">
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-sm md:text-lg font-semibold text-slate-800">
          <span className="hidden sm:inline">{config.title} - </span>
          <span className="text-slate-500 font-normal">Dashboard</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Dr. Sarah Wilson</p>
            <p className="text-xs text-slate-500">{config.subtitle}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-nhs-blue flex items-center justify-center text-white font-semibold">
            SW
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
