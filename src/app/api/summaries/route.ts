import { NextResponse } from "next/server";
import { getAllSummaries, getAvailableMonths } from "@/lib/db/summaries";

export async function GET() {
  try {
    const [summaries, availableMonths] = await Promise.all([
      getAllSummaries(),
      getAvailableMonths(),
    ]);
    return NextResponse.json({ summaries, availableMonths });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}
