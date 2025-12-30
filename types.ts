
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
  type: 'FOOD_STABILIZATION' | 'TRAUMA_CARE' | 'SAFE_PASSAGE';
  receiptVerified: boolean;
  redemptionVerified: boolean;
  latency: number; // Days from report to verification
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
}

export interface EVIMetrics {
  dqs: number; // Decision Quality Score
  ecl: number; // Error Correction Latency
  rc: number;  // Reusability Coefficient
  evi: number; // Evolution Velocity Index
}

export interface Message {
  role: 'user' | 'model';
  text: string;
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
