
export enum MiracleType {
  ORACLE = 'ORACLE',       // Text/Thinking - System Architect
  VISIONARY = 'VISIONARY', // Image Gen - Manifestor of Syntropy
  ANIMATOR = 'ANIMATOR',   // Video Gen - Temporal Synthesis
  LIVING_SPIRIT = 'LIVING_SPIRIT', // Live API - Unbroken Multitude
  VANGUARD_PROTOCOL = 'VANGUARD_PROTOCOL' // New Operational Frameworks
}

export interface Miracle {
  id: MiracleType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
