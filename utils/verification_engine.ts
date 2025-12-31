
import { InterventionEvent } from '../types';

/**
 * Verification Engine (TS Implementation)
 * Provides deterministic auditing of the Stability Protocol intervention logs.
 */

export interface VerificationAudit {
  confidenceScore: number; // Decision Quality (Verified Redemptions)
  replicationRate: number; // Rate of protocol re-use across sectors
  averageLatency: number;  // Mean time from event to verified redemption
  totalEvents: number;
  verifiedCount: number;
  results: { id: string; status: 'VERIFIED' | 'FAILED'; latency: number; replicated: boolean }[];
}

/**
 * Performs a comprehensive audit of current intervention events.
 * Simulates matching receipt and redemption logs to calculate system integrity.
 */
export function performAudit(events: InterventionEvent[]): VerificationAudit {
  const total = events.length;
  if (total === 0) {
    return { 
      confidenceScore: 0, 
      replicationRate: 0, 
      averageLatency: 0, 
      totalEvents: 0, 
      verifiedCount: 0, 
      results: [] 
    };
  }

  // A verified event requires both receipt and redemption anchors
  const verified = events.filter(e => e.receiptVerified && e.redemptionVerified);
  const confidenceScore = (verified.length / total) * 100;

  // Track replication frequency
  const replicated = events.filter(e => e.replicated);
  const replicationRate = (replicated.length / total) * 100;

  // Calculate mean latency for error correction monitoring
  const totalLatency = events.reduce((acc, curr) => acc + curr.latency, 0);
  const averageLatency = totalLatency / total;

  return {
    confidenceScore: Number(confidenceScore.toFixed(1)),
    replicationRate: Number(replicationRate.toFixed(1)),
    averageLatency: Number(averageLatency.toFixed(2)),
    totalEvents: total,
    verifiedCount: verified.length,
    results: events.map(e => ({
      id: e.id,
      status: (e.receiptVerified && e.redemptionVerified) ? 'VERIFIED' : 'FAILED',
      latency: e.latency,
      replicated: e.replicated
    }))
  };
}
