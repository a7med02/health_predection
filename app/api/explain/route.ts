import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"
import { generateRegionExplanation } from "@/lib/geminiService"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionName = searchParams.get("region")

    if (!regionName) {
      return NextResponse.json(
        { error: "Region name is required" },
        { status: 400 }
      )
    }

    const processed = loadProcessedRegions()
    const region = processed.find(
      (r) => r.region_name.toLowerCase() === regionName.toLowerCase()
    )

    if (!region) {
      return NextResponse.json(
        { error: "Region not found" },
        { status: 404 }
      )
    }

    const explanation = await generateRegionExplanation(region)

    return NextResponse.json({ region_name: region.region_name, explanation })
  } catch (error) {
    console.error("Error generating explanation:", error)
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    )
  }
}
