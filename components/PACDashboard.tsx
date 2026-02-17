
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Patient } from '../types';

interface PACDashboardProps {
  patients: Patient[];
  onUpdatePatient: (p: Patient, msg: string) => void;
}

const PACDashboard: React.FC<PACDashboardProps> = ({ patients, onUpdatePatient }) => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedWeekView, setSelectedWeekView] = useState<'calendar' | 'list'>('calendar');

  // Clinic availability data - organized by department
  const clinics = [
    // Dermatology Clinics
    { id: 'derm-urgent', name: 'Dermatology Urgent Clinic', department: 'Dermatology', slots: 12, booked: 8, urgencyMatch: ['Urgent', '2WW'] },
    { id: 'derm-routine', name: 'Dermatology Routine Clinic', department: 'Dermatology', slots: 20, booked: 15, urgencyMatch: ['Routine', 'Inter Regular'] },
    { id: 'derm-minor', name: 'Dermatology Minor Ops', department: 'Dermatology', slots: 10, booked: 7, urgencyMatch: ['Routine'] },
    { id: 'derm-2ww', name: '2WW Dermatology Cancer', department: 'Dermatology', slots: 6, booked: 4, urgencyMatch: ['2WW'] },

    // Plastic Surgery Clinics
    { id: 'plastics-trauma', name: 'Plastic Surgery Trauma', department: 'Plastic Surgery', slots: 8, booked: 5, urgencyMatch: ['Urgent'] },
    { id: 'plastics-hand', name: 'Plastic Surgery Hand Clinic', department: 'Plastic Surgery', slots: 15, booked: 10, urgencyMatch: ['Routine', 'Inter Regular'] },
    { id: 'plastics-reconstruction', name: 'Plastic Surgery Reconstruction', department: 'Plastic Surgery', slots: 10, booked: 8, urgencyMatch: ['Routine', 'Inter Regular'] },
    { id: 'plastics-burns', name: 'Plastic Surgery Burns Unit', department: 'Plastic Surgery', slots: 6, booked: 3, urgencyMatch: ['Urgent', '2WW'] },
    { id: 'plastics-2ww', name: '2WW Plastic Surgery Cancer', department: 'Plastic Surgery', slots: 5, booked: 3, urgencyMatch: ['2WW'] },
  ];

  const handleBookAppointment = (patient: Patient, clinicName: string) => {
    onUpdatePatient(
      { ...patient, status: 'Scheduled' },
      `${patient.name} booked into ${clinicName} (${patient.urgency} priority).`
    );
  };

  // Filter patients who need booking (Intake Review or Awaiting Scheduling)
  const bookablePatients = patients.filter(p =>
    p.status === 'Intake Review' || p.status === 'Awaiting Scheduling'
  );

  // Get suitable clinics for a patient based on urgency and department
  const getSuitableClinics = (urgency: string, department: string) => {
    return clinics.filter(clinic =>
      clinic.department === department &&
      clinic.urgencyMatch.includes(urgency) &&
      (clinic.slots - clinic.booked) > 0
    );
  };

  // Generate weekly calendar data
  const weeklyCalendar = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days.map(day => ({
      day,
      clinics: clinics.map(clinic => ({
        ...clinic,
        sessions: Math.floor(Math.random() * 3) + 1 // 1-3 sessions per day
      }))
    }));
  }, []);

  // Historical booking trends (last 8 weeks)
  const bookingTrends = useMemo(() => {
    return [
      { week: 'W1', dermatology: 45, plasticSurgery: 38, target: 80 },
      { week: 'W2', dermatology: 52, plasticSurgery: 41, target: 80 },
      { week: 'W3', dermatology: 48, plasticSurgery: 45, target: 80 },
      { week: 'W4', dermatology: 55, plasticSurgery: 42, target: 80 },
      { week: 'W5', dermatology: 58, plasticSurgery: 48, target: 80 },
      { week: 'W6', dermatology: 61, plasticSurgery: 51, target: 80 },
      { week: 'W7', dermatology: 59, plasticSurgery: 53, target: 80 },
      { week: 'W8', dermatology: 63, plasticSurgery: 55, target: 80 },
    ];
  }, []);

  // Wait time analysis
  const waitTimeAnalysis = useMemo(() => {
    const patientsWithWait = bookablePatients.filter(p => p.waitingDays !== undefined);
    const avgWait = patientsWithWait.length > 0
      ? Math.round(patientsWithWait.reduce((sum, p) => sum + (p.waitingDays || 0), 0) / patientsWithWait.length)
      : 0;

    const under7Days = patientsWithWait.filter(p => (p.waitingDays || 0) <= 7).length;
    const between7And14 = patientsWithWait.filter(p => (p.waitingDays || 0) > 7 && (p.waitingDays || 0) <= 14).length;
    const over14Days = patientsWithWait.filter(p => (p.waitingDays || 0) > 14).length;

    return { avgWait, under7Days, between7And14, over14Days, total: patientsWithWait.length };
  }, [bookablePatients]);

  // Smart recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    // Check for bottlenecks
    const fullClinics = clinics.filter(c => (c.slots - c.booked) === 0);
    if (fullClinics.length > 0) {
      recs.push({
        type: 'warning',
        message: `${fullClinics.length} clinic(s) at full capacity`,
        action: 'Consider opening additional slots'
      });
    }

    // Check for long wait times
    if (waitTimeAnalysis.over14Days > 0) {
      recs.push({
        type: 'urgent',
        message: `${waitTimeAnalysis.over14Days} patient(s) waiting >14 days`,
        action: 'Prioritize for urgent booking'
      });
    }

    // Check for unmatched urgent cases
    const urgentUnbooked = bookablePatients.filter(p =>
      (p.urgency === 'Urgent' || p.urgency === '2WW') &&
      getSuitableClinics(p.urgency, p.department).length === 0
    );
    if (urgentUnbooked.length > 0) {
      recs.push({
        type: 'urgent',
        message: `${urgentUnbooked.length} urgent case(s) without available clinics`,
        action: 'Escalate to management'
      });
    }

    // Positive feedback
    if (waitTimeAnalysis.under7Days === waitTimeAnalysis.total && waitTimeAnalysis.total > 0) {
      recs.push({
        type: 'success',
        message: 'All patients within 7-day target',
        action: 'Maintain current booking rate'
      });
    }

    return recs;
  }, [bookablePatients, waitTimeAnalysis]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients Appointments Centre (PAC)</h2>
          <p className="text-slate-500 italic">Book patients into clinics based on urgency and availability</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          {bookablePatients.length} Patients Awaiting Booking
        </div>
      </div>

      {/* Smart Recommendations Panel */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Smart Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`p-3 rounded-lg border flex items-start space-x-3 ${
                rec.type === 'urgent' ? 'bg-red-50 border-red-200' :
                rec.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                'bg-emerald-50 border-emerald-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  rec.type === 'urgent' ? 'bg-red-600' :
                  rec.type === 'warning' ? 'bg-amber-600' :
                  'bg-emerald-600'
                }`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    rec.type === 'urgent' ? 'text-red-800' :
                    rec.type === 'warning' ? 'text-amber-800' :
                    'text-emerald-800'
                  }`}>{rec.message}</p>
                  <p className={`text-xs mt-0.5 ${
                    rec.type === 'urgent' ? 'text-red-600' :
                    rec.type === 'warning' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>{rec.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wait Time Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Avg Wait Time</h4>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-black text-slate-800">{waitTimeAnalysis.avgWait} days</p>
          <div className="mt-2 text-xs text-slate-500">Across {waitTimeAnalysis.total} patients</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-emerald-600 uppercase">{'<7 Days'}</h4>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{waitTimeAnalysis.under7Days}</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{width: `${(waitTimeAnalysis.under7Days / waitTimeAnalysis.total) * 100}%`}}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-amber-600 uppercase">7-14 Days</h4>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-amber-700">{waitTimeAnalysis.between7And14}</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{width: `${(waitTimeAnalysis.between7And14 / waitTimeAnalysis.total) * 100}%`}}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-red-600 uppercase">{'>14 Days'}</h4>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-black text-red-700">{waitTimeAnalysis.over14Days}</p>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500" style={{width: `${(waitTimeAnalysis.over14Days / waitTimeAnalysis.total) * 100}%`}}></div>
          </div>
        </div>
      </div>

      {/* Historical Booking Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">Booking Trends (Last 8 Weeks)</h3>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-slate-600">Dermatology</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-slate-600">Plastic Surgery</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-dashed border-slate-400"></div>
              <span className="text-slate-600">Target (80)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={bookingTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Line type="monotone" dataKey="dermatology" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
            <Line type="monotone" dataKey="plasticSurgery" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
            <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Weekly Clinic Schedule</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedWeekView('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedWeekView === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setSelectedWeekView('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedWeekView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {selectedWeekView === 'calendar' ? (
          <div className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {weeklyCalendar.map(({ day, clinics: dayClinics }) => (
                <div key={day} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-600 text-white text-xs font-bold p-2 text-center">
                    {day}
                  </div>
                  <div className="p-2 space-y-1.5 bg-slate-50 min-h-[200px]">
                    {dayClinics.slice(0, 4).map(clinic => (
                      <div key={clinic.id} className={`p-1.5 rounded text-[10px] ${
                        clinic.department === 'Dermatology' ? 'bg-green-100 border border-green-300' : 'bg-purple-100 border border-purple-300'
                      }`}>
                        <div className={`font-bold ${clinic.department === 'Dermatology' ? 'text-green-800' : 'text-purple-800'}`}>
                          {clinic.name.split(' ')[0]}
                        </div>
                        <div className="text-slate-600 mt-0.5">{clinic.sessions} session(s)</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {weeklyCalendar.map(({ day, clinics: dayClinics }) => (
              <div key={day} className="p-4">
                <h4 className="font-semibold text-slate-700 mb-3">{day}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayClinics.map(clinic => {
                    const available = clinic.slots - clinic.booked;
                    return (
                      <div key={clinic.id} className={`p-3 rounded-lg border ${
                        clinic.department === 'Dermatology' ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
                      }`}>
                        <div className={`text-xs font-bold ${clinic.department === 'Dermatology' ? 'text-green-800' : 'text-purple-800'}`}>
                          {clinic.name}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {clinic.sessions} session(s) • {available} slots available
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Department Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSelectedClinic('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            selectedClinic === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Departments
        </button>
        <button
          onClick={() => setSelectedClinic('dermatology')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            selectedClinic === 'dermatology'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Dermatology
        </button>
        <button
          onClick={() => setSelectedClinic('plastic-surgery')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            selectedClinic === 'plastic-surgery'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Plastic Surgery
        </button>
      </div>

      {/* Clinic Availability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clinics
          .filter(clinic =>
            selectedClinic === 'all' ||
            (selectedClinic === 'dermatology' && clinic.department === 'Dermatology') ||
            (selectedClinic === 'plastic-surgery' && clinic.department === 'Plastic Surgery')
          )
          .map((clinic) => {
          const available = clinic.slots - clinic.booked;
          const percentage = (clinic.booked / clinic.slots) * 100;
          const deptColor = clinic.department === 'Dermatology' ? 'text-green-600' : 'text-purple-600';

          return (
            <div key={clinic.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${deptColor}`}>{clinic.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    {clinic.urgencyMatch.join(', ')}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${available > 3 ? 'bg-emerald-500' : available > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Available</span>
                  <span className={`font-bold ${available > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {available} / {clinic.slots}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patients Booking Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Booking Queue</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Urgencies</option>
              <option value="urgent">Urgent Only</option>
              <option value="routine">Routine Only</option>
            </select>
            <input
              type="text"
              placeholder="Search by name or MRN..."
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {bookablePatients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">All patients booked. Excellent work!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookablePatients
              .filter(p =>
                selectedClinic === 'all' ||
                (selectedClinic === 'dermatology' && p.department === 'Dermatology') ||
                (selectedClinic === 'plastic-surgery' && p.department === 'Plastic Surgery') ||
                (selectedClinic === 'urgent' && (p.urgency === 'Urgent' || p.urgency === '2WW')) ||
                (selectedClinic === 'routine' && (p.urgency === 'Routine' || p.urgency === 'Inter Regular'))
              )
              .map(patient => {
              const suitableClinics = getSuitableClinics(patient.urgency, patient.department);
              const isUrgent = patient.urgency === 'Urgent' || patient.urgency === '2WW';
              const deptColor = patient.department === 'Dermatology' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';

              return (
                <div key={patient.id} className={`p-5 transition-all ${isUrgent ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          isUrgent ? 'bg-red-600' : 'bg-blue-600'
                        }`}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">MRN: {patient.mrn} • Referred: {patient.referralDate}</p>
                        </div>
                      </div>

                      <div className="ml-13 space-y-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full uppercase ${deptColor}`}>
                            {patient.department}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                            patient.urgency === 'Urgent' || patient.urgency === '2WW'
                              ? 'bg-red-100 text-red-700'
                              : patient.urgency === 'Routine'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {patient.urgency}
                          </span>
                          {patient.waitingDays !== undefined && (
                            <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                              patient.waitingDays > 7 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {patient.waitingDays}d wait
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600">
                          {patient.procedure || 'Awaiting procedure assignment'}
                        </div>

                        <p className="text-sm text-slate-600 italic">"{patient.gpNote.substring(0, 100)}..."</p>

                        {/* Available Clinics */}
                        {suitableClinics.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-[10px] text-slate-400 uppercase font-bold self-center">Available:</span>
                            {suitableClinics.map(clinic => (
                              <button
                                key={clinic.id}
                                onClick={() => handleBookAppointment(patient, clinic.name)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-all shadow-sm flex items-center space-x-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{clinic.name}</span>
                                <span className="text-[9px] bg-white/20 px-1 rounded">
                                  {clinic.slots - clinic.booked} slots
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-xs text-amber-700 font-medium">No available clinics for this urgency level</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isUrgent && (
                      <div className="ml-4">
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase">
                          Priority
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold uppercase tracking-wide">Urgent Cases</h4>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-black">
            {bookablePatients.filter(p => p.urgency === 'Urgent' || p.urgency === '2WW').length}
          </p>
          <p className="text-xs text-red-100 mt-1">Require immediate booking</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold uppercase tracking-wide">Routine Cases</h4>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-black">
            {bookablePatients.filter(p => p.urgency === 'Routine' || p.urgency === 'Inter Regular').length}
          </p>
          <p className="text-xs text-blue-100 mt-1">Standard booking timeline</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold uppercase tracking-wide">Booking Rate</h4>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-black">
            {Math.round((patients.filter(p => p.status === 'Scheduled' || p.status === 'Confirmed').length / patients.length) * 100)}%
          </p>
          <p className="text-xs text-emerald-100 mt-1">Successfully booked</p>
        </div>
      </div>
    </div>
  );
};

export default PACDashboard;
