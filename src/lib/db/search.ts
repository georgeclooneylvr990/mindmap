import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  title: string;
  type: string;
  dateConsumed: Date;
  influenceRating: number;
  snippet: string;
  rank: number;
  matchSource: "entry" | "reflection" | "tag";
}

export async function searchEntries(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<{ results: SearchResult[]; total: number }> {
  if (!query.trim()) {
    return { results: [], total: 0 };
  }

  // Search entries using the tsvector column
  const entryResults = await prisma.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT
      e.id, e.title, e.type, e."dateConsumed", e."influenceRating",
      ts_headline('english', coalesce(e.content, e.title), plainto_tsquery('english', $1),
        'StartSel=****, StopSel=****, MaxWords=35, MinWords=15') AS snippet,
      ts_rank_cd(e."searchVector", plainto_tsquery('english', $1)) AS rank,
      'entry' AS "matchSource"
    FROM "Entry" e
    WHERE e."searchVector" @@ plainto_tsquery('english', $1)
    ORDER BY rank DESC
    `,
    query
  );

  // Search reflections
  const reflectionResults = await prisma.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT DISTINCT ON (e.id)
      e.id, e.title, e.type, e."dateConsumed", e."influenceRating",
      ts_headline('english', r.content, plainto_tsquery('english', $1),
        'StartSel=****, StopSel=****, MaxWords=35, MinWords=15') AS snippet,
      ts_rank_cd(to_tsvector('english', r.content), plainto_tsquery('english', $1)) AS rank,
      'reflection' AS "matchSource"
    FROM "Reflection" r
    JOIN "Entry" e ON r."entryId" = e.id
    WHERE to_tsvector('english', r.content) @@ plainto_tsquery('english', $1)
    ORDER BY e.id, rank DESC
    `,
    query
  );

  // Search by tag name
  const tagResults = await prisma.$queryRawUnsafe<SearchResult[]>(
    `
    SELECT DISTINCT ON (e.id)
      e.id, e.title, e.type, e."dateConsumed", e."influenceRating",
      'Tag: ' || t.name AS snippet,
      0.5 AS rank,
      'tag' AS "matchSource"
    FROM "Tag" t
    JOIN "_EntryTags" et ON t.id = et."B"
    JOIN "Entry" e ON et."A" = e.id
    WHERE t.name ILIKE $1
    ORDER BY e.id
    `,
    `%${query}%`
  );

  // Merge and deduplicate (keep highest rank per entry)
  const resultMap = new Map<string, SearchResult>();

  for (const r of [...entryResults, ...reflectionResults, ...tagResults]) {
    const existing = resultMap.get(r.id);
    if (!existing || Number(r.rank) > Number(existing.rank)) {
      resultMap.set(r.id, r);
    }
  }

  const allResults = Array.from(resultMap.values()).sort(
    (a, b) => Number(b.rank) - Number(a.rank)
  );

  const total = allResults.length;
  const paginatedResults = allResults.slice((page - 1) * limit, page * limit);

  return { results: paginatedResults, total };
}
