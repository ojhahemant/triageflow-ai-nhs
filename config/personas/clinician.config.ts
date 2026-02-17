// Clinician Persona Configuration

import { PersonaConfig } from './types';
import { Persona } from '../../types';

export const clinicianConfig: PersonaConfig = {
  persona: Persona.CLINICIAN,
  displayName: 'Clinician / Doctor',
  subtitle: 'The Decision Maker',
  description: 'Triage referrals, record outcomes, and review complex patient contexts with AI support.',
  icon: 'Stethoscope',

  // Only show patients pending triage
  patientFilter: (patients) => patients.filter(p => p.status === 'Triage Pending'),

  sidebar: {
    showPatientList: true,
    patientFilter: (patients) => patients.filter(p => p.status === 'Triage Pending'),
  },

  layout: {
    type: 'grid',
    columns: 1,
    gap: 0,
    widgets: [
      {
        id: 'clinician-dashboard',
        type: 'full-dashboard-clinician',
        title: 'Clinician Dashboard',
        span: 1,
        props: {},
      },
    ],
  },

  actions: [
    {
      id: 'triage-see-and-treat',
      label: 'Excision (See & Treat)',
      variant: 'danger',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Awaiting Scheduling', urgency: 'Urgent', procedure: 'Excision (See & Treat)' },
            `Patient ${patient.name} triaged as Urgent. Outcome: Excision (See & Treat). Sent to List Office.`
          );
        }
      },
    },
    {
      id: 'triage-2ww',
      label: '2WW Suspected Cancer',
      variant: 'primary',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Awaiting Scheduling', urgency: 'Urgent', procedure: 'Two Week Wait Clinic' },
            `Patient ${patient.name} triaged as Priority 2WW. Sent to List Office.`
          );
        }
      },
    },
    {
      id: 'triage-routine',
      label: 'Routine Clinic',
      variant: 'secondary',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Awaiting Scheduling', urgency: 'Routine', procedure: 'Routine Clinic' },
            `Patient ${patient.name} triaged as Routine. Sent to List Office.`
          );
        }
      },
    },
  ],
};
