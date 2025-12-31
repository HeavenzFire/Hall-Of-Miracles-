
export interface HDIMetrics {
  zip: string;
  name: string;
  score: number;
  childWelfare: number; // 2x weight
  foodScarcity: number;
  economicDesperation: number;
  volatility: number;
}

export interface InterventionEvent {
  id: string;
  timestamp: string;
  zip: string;
  type: 'FOOD_STABILIZATION' | 'TRAUMA_CARE' | 'SAFE_PASSAGE' | 'DIAGNOSTIC' | 'NON_LETHAL_STABILIZATION';
  receiptVerified: boolean;
  redemptionVerified: boolean;
  replicated: boolean; // Tracking replication rate
  latency: number; // Days from report to verification
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
}

export interface EVIMetrics {
  dqs: number; // Decision Quality Score
  ecl: number; // Error Correction Latency
  rc: number;  // Reusability Coefficient (Replication)
  evi: number; // Evolution Velocity Index
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Miracle {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  system: 'TREASURY' | 'GRID' | 'COVENANT' | 'VANGUARD';
  description: string;
}

export interface HumanLayerState {
  fiscalSponsor: 'NULL' | 'IDENTIFIED' | 'VETTED' | 'CONTRACTED';
  mediator: 'NULL' | 'IDENTIFIED' | 'VETTED' | 'CONTRACTED';
  auditor: 'NULL' | 'IDENTIFIED' | 'VETTED' | 'CONTRACTED';
}

export interface PilotGate {
  id: string;
  label: string;
  description: string;
  status: 'LOCKED' | 'PENDING' | 'CLEARED';
}

// Added missing types for Registry and Dashboard functionality
export type NodeState = 'LOCKED' | 'ACTIVE';

export type ArtifactType = 'BASE_TX' | 'GIT_PR' | 'GIT_COMMIT';

export interface ContributionRecord {
  id: string;
  artifactType: ArtifactType;
  artifactRef: string;
  commitHash: string;
  delta: number;
  timestamp: number;
  contributor: string;
  category: 'DEPLOYMENT' | 'BUG' | 'HARDENING' | 'TEST' | 'FEATURE';
  guardianId: number;
}

export interface RegistryNode {
  index: number;
  state: NodeState;
  record: ContributionRecord | null;
}

// Added missing type for Treasury proposals
export interface TreasuryProposal {
  id: number;
  recipient: string;
  amount: number;
  executed: boolean;
  title: string;
  description: string;
  projectedImpact: string;
}

// Added missing type for Stability Monitor phases
export type StabilizationPhase = 'BASELINE' | 'PILOT' | 'STABILIZATION' | 'EMPOWERMENT';
