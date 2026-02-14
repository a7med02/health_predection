import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import { generateNationalSummary } from "@/lib/geminiService"

export async function GET() {
  try {
    const processed = loadProcessedRegions()
    const summary = await generateNationalSummary(processed)

    const highCount = processed.filter((r) => r.overall_level === "HIGH").length
    const medCount = processed.filter((r) => r.overall_level === "MEDIUM").length
    const lowCount = processed.filter((r) => r.overall_level === "LOW").length

    return NextResponse.json({
      summary,
      stats: {
        total: processed.length,
        high: highCount,
        medium: medCount,
        low: lowCount,
      },
    })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json(
      { error: "Failed to generate national summary" },
      { status: 500 }
    )
  }
}
