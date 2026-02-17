
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { Patient } from '../types';

interface ManagementDashboardProps {
  patients: Patient[];
}

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ patients }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | 'dermatology' | 'plastic-surgery'>('all');

  // Dynamic Calculations
  const metrics = useMemo(() => {
    const total = patients.length;
    const pendingIntake = patients.filter(p => p.status === 'Intake Review').length;
    const pendingTriage = patients.filter(p => p.status === 'Triage Pending').length;
    const pendingSchedule = patients.filter(p => p.status === 'Awaiting Scheduling').length;
    const confirmed = patients.filter(p => p.status === 'Confirmed').length;

    const urgentCount = patients.filter(p => p.urgency === 'Urgent').length;
    const twoWWCount = patients.filter(p => p.urgency === '2WW').length;

    // Department breakdown
    const dermatology = patients.filter(p => p.department === 'Dermatology').length;
    const plasticSurgery = patients.filter(p => p.department === 'Plastic Surgery').length;

    return { total, pendingIntake, pendingTriage, pendingSchedule, confirmed, urgentCount, twoWWCount, dermatology, plasticSurgery };
  }, [patients]);

  // SLA Compliance Tracking
  const slaCompliance = useMemo(() => {
    const twoWWTarget = 14; // days
    const urgentTarget = 7; // days
    const routineTarget = 28; // days

    const twoWWPatients = patients.filter(p => p.urgency === '2WW');
    const urgentPatients = patients.filter(p => p.urgency === 'Urgent');
    const routinePatients = patients.filter(p => p.urgency === 'Routine' || p.urgency === 'Inter Regular');

    const twoWWCompliant = twoWWPatients.filter(p => (p.waitingDays || 0) <= twoWWTarget).length;
    const urgentCompliant = urgentPatients.filter(p => (p.waitingDays || 0) <= urgentTarget).length;
    const routineCompliant = routinePatients.filter(p => (p.waitingDays || 0) <= routineTarget).length;

    return {
      twoWW: { total: twoWWPatients.length, compliant: twoWWCompliant, rate: twoWWPatients.length > 0 ? Math.round((twoWWCompliant / twoWWPatients.length) * 100) : 100 },
      urgent: { total: urgentPatients.length, compliant: urgentCompliant, rate: urgentPatients.length > 0 ? Math.round((urgentCompliant / urgentPatients.length) * 100) : 100 },
      routine: { total: routinePatients.length, compliant: routineCompliant, rate: routinePatients.length > 0 ? Math.round((routineCompliant / routinePatients.length) * 100) : 100 }
    };
  }, [patients]);

  // Department Comparison
  const departmentComparison = useMemo(() => {
    return [
      {
        department: 'Dermatology',
        total: patients.filter(p => p.department === 'Dermatology').length,
        urgent: patients.filter(p => p.department === 'Dermatology' && (p.urgency === 'Urgent' || p.urgency === '2WW')).length,
        avgWait: 8.3,
        throughput: 92
      },
      {
        department: 'Plastic Surgery',
        total: patients.filter(p => p.department === 'Plastic Surgery').length,
        urgent: patients.filter(p => p.department === 'Plastic Surgery' && (p.urgency === 'Urgent' || p.urgency === '2WW')).length,
        avgWait: 6.7,
        throughput: 88
      }
    ];
  }, [patients]);

  // Resource Utilization (8-week trend)
  const resourceUtilization = useMemo(() => {
    return [
      { week: 'W1', clinicians: 78, theatres: 85, beds: 72 },
      { week: 'W2', clinicians: 82, theatres: 88, beds: 75 },
      { week: 'W3', clinicians: 85, theatres: 90, beds: 80 },
      { week: 'W4', clinicians: 88, theatres: 92, beds: 82 },
      { week: 'W5', clinicians: 86, theatres: 89, beds: 78 },
      { week: 'W6', clinicians: 90, theatres: 93, beds: 85 },
      { week: 'W7', clinicians: 92, theatres: 95, beds: 88 },
      { week: 'W8', clinicians: 91, theatres: 94, beds: 86 },
    ];
  }, []);

  // Cost Analysis
  const costAnalysis = useMemo(() => {
    const avgCostPerPatient = 425; // £
    const urgentCostMultiplier = 1.8;
    const routineCostMultiplier = 1.0;

    const totalCost = patients.reduce((sum, p) => {
      const multiplier = (p.urgency === 'Urgent' || p.urgency === '2WW') ? urgentCostMultiplier : routineCostMultiplier;
      return sum + (avgCostPerPatient * multiplier);
    }, 0);

    const avgCost = patients.length > 0 ? Math.round(totalCost / patients.length) : 0;

    return {
      totalCost: Math.round(totalCost),
      avgCost,
      projectedMonthly: Math.round(totalCost * 4.33) // weeks to month
    };
  }, [patients]);

  // Predictive Trends (next 4 weeks)
  const predictiveTrends = useMemo(() => {
    return [
      { week: 'Current', referrals: metrics.total, projected: metrics.total },
      { week: 'W+1', referrals: null, projected: Math.round(metrics.total * 1.08) },
      { week: 'W+2', referrals: null, projected: Math.round(metrics.total * 1.15) },
      { week: 'W+3', referrals: null, projected: Math.round(metrics.total * 1.22) },
      { week: 'W+4', referrals: null, projected: Math.round(metrics.total * 1.18) },
    ];
  }, [metrics]);

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
          { label: 'Urgent Cases', value: metrics.urgentCount + metrics.twoWWCount, sub: 'Requires <24h Action', color: 'text-red-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* SLA Compliance Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          SLA Compliance (RTT Targets)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-bold text-red-600">2-Week Wait (Cancer)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Target: ≤14 days</p>
              </div>
              <div className={`text-2xl font-black ${slaCompliance.twoWW.rate >= 95 ? 'text-emerald-600' : slaCompliance.twoWW.rate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
                {slaCompliance.twoWW.rate}%
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{slaCompliance.twoWW.compliant} compliant</span>
                <span>{slaCompliance.twoWW.total} total</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${slaCompliance.twoWW.rate >= 95 ? 'bg-emerald-500' : slaCompliance.twoWW.rate >= 85 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${slaCompliance.twoWW.rate}%`}}></div>
              </div>
            </div>
            <div className={`text-xs font-semibold mt-2 ${slaCompliance.twoWW.rate >= 95 ? 'text-emerald-600' : slaCompliance.twoWW.rate >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
              {slaCompliance.twoWW.rate >= 95 ? '✓ Meeting Target' : slaCompliance.twoWW.rate >= 85 ? '⚠ At Risk' : '✗ Below Target'}
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-bold text-orange-600">Urgent Cases</h4>
                <p className="text-xs text-slate-500 mt-0.5">Target: ≤7 days</p>
              </div>
              <div className={`text-2xl font-black ${slaCompliance.urgent.rate >= 90 ? 'text-emerald-600' : slaCompliance.urgent.rate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                {slaCompliance.urgent.rate}%
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{slaCompliance.urgent.compliant} compliant</span>
                <span>{slaCompliance.urgent.total} total</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${slaCompliance.urgent.rate >= 90 ? 'bg-emerald-500' : slaCompliance.urgent.rate >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${slaCompliance.urgent.rate}%`}}></div>
              </div>
            </div>
            <div className={`text-xs font-semibold mt-2 ${slaCompliance.urgent.rate >= 90 ? 'text-emerald-600' : slaCompliance.urgent.rate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
              {slaCompliance.urgent.rate >= 90 ? '✓ Meeting Target' : slaCompliance.urgent.rate >= 80 ? '⚠ At Risk' : '✗ Below Target'}
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-bold text-blue-600">Routine Cases</h4>
                <p className="text-xs text-slate-500 mt-0.5">Target: ≤28 days</p>
              </div>
              <div className={`text-2xl font-black ${slaCompliance.routine.rate >= 85 ? 'text-emerald-600' : slaCompliance.routine.rate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                {slaCompliance.routine.rate}%
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{slaCompliance.routine.compliant} compliant</span>
                <span>{slaCompliance.routine.total} total</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${slaCompliance.routine.rate >= 85 ? 'bg-emerald-500' : slaCompliance.routine.rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${slaCompliance.routine.rate}%`}}></div>
              </div>
            </div>
            <div className={`text-xs font-semibold mt-2 ${slaCompliance.routine.rate >= 85 ? 'text-emerald-600' : slaCompliance.routine.rate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
              {slaCompliance.routine.rate >= 85 ? '✓ Meeting Target' : slaCompliance.routine.rate >= 75 ? '⚠ At Risk' : '✗ Below Target'}
            </div>
          </div>
        </div>
      </div>

      {/* Department Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4">Department Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Department</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Total Patients</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Urgent Cases</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Avg Wait (Days)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase">Throughput %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentComparison.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${dept.department === 'Dermatology' ? 'text-green-700' : 'text-purple-700'}`}>
                      {dept.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-slate-800">{dept.total}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      {dept.urgent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-bold ${dept.avgWait <= 7 ? 'text-emerald-600' : dept.avgWait <= 14 ? 'text-amber-600' : 'text-red-600'}`}>
                      {dept.avgWait}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-bold text-slate-800">{dept.throughput}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${dept.throughput >= 90 ? 'bg-emerald-500' : dept.throughput >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${dept.throughput}%`}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Utilization & Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Resource Utilization (8-Week Trend)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resourceUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line type="monotone" dataKey="clinicians" stroke="#3b82f6" strokeWidth={2} name="Clinicians" dot={{ fill: '#3b82f6', r: 4 }} />
              <Line type="monotone" dataKey="theatres" stroke="#f59e0b" strokeWidth={2} name="Theatres" dot={{ fill: '#f59e0b', r: 4 }} />
              <Line type="monotone" dataKey="beds" stroke="#10b981" strokeWidth={2} name="Beds" dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Cost Analysis</h3>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Total Cost (Current)</h4>
                  <p className="text-2xl font-black text-slate-800 mt-1">£{costAnalysis.totalCost.toLocaleString()}</p>
                </div>
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-lg p-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Cost/Patient</h4>
                <p className="text-xl font-black text-slate-800">£{costAnalysis.avgCost}</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Projected Monthly</h4>
                <p className="text-xl font-black text-purple-600">£{costAnalysis.projectedMonthly.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-blue-800">Cost Efficiency Note</p>
                  <p className="text-xs text-blue-600 mt-1">Urgent cases cost 1.8x standard rate. Early intervention reduces overall costs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          AI-Powered Demand Forecast (Next 4 Weeks)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={predictiveTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Line type="monotone" dataKey="referrals" stroke="#3b82f6" strokeWidth={2} name="Actual" dot={{ fill: '#3b82f6', r: 5 }} />
            <Line type="monotone" dataKey="projected" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" name="Projected" dot={{ fill: '#a855f7', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-purple-800">AI Insight</p>
              <p className="text-xs text-purple-600 mt-1">Projected 22% increase in referrals over next month. Consider increasing theatre capacity by 15% and adding 2 clinic sessions/week.</p>
            </div>
          </div>
        </div>
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
