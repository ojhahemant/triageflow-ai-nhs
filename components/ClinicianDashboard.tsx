
import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { analyzeReferral } from '../services/openaiService';

interface ClinicianDashboardProps {
  patient: Patient;
  onUpdatePatient: (p: Patient, msg: string) => void;
}

const ClinicianDashboard: React.FC<ClinicianDashboardProps> = ({ patient, onUpdatePatient }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    setResults(null);
  }, [patient.id]);

  const handleAIRun = async () => {
    setAnalyzing(true);
    const data = await analyzeReferral(patient);
    setResults(data);
    setAnalyzing(false);
  };

  const triageAction = (urgency: 'Urgent' | 'Routine', outcome: string) => {
    onUpdatePatient(
      { ...patient, status: 'Awaiting Scheduling', urgency, procedure: outcome },
      `Patient ${patient.name} triaged as ${urgency}. Outcome: ${outcome}. Sent to List Office.`
    );
  };

  const isAnticoagulant = patient.comorbidities.some(c => c.toLowerCase().includes('warfarin') || c.toLowerCase().includes('anticoagulant'));

  if (!patient || patient.status !== 'Triage Pending') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-medium">No patients pending triage.</p>
        <p className="text-sm">Select a patient from the sidebar or wait for new referrals.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Context & Safety */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Patient Profile</h2>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                patient.urgency === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
              }`}>
                GP Suggested: {patient.urgency}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Full Name</p>
                <p className="font-semibold text-slate-900">{patient.name}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">MRN</p>
                <p className="font-semibold text-slate-900">{patient.mrn}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">DOB</p>
                <p className="font-semibold text-slate-900">{patient.dob}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Received</p>
                <p className="font-semibold text-slate-900">{patient.referralDate}</p>
              </div>
            </div>

            {isAnticoagulant && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start space-x-3">
                <div className="bg-red-500 text-white p-1 rounded">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-800 uppercase">Anticoagulant Safety Alert</h4>
                  <p className="text-sm text-red-700">Patient on Warfarin. Requires INR check pre-op. Adjust procedure coding.</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Referral Interpretation</h2>
              {!results && (
                <button 
                  onClick={handleAIRun}
                  disabled={analyzing}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
                >
                  <svg className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{analyzing ? 'Reading Notes...' : 'AI Decision Support'}</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">GP Clinical Narrative</p>
                  <p className="text-slate-700 text-sm leading-relaxed italic">"{patient.gpNote}"</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Comorbidities & History</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.comorbidities.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-600">{c}</span>
                    ))}
                    {patient.comorbidities.length === 0 && <span className="text-slate-400 text-xs italic">No documented history</span>}
                  </div>
                </div>
              </div>

              {results && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <h4 className="text-sm font-bold text-indigo-900 tracking-tight">AI CLINICAL SUMMARY</h4>
                      <span className="text-[10px] bg-indigo-600 text-white px-1.5 rounded uppercase font-bold">Augmented</span>
                    </div>
                    <p className="text-indigo-800 text-sm leading-relaxed mb-6 font-medium">"{results.summary}"</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/60 p-3 rounded-lg border border-indigo-200/50">
                        <p className="text-[10px] text-indigo-500 uppercase font-bold mb-1">Recommended Urgency</p>
                        <p className="text-indigo-900 font-bold text-sm">{results.urgencyRecommendation}</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-indigo-200/50">
                        <p className="text-[10px] text-indigo-500 uppercase font-bold mb-1">Suggested Outcome</p>
                        <p className="text-indigo-900 font-bold text-sm">{results.suggestedPathway}</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg border border-indigo-200/50">
                        <p className="text-[10px] text-indigo-500 uppercase font-bold mb-1">Pathway Logic</p>
                        <p className="text-indigo-900 font-bold text-sm">Automated Triage</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Final Triage Outcome</h2>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md group"
                onClick={() => triageAction('Urgent', 'Excision (See & Treat)')}
              >
                <span>Excision (See & Treat)</span>
                <span className="text-[10px] bg-white/20 px-1.5 rounded uppercase">Urgent</span>
              </button>
              <button 
                className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md"
                onClick={() => triageAction('Urgent', 'Two Week Wait Clinic')}
              >
                <span>2WW Suspected Cancer</span>
                <span className="text-[10px] bg-white/20 px-1.5 rounded uppercase font-bold">Priority</span>
              </button>
              <div className="pt-2">
                <button 
                  className="w-full p-3 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 rounded-lg font-bold transition-all"
                  onClick={() => triageAction('Routine', 'Routine Clinic')}
                >
                  Routine Outpatient Clinic
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex items-center text-xs text-slate-400 italic">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Signed as Dr. Sarah Wilson
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Pre-Assessment Needs</h2>
            <div className="space-y-3">
              {[
                { label: 'Photos Required', done: false },
                { label: 'Histopathology Checked', done: true },
                { label: 'GP Summary Verified', done: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                    {item.done && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-200'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicianDashboard;
