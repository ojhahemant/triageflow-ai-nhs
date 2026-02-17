
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
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-xl text-white flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <Sidebar 
        currentPersona={currentPersona} 
        onPersonaChange={setCurrentPersona}
        patients={getRelevantPatients()}
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar currentPersona={currentPersona} />
        
        <main className="flex-1 overflow-y-auto p-6">
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
