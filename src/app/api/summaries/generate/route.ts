import { NextRequest, NextResponse } from "next/server";
import { generateMonthlySummary } from "@/lib/db/summaries";

export async function POST(request: NextRequest) {
  try {
    const { year, month } = await request.json();

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid year or month" },
        { status: 400 }
      );
    }

    const summary = await generateMonthlySummary(year, month);
    return NextResponse.json(summary, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
