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
    showPatientList: true,
    patientFilter: (patients) => patients.filter(p =>
      p.status === 'Intake Review' || p.status === 'Awaiting Scheduling'
    ),
  },

  layout: {
    type: 'grid',
    columns: 3,
    gap: 6,
    widgets: [
      {
        id: 'clinic-availability',
        type: 'metrics-grid',
        span: 3,
        props: {
          metrics: [
            {
              key: 'urgent-slots',
              label: 'Urgent Clinic Slots',
              value: '4 available',
              icon: 'alert',
              variant: 'danger',
            },
            {
              key: 'routine-slots',
              label: 'Routine Clinic Slots',
              value: '15 available',
              icon: 'calendar',
              variant: 'success',
            },
            {
              key: 'pending-bookings',
              label: 'Pending Bookings',
              icon: 'inbox',
              variant: 'warning',
            },
          ],
        },
      },
      {
        id: 'patient-booking-details',
        type: 'patient-card',
        title: 'Patient Booking Details',
        span: 2,
        props: {
          showDetails: true,
          showGPNote: true,
          showUrgency: true,
        },
      },
      {
        id: 'booking-actions',
        type: 'action-panel',
        title: 'Book Appointment',
        span: 1,
        props: {
          actions: [
            {
              id: 'book-urgent',
              label: 'Urgent Care Clinic',
              variant: 'danger',
              outcome: { status: 'Scheduled' },
              condition: (patient: any) => patient.urgency === 'Urgent' || patient.urgency === '2WW',
            },
            {
              id: 'book-routine',
              label: 'Routine Clinic',
              variant: 'primary',
              outcome: { status: 'Scheduled' },
            },
            {
              id: 'book-specialist',
              label: 'Specialist Clinic',
              variant: 'secondary',
              outcome: { status: 'Scheduled' },
            },
          ],
        },
      },
      {
        id: 'clinic-capacity',
        type: 'progress-tracker',
        title: 'Today\'s Clinic Capacity',
        span: 3,
        props: {
          items: [
            { label: 'Urgent Care Clinic: 8/12 booked', done: false },
            { label: 'Routine Outpatient: 15/20 booked', done: false },
            { label: 'Specialist Dermatology: 6/8 booked', done: true },
            { label: 'Minor Operations: 9/10 booked', done: true },
          ],
        },
      },
    ],
  },

  actions: [
    {
      id: 'book-urgent-clinic',
      label: 'Book Urgent Care Clinic',
      variant: 'danger',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Scheduled' },
            `${patient.name} booked into Urgent Care Clinic (${patient.urgency} priority).`
          );
        }
      },
    },
    {
      id: 'book-routine-clinic',
      label: 'Book Routine Clinic',
      variant: 'primary',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Scheduled' },
            `${patient.name} booked into Routine Outpatient Clinic.`
          );
        }
      },
    },
    {
      id: 'book-specialist-clinic',
      label: 'Book Specialist Clinic',
      variant: 'secondary',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Scheduled' },
            `${patient.name} booked into Specialist Dermatology Clinic.`
          );
        }
      },
    },
    {
      id: 'defer-booking',
      label: 'Defer Booking',
      variant: 'secondary',
      handler: (patient, context) => {
        if (context.onUpdatePatient) {
          context.onUpdatePatient(
            { ...patient, status: 'Intake Review' },
            `Booking deferred for ${patient.name} - awaiting additional information.`
          );
        }
      },
    },
  ],
};
