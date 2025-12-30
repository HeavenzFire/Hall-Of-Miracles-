
import { HDIMetrics } from '../types';

/**
 * HarmDensityIndexer Agent (TS Implementation)
 * Enforces 2x weighting for child indicators.
 */

interface RawSectorData {
  schoolMealParticipation: number; // Child (0-10)
  pediatricERVisits: number;       // Child (0-10)
  foodScarcity: number;            // Adult (0-10)
  economicDesperation: number;     // Adult (0-10)
  name: string;
}

const CHICAGO_DATA: Record<string, RawSectorData> = {
  "60621": { name: "Englewood", schoolMealParticipation: 9.6, pediatricERVisits: 8.8, foodScarcity: 9.5, economicDesperation: 9.6 },
  "60624": { name: "West Garfield Park", schoolMealParticipation: 9.1, pediatricERVisits: 8.5, foodScarcity: 8.9, economicDesperation: 9.3 },
  "60636": { name: "West Englewood", schoolMealParticipation: 8.9, pediatricERVisits: 7.9, foodScarcity: 8.7, economicDesperation: 9.0 },
  "60644": { name: "Austin", schoolMealParticipation: 7.6, pediatricERVisits: 7.2, foodScarcity: 8.0, economicDesperation: 8.2 },
  "60612": { name: "Near West Side", schoolMealParticipation: 6.2, pediatricERVisits: 6.0, foodScarcity: 5.4, economicDesperation: 5.8 },
  "60609": { name: "Back of the Yards", schoolMealParticipation: 8.2, pediatricERVisits: 7.5, foodScarcity: 7.8, economicDesperation: 8.4 },
};

export const HDI_THRESHOLD = 70.0;

export function getCommunityName(zip: string): string {
  return CHICAGO_DATA[zip]?.name || "Unmapped Territory";
}

export function calculateHDI(zip: string): HDIMetrics {
  const raw = CHICAGO_DATA[zip] || { 
    name: "Unmapped Territory", 
    schoolMealParticipation: 5.0, 
    pediatricERVisits: 5.0, 
    foodScarcity: 5.0, 
    economicDesperation: 5.0 
  };

  // Angelic Weighting (Hard Constraints)
  const W_CHILD = 2.0;
  const W_ADULT = 1.0;

  const childSum = (raw.schoolMealParticipation + raw.pediatricERVisits) * W_CHILD;
  const adultSum = (raw.foodScarcity + raw.economicDesperation) * W_ADULT;
  const totalWeight = (2 * W_CHILD) + (2 * W_ADULT);

  const score = ( (childSum + adultSum) / (10 * totalWeight) ) * 100;

  return {
    zip,
    name: raw.name,
    score: Number(score.toFixed(1)),
    childWelfare: raw.schoolMealParticipation, // Primary child proxy
    foodScarcity: raw.foodScarcity,
    economicDesperation: raw.economicDesperation,
    volatility: raw.pediatricERVisits // Renamed contextually to health volatility
  };
}

export function getZipList() {
  return Object.keys(CHICAGO_DATA);
}
