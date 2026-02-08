import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { prisma } from "@/lib/prisma";
import {
  getApplePodcastsDbPath,
  PLAYED_EPISODES_QUERY,
  parseApplePodcastsRow,
  filterNewEpisodes,
} from "@/services/podcast/podcastSync";
import type { RawPodcastRow } from "@/services/podcast/podcastSync";

export async function POST() {
  try {
    // Open Apple Podcasts SQLite DB (read-only)
    const dbPath = getApplePodcastsDbPath();
    const db = new Database(dbPath, { readonly: true });

    // Query played episodes
    const rows = db.prepare(PLAYED_EPISODES_QUERY).all() as RawPodcastRow[];
    db.close();

    // Parse rows into our format
    const episodes = rows.map(parseApplePodcastsRow);

    // Get existing podcast UUIDs to avoid duplicates
    const existingEntries = await prisma.entry.findMany({
      where: { type: "PODCAST" },
      select: { source: true, title: true },
    });

    // Build a set of existing UUIDs from source URLs or title matches
    const existingUuids = new Set<string>();
    // We store UUID info — check all podcast entries
    // For dedup, we'll use the UUID stored in a metadata convention
    // Since we don't have a UUID column, let's check by title match
    const existingTitles = new Set(
      existingEntries.map((e) => e.title.toLowerCase())
    );

    // Filter to only new episodes (not already in DB by title)
    const newEpisodes = episodes.filter(
      (ep) => !existingTitles.has(ep.formattedTitle.toLowerCase())
    );

    // Create entries for new episodes
    const created = [];
    for (const ep of newEpisodes) {
      const entry = await prisma.entry.create({
        data: {
          title: ep.formattedTitle,
          type: "PODCAST",
          dateConsumed: ep.datePlayed,
          source: ep.source || null,
          author: ep.author || null,
          content: ep.description || null,
          influenceRating: 3,
          tags: {
            connectOrCreate: {
              where: { name: "podcast" },
              create: { name: "podcast" },
            },
          },
        },
        include: { tags: true },
      });
      created.push(entry);
    }

    return NextResponse.json({
      success: true,
      found: episodes.length,
      imported: created.length,
      skipped: episodes.length - created.length,
      entries: created.map((e) => ({
        id: e.id,
        title: e.title,
        dateConsumed: e.dateConsumed,
      })),
    });
  } catch (err) {
    console.error("Podcast sync error:", err);
    return NextResponse.json(
      {
        error: "Failed to sync podcasts",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
