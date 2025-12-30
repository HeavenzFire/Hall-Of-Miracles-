
export enum MiracleType {
  ORACLE = 'ORACLE',       // System Architect
  VANGUARD_PROTOCOL = 'VANGUARD_PROTOCOL', // Operational Frameworks
  REGISTRY = 'REGISTRY'    // Proof-of-Contribution Reveal (PCR)
}

export type NodeState = 'LOCKED' | 'ACTIVE';

export interface ContributionRecord {
  id: string;
  prUrl: string;
  commitHash: string;
  delta: number;
  timestamp: number;
  contributor: string;
  category: 'DOCS' | 'BUG' | 'FEATURE' | 'TEST' | 'HARDENING';
}

export interface RegistryNode {
  index: number;
  state: NodeState;
  record: ContributionRecord | null;
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
}
