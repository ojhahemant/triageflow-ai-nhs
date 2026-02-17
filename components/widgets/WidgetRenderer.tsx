// Widget Renderer - Dynamic widget instantiation based on config

import React from 'react';
import { WidgetConfig, PersonaContext } from '../../config/personas/types';
import { PatientDetailsWidget } from './PatientDetailsWidget';
import { ActionPanelWidget } from './ActionPanelWidget';
import { AIAnalysisWidget } from './AIAnalysisWidget';
import { ProgressTrackerWidget } from './ProgressTrackerWidget';
import { MetricsGridWidget } from './MetricsGridWidget';
import { MetricCardWidget } from './MetricCardWidget';
import { TableWidget } from './TableWidget';
import { PatientListWidget } from './PatientListWidget';
import { AlertCardWidget } from './AlertCardWidget';
import ClinicianDashboard from '../ClinicianDashboard';
import PACDashboard from '../PACDashboard';
import WaitingListDashboard from '../WaitingListDashboard';
import ManagementDashboard from '../ManagementDashboard';

interface WidgetRendererProps {
  config: WidgetConfig;
  context: PersonaContext;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ config, context }) => {
  // Check condition if provided
  if (config.condition && !config.condition(context)) {
    return null;
  }

  // Render widget based on type
  switch (config.type) {
    case 'patient-details':
      return <PatientDetailsWidget config={config} context={context} />;

    case 'action-panel':
      return <ActionPanelWidget config={config} context={context} />;

    case 'ai-analysis':
      return <AIAnalysisWidget config={config} context={context} />;

    case 'progress-tracker':
      return <ProgressTrackerWidget config={config} context={context} />;

    case 'metrics-grid':
      return <MetricsGridWidget config={config} context={context} />;

    case 'metric-card':
      return <MetricCardWidget config={config} context={context} />;

    case 'table':
      return <TableWidget config={config} context={context} />;

    case 'patient-list':
      return <PatientListWidget config={config} context={context} />;

    case 'alert-card':
      return <AlertCardWidget config={config} context={context} />;

    case 'patient-card':
      if (!context.selectedPatient) return null;
      return (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{config.title}</h3>
          {/* Patient card content */}
        </div>
      );

    case 'full-dashboard-clinician':
      if (!context.selectedPatient) return null;
      return <ClinicianDashboard patient={context.selectedPatient} onUpdatePatient={context.onUpdatePatient || (() => {})} />;

    case 'full-dashboard-pac':
      return <PACDashboard patients={context.patients} onUpdatePatient={context.onUpdatePatient || (() => {})} />;

    case 'full-dashboard-waiting-list':
      return <WaitingListDashboard patients={context.patients} onUpdatePatient={context.onUpdatePatient || (() => {})} />;

    case 'full-dashboard-management':
      return <ManagementDashboard patients={context.patients} />;

    case 'custom':
      // For custom widgets, return placeholder or dynamic import
      return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800">{config.title}</h3>
          <p className="text-sm text-slate-500 mt-2">
            Custom widget: {config.props?.component}
          </p>
        </div>
      );

    default:
      console.warn(`Unknown widget type: ${config.type}`);
      return null;
  }
};
