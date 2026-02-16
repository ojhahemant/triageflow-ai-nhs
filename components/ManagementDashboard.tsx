
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from 'recharts';
import { Patient } from '../types';

interface ManagementDashboardProps {
  patients: Patient[];
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ patients }) => {
  // Dynamic Calculations
  const metrics = useMemo(() => {
    const total = patients.length;
    const pendingIntake = patients.filter(p => p.status === 'Intake Review').length;
    const pendingTriage = patients.filter(p => p.status === 'Triage Pending').length;
    const pendingSchedule = patients.filter(p => p.status === 'Awaiting Scheduling').length;
    const confirmed = patients.filter(p => p.status === 'Confirmed').length;

    const urgentCount = patients.filter(p => p.urgency === 'Urgent').length;

    // Department breakdown
    const dermatology = patients.filter(p => p.department === 'Dermatology').length;
    const plasticSurgery = patients.filter(p => p.department === 'Plastic Surgery').length;

    return { total, pendingIntake, pendingTriage, pendingSchedule, confirmed, urgentCount, dermatology, plasticSurgery };
  }, [patients]);

  const backlogData = [
    { name: 'Intake', value: metrics.pendingIntake, color: '#94a3b8' },
    { name: 'Triage', value: metrics.pendingTriage, color: '#f59e0b' },
    { name: 'Scheduling', value: metrics.pendingSchedule, color: '#3b82f6' },
    { name: 'Confirmed', value: metrics.confirmed, color: '#10b981' }
  ];

  const throughputData = [
    { name: 'Mon', referrals: 45 },
    { name: 'Tue', referrals: 52 },
    { name: 'Wed', referrals: metrics.total * 5 }, // Scaled for effect
    { name: 'Thu', referrals: 42 },
    { name: 'Fri', referrals: 38 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Oversight</h2>
          <p className="text-slate-500">Simulating the "Overseer" persona: Real-time system metrics.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase">Live System Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Live Backlog', value: metrics.total, sub: 'Total Referrals', color: 'text-slate-900' },
          { label: 'Dermatology', value: metrics.dermatology, sub: `${Math.round((metrics.dermatology / metrics.total) * 100)}% of total`, color: 'text-green-600' },
          { label: 'Plastic Surgery', value: metrics.plasticSurgery, sub: `${Math.round((metrics.plasticSurgery / metrics.total) * 100)}% of total`, color: 'text-purple-600' },
          { label: 'Triage Queue', value: metrics.pendingTriage, sub: 'Waiting for Clinician', color: 'text-amber-600' },
          { label: 'Urgent Cases', value: metrics.urgentCount, sub: 'Requires <24h Action', color: 'text-red-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-6 tracking-widest flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <span>Pathway Volume Trend</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorRef" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="referrals" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRef)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-6 tracking-widest">Queue Distribution</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={backlogData} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold'}} width={80} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {backlogData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-4 mt-auto border-t border-slate-100 grid grid-cols-2 gap-2">
              <div className="text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Wait</p>
                 <p className="text-sm font-bold text-slate-800">4.1 Days</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Bottleneck</p>
                 <p className="text-sm font-bold text-amber-600">Triage</p>
              </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
         <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 tracking-tight">AI Operational Forecast</h3>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              Based on the current influx of <span className="text-white font-bold">{metrics.urgentCount} urgent cases</span>, theatre suite B will require overflow staffing by Thursday 14:00.
            </p>
         </div>
         <button className="relative z-10 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-xl">
            Authorize Staffing Bump
         </button>
         {/* Background glow */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
