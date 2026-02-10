
import React from 'react';
import { Patient } from '../types';

interface AdminDashboardProps {
  patients: Patient[];
  onUpdatePatient: (p: Patient, msg: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ patients, onUpdatePatient }) => {
  const handleValidate = (patient: Patient) => {
    onUpdatePatient(
      { ...patient, status: 'Triage Pending' },
      `Referral for ${patient.name} validated and sent to Triage.`
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Referral Intake</h2>
          <p className="text-slate-500 italic">Simulating the "Gatekeeper" persona: Validating incoming GP data.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          {patients.length} New Referrals Pending
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Unprocessed', count: patients.length, color: 'blue' },
          { label: 'Awaiting Info', count: 2, color: 'amber' },
          { label: 'Triage Ready', count: 28, color: 'emerald' },
          { label: 'Rejected', count: 1, color: 'slate' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Validation Queue</h3>
          <div className="flex items-center space-x-2">
            <input type="text" placeholder="Search by name or MRN..." className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        
        {patients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">All referrals validated. Good job!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {patients.map(patient => (
              <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{patient.name}</p>
                    <p className="text-xs text-slate-500">MRN: {patient.mrn} • GP Note: {patient.gpNote.substring(0, 40)}...</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600" title="Demographics Verified">ID</div>
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600" title="GP Attachment Present">GP</div>
                  </div>
                  <button 
                    onClick={() => handleValidate(patient)}
                    className="px-4 py-2 bg-nhs-blue text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
                  >
                    Validate & Pass to Triage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
