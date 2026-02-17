// Management Persona Configuration

import { PersonaConfig } from './types';
import { Persona } from '../../types';

export const managementConfig: PersonaConfig = {
  persona: Persona.MANAGEMENT,
  displayName: 'Management',
  subtitle: 'The Overseer',
  description: 'High-level visibility into backlog volumes, wait times, and operational bottlenecks.',
  icon: 'BarChart',

  // Show all patients for comprehensive overview
  patientFilter: (patients) => patients,

  sidebar: {
    showPatientList: false,
  },

  layout: {
    type: 'grid',
    columns: 1,
    gap: 0,
    widgets: [
      {
        id: 'management-dashboard',
        type: 'full-dashboard-management',
        title: 'Management Dashboard',
        span: 1,
        props: {},
      },
    ],
  },

  actions: [],
};
