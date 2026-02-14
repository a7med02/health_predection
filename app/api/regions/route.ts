import { NextResponse } from "next/server"
import { loadProcessedRegions } from "@/lib/parser"

export async function GET() {
  try {
    const processed = loadProcessedRegions()
    return NextResponse.json(processed)
  } catch (error) {
    console.error("Error processing regions:", error)
    return NextResponse.json(
      { error: "Failed to process region data" },
      { status: 500 }
    )
  }
}
