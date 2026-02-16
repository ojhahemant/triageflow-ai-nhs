
export enum Persona {
  CLINICIAN = 'CLINICIAN',
  WAITING_LIST = 'WAITING_LIST',
  PAC = 'PAC',
  MANAGEMENT = 'MANAGEMENT'
}

export type PatientStatus = 
  | 'Intake Review' 
  | 'Triage Pending' 
  | 'Form Pending' 
  | 'Awaiting Scheduling' 
  | 'Scheduled' 
  | 'Confirmed' 
  | 'Rejected';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  referralDate: string;
  urgency: 'Urgent' | 'Routine' | 'Inter Regular' | '2WW' | 'Not Set';
  status: PatientStatus;
  gpNote: string;
  history: string;
  comorbidities: string[];
  procedure?: string;
  aiSummary?: string;
  aiRecommendation?: string;
  lastUpdated?: string;
}

export interface Task {
  id: string;
  title: string;
  patientId: string;
  assignedTo: Persona;
  status: 'Pending' | 'Completed';
}
