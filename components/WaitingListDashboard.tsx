
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient } from '../types';

interface WaitingListDashboardProps {
  patients: Patient[];
  onUpdatePatient: (p: Patient, msg: string) => void;
}

const WaitingListDashboard: React.FC<WaitingListDashboardProps> = ({ patients, onUpdatePatient }) => {
  const [selectedView, setSelectedView] = useState<'table' | 'calendar'>('table');

  const handleSchedule = (patient: Patient) => {
    onUpdatePatient(
      { ...patient, status: 'Confirmed' },
      `Successfully scheduled ${patient.name} for their ${patient.procedure || 'procedure'}.`
    );
  };

  // Weekly Theatre Schedule
  const theatreSchedule = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days.map(day => ({
      day,
      sessions: [
        { time: '08:00-12:00', theatre: 'Main Theatre A', type: 'Dermatology', cases: 4, filled: 3, surgeon: 'Dr. Smith' },
        { time: '13:00-17:00', theatre: 'Main Theatre A', type: 'Plastic Surgery', cases: 3, filled: 2, surgeon: 'Dr. Jones' },
        { time: '08:00-13:00', theatre: 'Day Surgery', type: 'Minor Ops', cases: 6, filled: 5, surgeon: 'Dr. Williams' },
      ]
    }));
  }, []);

  // Staff Availability
  const staffAvailability = useMemo(() => {
    return [
      { name: 'Dr. Smith', specialty: 'Dermatology', available: 4, booked: 3, capacity: 5 },
      { name: 'Dr. Jones', specialty: 'Plastic Surgery', available: 3, booked: 4, capacity: 5 },
      { name: 'Dr. Williams', specialty: 'General Surgery', available: 2, booked: 3, capacity: 4 },
      { name: 'Dr. Brown', specialty: 'Dermatology', available: 4, booked: 2, capacity: 5 },
      { name: 'Dr. Davis', specialty: 'Plastic Surgery', available: 3, booked: 3, capacity: 4 },
    ];
  }, []);

  // Procedure Duration Estimates
  const procedureDurations = useMemo(() => {
    return [
      { procedure: 'Wide Local Excision', avgTime: 45, complexity: 'Medium', anesthesia: 'Local' },
      { procedure: 'Skin Graft', avgTime: 90, complexity: 'High', anesthesia: 'General' },
      { procedure: 'Carpal Tunnel Release', avgTime: 30, complexity: 'Low', anesthesia: 'Local' },
      { procedure: 'Breast Reconstruction', avgTime: 180, complexity: 'High', anesthesia: 'General' },
      { procedure: 'Burn Debridement', avgTime: 60, complexity: 'Medium', anesthesia: 'General' },
      { procedure: 'Cyst Removal', avgTime: 20, complexity: 'Low', anesthesia: 'Local' },
    ];
  }, []);

  // Gap Analysis
  const gapAnalysis = useMemo(() => {
    const totalSlots = theatreSchedule.reduce((sum, day) =>
      sum + day.sessions.reduce((s, session) => s + session.cases, 0), 0
    );
    const filledSlots = theatreSchedule.reduce((sum, day) =>
      sum + day.sessions.reduce((s, session) => s + session.filled, 0), 0
    );
    const availableSlots = totalSlots - filledSlots;

    const urgentCases = patients.filter(p => p.urgency === 'Urgent' || p.urgency === '2WW').length;
    const routineCases = patients.filter(p => p.urgency === 'Routine' || p.urgency === 'Inter Regular').length;

    return {
      totalSlots,
      filledSlots,
      availableSlots,
      urgentCases,
      routineCases,
      utilizationRate: Math.round((filledSlots / totalSlots) * 100)
    };
  }, [theatreSchedule, patients]);

  // Weekly capacity by department
  const weeklyCapacity = useMemo(() => {
    return [
      { day: 'Mon', dermatology: 8, plasticSurgery: 6, capacity: 15 },
      { day: 'Tue', dermatology: 7, plasticSurgery: 7, capacity: 15 },
      { day: 'Wed', dermatology: 9, plasticSurgery: 5, capacity: 15 },
      { day: 'Thu', dermatology: 6, plasticSurgery: 8, capacity: 15 },
      { day: 'Fri', dermatology: 8, plasticSurgery: 6, capacity: 15 },
    ];
  }, []);

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

      {/* Gap Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Total Slots</h4>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-black text-slate-800">{gapAnalysis.totalSlots}</p>
          <div className="mt-2 text-xs text-slate-500">This week</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-blue-600 uppercase">Filled</h4>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-blue-700">{gapAnalysis.filledSlots}</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{width: `${(gapAnalysis.filledSlots / gapAnalysis.totalSlots) * 100}%`}}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-emerald-600 uppercase">Available</h4>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{gapAnalysis.availableSlots}</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{width: `${(gapAnalysis.availableSlots / gapAnalysis.totalSlots) * 100}%`}}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-red-600 uppercase">Urgent Cases</h4>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-red-700">{gapAnalysis.urgentCases}</p>
          <div className="mt-2 text-xs text-slate-500">Need immediate slots</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-purple-600 uppercase">Utilization</h4>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-2xl font-black text-purple-700">{gapAnalysis.utilizationRate}%</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{width: `${gapAnalysis.utilizationRate}%`}}></div>
          </div>
        </div>
      </div>

      {/* Weekly Theatre Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Weekly Theatre Schedule</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedView === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setSelectedView('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedView === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {selectedView === 'calendar' ? (
          <div className="p-4">
            <div className="space-y-4">
              {theatreSchedule.map(({ day, sessions }) => (
                <div key={day} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-600 text-white text-sm font-bold p-3">
                    {day}
                  </div>
                  <div className="p-3 space-y-2 bg-slate-50">
                    {sessions.map((session, idx) => {
                      const availableSlots = session.cases - session.filled;
                      const utilization = (session.filled / session.cases) * 100;
                      return (
                        <div key={idx} className={`p-3 rounded-lg border ${
                          session.type === 'Dermatology' ? 'bg-green-50 border-green-200' :
                          session.type === 'Plastic Surgery' ? 'bg-purple-50 border-purple-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-sm text-slate-800">{session.theatre}</div>
                              <div className="text-xs text-slate-600">{session.time} • {session.surgeon}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                              session.type === 'Dermatology' ? 'bg-green-600 text-white' :
                              session.type === 'Plastic Surgery' ? 'bg-purple-600 text-white' :
                              'bg-blue-600 text-white'
                            }`}>
                              {session.type}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">
                              <span className="font-bold text-slate-800">{session.filled}</span> / {session.cases} cases
                            </span>
                            <span className={`font-bold ${availableSlots > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                            <div className={`h-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{width: `${utilization}%`}}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Staff Availability & Weekly Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Staff Availability (This Week)</h3>
          <div className="space-y-3">
            {staffAvailability.map((staff, idx) => {
              const utilization = (staff.booked / staff.capacity) * 100;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-sm text-slate-800">{staff.name}</div>
                      <div className={`text-xs ${
                        staff.specialty === 'Dermatology' ? 'text-green-600' :
                        staff.specialty === 'Plastic Surgery' ? 'text-purple-600' :
                        'text-blue-600'
                      }`}>{staff.specialty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-800">{staff.available} slots</div>
                      <div className="text-xs text-slate-500">of {staff.capacity} available</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${utilization}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Weekly Capacity Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="dermatology" fill="#22c55e" name="Dermatology" />
              <Bar dataKey="plasticSurgery" fill="#a855f7" name="Plastic Surgery" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-slate-600">Dermatology</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-slate-600">Plastic Surgery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Procedure Duration Estimates */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Procedure Duration Estimates</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Procedure</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Avg Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Complexity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Anesthesia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {procedureDurations.map((proc, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-800">{proc.procedure}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{proc.avgTime} min</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      proc.complexity === 'High' ? 'bg-red-100 text-red-700' :
                      proc.complexity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {proc.complexity}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{proc.anesthesia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedView === 'table' && (
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
          )}
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
