
import React, { useState, useEffect } from 'react';
import { Persona, Patient } from './types';
import { MOCK_PATIENTS } from './constants';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ClinicianDashboard from './components/ClinicianDashboard';
import WaitingListDashboard from './components/WaitingListDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import PersonaSelector from './components/PersonaSelector';

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

  // Filtering patients based on persona-specific relevant statuses
  const getRelevantPatients = () => {
    switch (currentPersona) {
      case Persona.ADMIN:
        return patients.filter(p => p.status === 'Intake Review');
      case Persona.CLINICIAN:
        return patients.filter(p => p.status === 'Triage Pending');
      case Persona.WAITING_LIST:
        return patients.filter(p => ['Form Pending', 'Awaiting Scheduling', 'Scheduled'].includes(p.status));
      default:
        return patients;
    }
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
          {currentPersona === Persona.CLINICIAN && (
            <ClinicianDashboard 
              patient={selectedPatient} 
              onUpdatePatient={handleUpdatePatient}
            />
          )}
          {currentPersona === Persona.WAITING_LIST && (
            <WaitingListDashboard 
              patients={patients.filter(p => ['Awaiting Scheduling', 'Scheduled', 'Form Pending', 'Confirmed'].includes(p.status))} 
              onUpdatePatient={handleUpdatePatient}
            />
          )}
          {currentPersona === Persona.ADMIN && (
            <AdminDashboard 
              patients={patients.filter(p => p.status === 'Intake Review')} 
              onUpdatePatient={handleUpdatePatient}
            />
          )}
          {currentPersona === Persona.MANAGEMENT && (
            <ManagementDashboard patients={patients} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
