// PAC (Patients Appointments Centre) Persona Configuration

import { PersonaConfig } from './types';
import { Persona } from '../../types';

export const pacConfig: PersonaConfig = {
  persona: Persona.PAC,
  displayName: 'Patients Appointments Centre',
  subtitle: 'The Booking Hub',
  description: 'Book patients into clinics according to urgency and availability.',
  icon: 'Calendar',

  // Show patients who need booking (Intake Review or Awaiting Scheduling)
  patientFilter: (patients) => patients.filter(p =>
    p.status === 'Intake Review' || p.status === 'Awaiting Scheduling'
  ),

  sidebar: {
    showPatientList: false,
  },

  layout: {
    type: 'grid',
    columns: 1,
    gap: 0,
    widgets: [
      {
        id: 'pac-dashboard',
        type: 'full-dashboard-pac',
        title: 'PAC Dashboard',
        span: 1,
        props: {},
      },
    ],
  },

  actions: [],
};
