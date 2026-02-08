import { NextRequest, NextResponse } from "next/server";
import { searchEntries } from "@/lib/db/search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const results = await searchEntries(query, page, limit);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
