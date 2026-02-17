
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

  const getDepartmentColor = (dept: string) => {
    return dept === 'Dermatology' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';
  };

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

  // Calculate patient timeline
  const getTimeline = () => {
    const referralDate = new Date(patient.referralDate);
    const today = new Date();
    const targetDate = new Date(referralDate);
    targetDate.setDate(targetDate.getDate() + (patient.urgency === '2WW' ? 14 : patient.urgency === 'Urgent' ? 7 : 30));
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { referralDate, today, targetDate, daysRemaining };
  };

  const timeline = getTimeline();

  // Calculate risk scores
  const getRiskScores = () => {
    let clinicalRisk = 'LOW';
    let surgicalRisk = 'LOW';
    let cancerRisk = 'LOW';

    if (patient.urgency === '2WW' || patient.gpNote.toLowerCase().includes('cancer') || patient.gpNote.toLowerCase().includes('malignant')) {
      cancerRisk = 'HIGH';
    }
    if (isAnticoagulant || patient.comorbidities.length > 2) {
      surgicalRisk = 'MEDIUM';
    }
    if (patient.waitingDays && patient.waitingDays > 10) {
      clinicalRisk = 'HIGH';
    }

    return { clinicalRisk, surgicalRisk, cancerRisk };
  };

  const risks = getRiskScores();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Patient Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Patient Pathway Timeline</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200"></div>
          <div className="absolute top-5 left-0 h-1 bg-blue-500 transition-all" style={{width: '50%'}}></div>

          {[
            { label: 'Referred', date: patient.referralDate, status: 'complete' },
            { label: 'Intake Validated', date: new Date(new Date(patient.referralDate).getTime() + 1000*60*60*24).toISOString().split('T')[0], status: 'complete' },
            { label: 'Triage (NOW)', date: 'Today', status: 'current' },
            { label: 'Target Date', date: timeline.targetDate.toISOString().split('T')[0], status: 'pending' }
          ].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step.status === 'complete' ? 'bg-emerald-500 text-white' :
                step.status === 'current' ? 'bg-blue-600 text-white animate-pulse' :
                'bg-slate-200 text-slate-500'
              }`}>
                {step.status === 'complete' ? '✓' : i + 1}
              </div>
              <p className="mt-2 text-xs font-bold text-slate-700">{step.label}</p>
              <p className="text-[10px] text-slate-500">{step.date}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-3">
          <span className="text-sm text-slate-600">Time remaining to target:</span>
          <span className={`font-bold ${timeline.daysRemaining < 3 ? 'text-red-600' : timeline.daysRemaining < 7 ? 'text-amber-600' : 'text-green-600'}`}>
            {timeline.daysRemaining} days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Context & Safety */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Patient Profile</h2>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold uppercase ${getDepartmentColor(patient.department)}`}>
                  {patient.department}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  patient.urgency === 'Urgent' || patient.urgency === '2WW' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  GP Suggested: {patient.urgency}
                </span>
                {patient.waitingDays !== undefined && patient.waitingDays > 7 && (
                  <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-amber-100 text-amber-700">
                    Waiting: {patient.waitingDays} days
                  </span>
                )}
              </div>
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
                    <div className="mt-4 p-4 bg-white/80 rounded-lg border border-indigo-200">
                      <p className="text-[10px] text-indigo-500 uppercase font-bold mb-2">AI Confidence Levels</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-indigo-700">Urgency Assessment</span>
                            <span className="font-bold text-indigo-900">94%</span>
                          </div>
                          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{width: '94%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-indigo-700">Pathway Recommendation</span>
                            <span className="font-bold text-indigo-900">88%</span>
                          </div>
                          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{width: '88%'}}></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-indigo-600 italic mt-2">Based on 1,847 similar cases</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk Scoring Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Clinical Risk Assessment</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Cancer Risk</p>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                  risks.cancerRisk === 'HIGH' ? 'bg-red-100' :
                  risks.cancerRisk === 'MEDIUM' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  <span className={`text-2xl font-black ${
                    risks.cancerRisk === 'HIGH' ? 'text-red-600' :
                    risks.cancerRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {risks.cancerRisk === 'HIGH' ? '🔴' : risks.cancerRisk === 'MEDIUM' ? '🟡' : '🟢'}
                  </span>
                </div>
                <p className={`text-sm font-bold ${
                  risks.cancerRisk === 'HIGH' ? 'text-red-600' :
                  risks.cancerRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                }`}>{risks.cancerRisk}</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Surgical Risk</p>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                  risks.surgicalRisk === 'HIGH' ? 'bg-red-100' :
                  risks.surgicalRisk === 'MEDIUM' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  <span className={`text-2xl font-black ${
                    risks.surgicalRisk === 'HIGH' ? 'text-red-600' :
                    risks.surgicalRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {risks.surgicalRisk === 'HIGH' ? '🔴' : risks.surgicalRisk === 'MEDIUM' ? '🟡' : '🟢'}
                  </span>
                </div>
                <p className={`text-sm font-bold ${
                  risks.surgicalRisk === 'HIGH' ? 'text-red-600' :
                  risks.surgicalRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                }`}>{risks.surgicalRisk}</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Delay Risk</p>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                  risks.clinicalRisk === 'HIGH' ? 'bg-red-100' :
                  risks.clinicalRisk === 'MEDIUM' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  <span className={`text-2xl font-black ${
                    risks.clinicalRisk === 'HIGH' ? 'text-red-600' :
                    risks.clinicalRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {risks.clinicalRisk === 'HIGH' ? '🔴' : risks.clinicalRisk === 'MEDIUM' ? '🟡' : '🟢'}
                  </span>
                </div>
                <p className={`text-sm font-bold ${
                  risks.clinicalRisk === 'HIGH' ? 'text-red-600' :
                  risks.clinicalRisk === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
                }`}>{risks.clinicalRisk}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900 font-medium">
                <strong>Overall Assessment:</strong> {
                  risks.cancerRisk === 'HIGH' || risks.clinicalRisk === 'HIGH' ? 'Proceed with URGENT pathway' :
                  risks.surgicalRisk === 'MEDIUM' ? 'Requires pre-operative assessment' :
                  'Suitable for routine pathway'
                }
              </p>
            </div>
          </div>

          {/* Similar Cases Panel */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Similar Cases (Last 6 Months)
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-slate-700">Total similar cases in {patient.department}</span>
                <span className="text-xl font-black text-purple-600">
                  {patient.department === 'Dermatology' ? '87' : '62'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-slate-700">Triaged as Urgent</span>
                <span className="text-lg font-bold text-slate-900">
                  {patient.urgency === 'Urgent' || patient.urgency === '2WW' ? '72%' : '18%'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-slate-700">Confirmed via procedure</span>
                <span className="text-lg font-bold text-slate-900">94%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-sm text-slate-700">Avg time to treatment</span>
                <span className="text-lg font-bold text-emerald-600">11 days</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-xs text-purple-900 italic">
                Based on analysis of {patient.department === 'Dermatology' ? '1,847' : '1,234'} similar referrals
              </p>
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
