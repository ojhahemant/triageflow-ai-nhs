
import React from 'react';
import { Patient } from '../types';

interface WaitingListDashboardProps {
  patients: Patient[];
  onUpdatePatient: (p: Patient, msg: string) => void;
}

const WaitingListDashboard: React.FC<WaitingListDashboardProps> = ({ patients, onUpdatePatient }) => {
  const handleSchedule = (patient: Patient) => {
    onUpdatePatient(
      { ...patient, status: 'Confirmed' },
      `Successfully scheduled ${patient.name} for their ${patient.procedure || 'procedure'}.`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">List Management</h2>
          <p className="text-slate-500">Simulating the "Orchestrator" persona: Mapping triaged outcomes to theatre slots.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Export Theatre Pack
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all">
            Open Theatre Slot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Ready to Schedule</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Procedure</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Urgency</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.filter(p => p.status !== 'Confirmed').map(patient => (
                  <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{patient.name}</p>
                      <p className="text-[10px] text-slate-500 tracking-tight">MRN: {patient.mrn}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{patient.procedure || 'Triage Pending Assessment'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        patient.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {patient.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleSchedule(patient)}
                        className="text-xs font-bold text-white bg-nhs-blue hover:bg-blue-800 px-4 py-2 rounded-lg transition-all shadow-sm"
                      >
                        Find Slot
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.filter(p => p.status !== 'Confirmed').length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-sm">No triaged patients awaiting scheduling.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Confirmed / Recent Bookings */}
          <div className="mt-8">
             <h3 className="font-bold text-slate-500 uppercase text-xs tracking-widest mb-4">Confirmed Bookings (Last 24h)</h3>
             <div className="space-y-2">
                {patients.filter(p => p.status === 'Confirmed').map(p => (
                   <div key={p.id} className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-sm font-bold text-emerald-900">{p.name}</span>
                         <span className="text-xs text-emerald-600 font-medium">— {p.procedure}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded uppercase font-bold">Confirmed</span>
                   </div>
                ))}
                {patients.filter(p => p.status === 'Confirmed').length === 0 && <p className="text-xs text-slate-400 italic">No bookings confirmed yet.</p>}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>Theatre Load</span>
              <span className="text-[10px] text-emerald-500 uppercase">Live</span>
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Main Theatre A', usage: 88, status: 'Full' },
                { name: 'Day Surgery Unit', usage: 45, status: 'Space' },
                { name: 'Minor Ops Suite', usage: 95, status: 'Critical' }
              ].map((slot, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{slot.name}</span>
                    <span className={slot.usage > 90 ? 'text-red-600' : 'text-slate-500'}>{slot.usage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${slot.usage > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${slot.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Smart Sequencing</h3>
            <p className="text-sm text-blue-100 mb-4 leading-relaxed italic">"Sequence urgent excision cases first to maximize morning theatre efficiency."</p>
            <button className="w-full py-2.5 bg-white text-indigo-900 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg">
              Auto-Sequence List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingListDashboard;
