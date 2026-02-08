import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subMonths, format } from "date-fns";
import type { ThemeData } from "@/types/theme";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const monthsBack = parseInt(searchParams.get("months") || "12");
    const topN = parseInt(searchParams.get("topN") || "20");

    const since = subMonths(new Date(), monthsBack);

    // Get top N tags by frequency in the period
    const topTags = await prisma.$queryRawUnsafe<
      Array<{ name: string; total: bigint }>
    >(
      `
      SELECT t.name, COUNT(*)::bigint as total
      FROM "Tag" t
      JOIN "_EntryTags" et ON t.id = et."B"
      JOIN "Entry" e ON et."A" = e.id
      WHERE e."dateConsumed" >= $1
      GROUP BY t.name
      ORDER BY total DESC
      LIMIT $2
      `,
      since,
      topN
    );

    if (topTags.length === 0) {
      const emptyData: ThemeData = {
        matrix: [],
        tags: [],
        months: [],
        maxCount: 0,
      };
      return NextResponse.json(emptyData);
    }

    const tagNames = topTags.map((t) => t.name);

    // Get per-month counts for those tags
    const matrixRaw = await prisma.$queryRawUnsafe<
      Array<{ tagName: string; month: string; count: bigint }>
    >(
      `
      SELECT
        t.name AS "tagName",
        to_char(e."dateConsumed", 'YYYY-MM') AS month,
        COUNT(*)::bigint AS count
      FROM "Tag" t
      JOIN "_EntryTags" et ON t.id = et."B"
      JOIN "Entry" e ON et."A" = e.id
      WHERE t.name = ANY($1)
        AND e."dateConsumed" >= $2
      GROUP BY t.name, to_char(e."dateConsumed", 'YYYY-MM')
      ORDER BY t.name, month
      `,
      tagNames,
      since
    );

    const matrix = matrixRaw.map((r) => ({
      tagName: r.tagName,
      month: r.month,
      count: Number(r.count),
    }));

    // Build months list
    const monthsSet = new Set<string>();
    for (let i = 0; i < monthsBack; i++) {
      monthsSet.add(format(subMonths(new Date(), i), "yyyy-MM"));
    }
    const months = Array.from(monthsSet).sort();

    const maxCount = Math.max(...matrix.map((m) => m.count), 0);

    const themeData: ThemeData = {
      matrix,
      tags: tagNames,
      months,
      maxCount,
    };

    return NextResponse.json(themeData);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch theme data" },
      { status: 500 }
    );
  }
}
