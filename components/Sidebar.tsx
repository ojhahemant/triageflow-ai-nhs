
import React from 'react';
import { Persona, Patient } from '../types';
import { PERSONA_CONFIG } from '../constants';

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (p: Persona | null) => void;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPersona, 
  onPersonaChange, 
  patients, 
  selectedPatientId, 
  onSelectPatient 
}) => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">TriageFlow <span className="text-blue-600">AI</span></span>
        </div>

        <button 
          onClick={() => onPersonaChange(null)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors border border-slate-200"
        >
          <span>Switch Persona</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {currentPersona === Persona.CLINICIAN ? (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Patient Queue</h3>
            <div className="space-y-1">
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => onSelectPatient(patient.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedPatientId === patient.id 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <p className="font-medium truncate">{patient.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      patient.urgency === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {patient.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400">{patient.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>History</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </nav>
        )}
      </div>

      <div className="p-6 border-t border-slate-200">
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs text-slate-400 mb-1">System Health</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
