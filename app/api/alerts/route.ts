import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import { generateAlertMessage } from "@/lib/geminiService"
import type { AlertData } from "@/lib/types"

export async function GET() {
  try {
    const processed = loadProcessedRegions()
    const highRiskRegions = processed.filter((r) => r.overall_level === "HIGH")

    const alerts: AlertData[] = await Promise.all(
      highRiskRegions.map(async (region) => {
        const message = await generateAlertMessage(region)
        console.log(`[ALERT] ${region.region_name}: ${message}`)
        return {
          region_name: region.region_name,
          level: region.overall_level,
          message,
          timestamp: new Date().toISOString(),
        }
      })
    )

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error generating alerts:", error)
    return NextResponse.json(
      { error: "Failed to generate alerts" },
      { status: 500 }
    )
  }
}
