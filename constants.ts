
import { Patient, Persona } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Doe, John',
    dob: '01/01/1960',
    mrn: 'MRN-4829-X',
    referralDate: '2024-05-15',
    urgency: 'Urgent',
    status: 'Triage Pending',
    gpNote: 'Presenting with suspicious lesion on left arm, increasing in size and changing color. Patient reports it is itchy.',
    history: 'Previous melanoma excision 5 years ago. Family history of skin cancer.',
    comorbidities: ['Hypertension', 'Type 2 Diabetes', 'Warfarin (Anticoagulant)'],
    procedure: 'Excision',
  },
  {
    id: '2',
    name: 'Smith, Jane',
    dob: '15/03/1975',
    mrn: 'MRN-9120-A',
    referralDate: '2024-05-18',
    urgency: 'Routine',
    status: 'Intake Review',
    gpNote: 'Recurrent sebaceous cyst on upper back. Requests removal due to discomfort.',
    history: 'General health good. No allergies.',
    comorbidities: [],
    procedure: 'Cyst Removal',
  },
  {
    id: '3',
    name: 'Bloggs, Joe',
    dob: '22/11/1982',
    mrn: 'MRN-3341-B',
    referralDate: '2024-05-20',
    urgency: 'Inter Regular',
    status: 'Triage Pending',
    gpNote: 'Atypical mole on torso. Change noted over 6 months.',
    history: 'Smoker, BMI 30.',
    comorbidities: ['Asthma'],
    procedure: 'Biopsy',
  },
  {
    id: '4',
    name: 'Harrison, Sarah',
    dob: '12/08/1955',
    mrn: 'MRN-7723-C',
    referralDate: '2024-05-10',
    urgency: 'Urgent',
    status: 'Awaiting Scheduling',
    gpNote: 'Basal Cell Carcinoma confirmed via biopsy. Needs excision.',
    history: 'Otherwise fit and well.',
    comorbidities: ['Arthritis'],
    procedure: 'BCC Excision',
  },
  {
    id: '5',
    name: 'Patel, Amit',
    dob: '05/05/1990',
    mrn: 'MRN-1029-D',
    referralDate: '2024-05-22',
    urgency: 'Not Set',
    status: 'Intake Review',
    gpNote: 'Large lipoma on shoulder. Affecting range of motion.',
    history: 'No significant past medical history.',
    comorbidities: [],
  },
  {
    id: '6',
    name: 'Thompson, Emily',
    dob: '30/12/2002',
    mrn: 'MRN-5561-E',
    referralDate: '2024-05-01',
    urgency: 'Routine',
    status: 'Confirmed',
    gpNote: 'Minor skin tag removal.',
    history: 'Anxiety.',
    comorbidities: [],
    procedure: 'Minor Ops',
  }
];

export const PERSONA_CONFIG = {
  [Persona.CLINICIAN]: {
    title: 'Clinician / Doctor',
    subtitle: 'The Decision Maker',
    icon: 'Stethoscope',
    description: 'Triage referrals, record outcomes, and review complex patient contexts with AI support.'
  },
  [Persona.WAITING_LIST]: {
    title: 'Waiting List Office',
    subtitle: 'The Orchestrator',
    icon: 'ClipboardList',
    description: 'Digital management of theatre lists and scheduling operations.'
  },
  [Persona.PAC]: {
    title: 'Patients Appointments Centre',
    subtitle: 'The Booking Hub',
    icon: 'Calendar',
    description: 'Book patients into clinics according to urgency and availability.'
  },
  [Persona.MANAGEMENT]: {
    title: 'Management',
    subtitle: 'The Overseer',
    icon: 'BarChart',
    description: 'High-level visibility into backlog volumes, wait times, and operational bottlenecks.'
  }
};
