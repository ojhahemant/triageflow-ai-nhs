
import React, { useState, useEffect } from 'react';
import { Persona, Patient } from './types';
import { MOCK_PATIENTS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PersonaSelector from './components/PersonaSelector';
import { ConfigurableDashboard } from './components/ConfigurableDashboard';
import { getPersonaConfig } from './config/personas';

console.log('🚀 TriageFlow AI - Elaborate Dashboards Loaded - Build: ' + new Date().toISOString());

const App: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUpdatePatient = (updatedPatient: Patient, message?: string) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? { ...updatedPatient, lastUpdated: new Date().toISOString() } : p));
    if (message) {
      setToast({ message, type: 'success' });
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Get persona configuration for sidebar filtering
  const getRelevantPatients = () => {
    if (!currentPersona) return patients;
    const config = getPersonaConfig(currentPersona);
    return config.sidebar?.patientFilter
      ? config.sidebar.patientFilter(patients)
      : patients;
  };

  if (!currentPersona) {
    return <PersonaSelector onSelect={setCurrentPersona} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Simulation Toast */}
      {toast && (
        <div className="fixed top-20 right-4 md:right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`px-3 md:px-4 py-2 md:py-3 rounded-lg shadow-xl text-white flex items-center space-x-2 md:space-x-3 text-sm md:text-base ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown when sidebarOpen is true */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50`}>
        <Sidebar
          currentPersona={currentPersona}
          onPersonaChange={setCurrentPersona}
          patients={getRelevantPatients()}
          selectedPatientId={selectedPatientId}
          onSelectPatient={(id) => {
            setSelectedPatientId(id);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar currentPersona={currentPersona} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <ConfigurableDashboard
            persona={currentPersona}
            patients={patients}
            selectedPatient={selectedPatient}
            onUpdatePatient={handleUpdatePatient}
            onSelectPatient={setSelectedPatientId}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
