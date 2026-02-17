
import React from 'react';
import { Persona } from '../types';
import { PERSONA_CONFIG } from '../constants';

interface PersonaSelectorProps {
  onSelect: (p: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-600 mb-4 md:mb-6 shadow-xl shadow-blue-500/20">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">TriageFlow <span className="text-blue-500">AI</span></h1>
          <p className="text-slate-400 text-sm md:text-lg">Select a persona workspace to begin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {(Object.entries(PERSONA_CONFIG) as [Persona, any][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="group text-left bg-slate-800 border border-slate-700 p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-slate-700/50 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   {/* Using standard SVG paths for icons instead of Lucide to avoid extra deps */}
                   <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {key === Persona.CLINICIAN && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                    {key === Persona.WAITING_LIST && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />}
                    {key === Persona.PAC && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                    {key === Persona.MANAGEMENT && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                   </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{config.title}</h3>
                  <p className="text-blue-500 font-medium text-xs md:text-sm">{config.subtitle}</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                {config.description}
              </p>
            </button>
          ))}
        </div>
        
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 px-4">
            TriageFlow AI is an augmentation layer built for NHS operational systems.
          </p>

          {/* Other Applications */}
          <div className="border-t border-slate-700 pt-6 md:pt-8">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 md:mb-4 font-semibold">Other Links</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <a
                href="https://kanai.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-blue-500/50 transition-all w-full sm:w-auto justify-center"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-slate-300 text-xs md:text-sm font-medium group-hover:text-white transition-colors">Kanai.co</span>
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="http://triagemedical.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-blue-500/50 transition-all w-full sm:w-auto justify-center"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="text-slate-300 text-xs md:text-sm font-medium group-hover:text-white transition-colors">Triage Medical</span>
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/kanaiuk?igsh=MTdla3Z6Y244MWsweQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-pink-500/50 transition-all w-full sm:w-auto justify-center"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-slate-300 text-xs md:text-sm font-medium group-hover:text-white transition-colors">@kanaiuk</span>
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-500 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;
