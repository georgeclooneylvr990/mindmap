import { NextRequest, NextResponse } from "next/server";
import { getEntries, createEntry } from "@/lib/db/entries";
import { entrySchema } from "@/lib/utils/validation";
import type { EntryType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      type: (searchParams.get("type") as EntryType) || undefined,
      minRating: searchParams.get("minRating")
        ? parseInt(searchParams.get("minRating")!)
        : undefined,
      tag: searchParams.get("tag") || undefined,
      month: searchParams.get("month") || undefined,
      sort: (searchParams.get("sort") as "date_desc" | "date_asc" | "rating_desc" | "rating_asc") || undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 50,
    };

    const result = await getEntries(filters);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = entrySchema.parse(body);

    const entry = await createEntry({
      ...validated,
      dateConsumed: validated.dateConsumed || null,
      source: validated.source || undefined,
      author: validated.author || undefined,
      content: validated.content || undefined,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: err }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}
