import { NextRequest, NextResponse } from "next/server";
import { createReflection } from "@/lib/db/reflections";
import { reflectionSchema } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reflectionSchema.parse(body);
    const reflection = await createReflection(validated.entryId, validated.content);
    return NextResponse.json(reflection, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: err }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create reflection" },
      { status: 500 }
    );
  }
}
