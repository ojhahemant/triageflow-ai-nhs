// Persona Configuration Registry - TheraForge-inspired declarative system

import { Persona } from '../../types';
import { PersonaConfig } from './types';
import { clinicianConfig } from './clinician.config';
import { waitingListConfig } from './waiting-list.config';
import { pacConfig } from './pac.config';
import { managementConfig } from './management.config';

export const personaConfigs: Record<Persona, PersonaConfig> = {
  [Persona.CLINICIAN]: clinicianConfig,
  [Persona.WAITING_LIST]: waitingListConfig,
  [Persona.PAC]: pacConfig,
  [Persona.MANAGEMENT]: managementConfig,
};

export const getPersonaConfig = (persona: Persona): PersonaConfig => {
  return personaConfigs[persona];
};

// Export types
export * from './types';

// Export individual configs
export { clinicianConfig, waitingListConfig, pacConfig, managementConfig };
