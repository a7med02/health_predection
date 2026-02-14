import type { RegionRawData, ProcessedRegion, RiskLevel } from "./types"
import regionsData from "@/mockData/regions.json"

/** Mock region row: raw fields plus pre-set overall_level and overall_score */
interface MockRegionRow extends RegionRawData {
  overall_level: RiskLevel
  overall_score: number
}

function toProcessedRegion(row: MockRegionRow): ProcessedRegion {
  const { region_name, symptoms, population, temperature, humidity, water_quality_index, overall_level, overall_score } = row
  const norm = (s: number) => Math.round((s / population) * 10000 * 10) / 10
  const cat = () => ({ score: overall_score, level: overall_level })
  return {
    region_name,
    overall_score,
    overall_level,
    categories: {
      waterborne: cat(),
      vector_borne: cat(),
      respiratory: cat(),
      other: cat(),
    },
    indicators: { temperature, humidity, water_quality_index, population },
    normalized: {
      waterborne: norm(symptoms.waterborne),
      vector_borne: norm(symptoms.vector_borne),
      respiratory: norm(symptoms.respiratory),
      other: norm(symptoms.other),
    },
  }
}

export function loadRegions(): RegionRawData[] {
  return regionsData as RegionRawData[]
}

/** Load processed regions from mock data only (no risk engine calculation). */
export function loadProcessedRegions(): ProcessedRegion[] {
  return (regionsData as MockRegionRow[]).map(toProcessedRegion)
}

export function normalizeSymptoms(
  symptoms: number,
  population: number
): number {
  return (symptoms / population) * 10000
}
