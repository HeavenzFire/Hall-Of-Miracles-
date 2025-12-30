
export enum MiracleType {
  ORACLE = 'ORACLE',           // System Architect / Analysis
  VANGUARD_PROTOCOL = 'VANGUARD_PROTOCOL', // Deployment Frameworks
  REGISTRY = 'REGISTRY',        // Proof-of-Contribution / Artifact Tracking
  TREASURY = 'TREASURY',        // Public-Goods Treasury (The Root Layer)
  STABILITY_MONITOR = 'STABILITY_MONITOR', // Quantified Impact & Stability Metrics
  AEGIS_GRID = 'AEGIS_GRID',     // Non-Lethal Grid & Real-time Neutralization
  VISIONARY = 'VISIONARY',      // Shard Manifestation (Visuals)
  SPIRIT = 'SPIRIT',             // Multi-modal Interface
}

export type NodeState = 'LOCKED' | 'ACTIVE';
export type ArtifactType = 'GIT_PR' | 'GIT_COMMIT' | 'BASE_TX' | 'CI_RUN';

export interface TreasuryProposal {
  id: number;
  recipient: string;
  amount: number;
  executed: boolean;
  title: string;
  description: string;
  projectedImpact?: string;
}

export interface ContributionRecord {
  id: string;
  artifactType: ArtifactType;
  artifactRef: string;
  commitHash?: string;
  delta: number;
  timestamp: number;
  contributor: string;
  category: 'DOCS' | 'BUG' | 'FEATURE' | 'TEST' | 'HARDENING' | 'DEPLOYMENT' | 'TREASURY';
  guardianId?: number;
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
