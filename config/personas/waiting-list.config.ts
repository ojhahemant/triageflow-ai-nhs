// Waiting List Office Persona Configuration

import { PersonaConfig } from './types';
import { Persona } from '../../types';

export const waitingListConfig: PersonaConfig = {
  persona: Persona.WAITING_LIST,
  displayName: 'Waiting List Office',
  subtitle: 'The Orchestrator',
  description: 'Digital management of theatre lists and scheduling operations.',
  icon: 'ClipboardList',

  // Show patients awaiting scheduling or already scheduled
  patientFilter: (patients) =>
    patients.filter(p => ['Awaiting Scheduling', 'Scheduled', 'Form Pending', 'Confirmed'].includes(p.status)),

  sidebar: {
    showPatientList: false,
  },

  layout: {
    type: 'grid',
    columns: 1,
    gap: 0,
    widgets: [
      {
        id: 'waiting-list-dashboard',
        type: 'full-dashboard-waiting-list',
        title: 'Waiting List Dashboard',
        span: 1,
        props: {},
      },
    ],
  },

  actions: [],
};
