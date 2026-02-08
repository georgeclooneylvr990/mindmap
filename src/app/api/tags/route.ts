import { NextRequest, NextResponse } from "next/server";
import { getAllTags, searchTags } from "@/lib/db/tags";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const tags = query ? await searchTags(query) : await getAllTags();
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
