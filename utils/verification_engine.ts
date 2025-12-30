
import { InterventionEvent } from '../types';

/**
 * Verification Engine (TS Implementation)
 * Mirrors fund_verification_log.py for frontend simulation and UI feedback.
 */

export interface VerificationAudit {
  confidenceScore: number;
  totalEvents: number;
  verifiedCount: number;
  results: { id: string; status: 'VERIFIED' | 'FAILED'; latency: number }[];
}

export function performAudit(events: InterventionEvent[]): VerificationAudit {
  const total = events.length;
  if (total === 0) return { confidenceScore: 0, totalEvents: 0, verifiedCount: 0, results: [] };

  const verified = events.filter(e => e.receiptVerified && e.redemptionVerified);
  const confidenceScore = (verified.length / total) * 100;

  return {
    confidenceScore: Number(confidenceScore.toFixed(1)),
    totalEvents: total,
    verifiedCount: verified.length,
    results: events.map(e => ({
      id: e.id,
      status: (e.receiptVerified && e.redemptionVerified) ? 'VERIFIED' : 'FAILED',
      latency: e.latency
    }))
  };
}
