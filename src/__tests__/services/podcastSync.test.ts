import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseApplePodcastsRow,
  coreTimestampToDate,
  filterNewEpisodes,
  type RawPodcastRow,
} from "@/services/podcast/podcastSync";

describe("coreTimestampToDate", () => {
  it("converts Apple Core Data timestamp to JS Date", () => {
    // Core Data epoch is Jan 1, 2001 00:00:00 UTC
    // 0 => 2001-01-01T00:00:00Z
    const date = coreTimestampToDate(0);
    expect(date.getUTCFullYear()).toBe(2001);
    expect(date.getUTCMonth()).toBe(0); // January
    expect(date.getUTCDate()).toBe(1);
  });

  it("converts a known timestamp correctly", () => {
    // 788918400 seconds after 2001-01-01 = 2026-01-01 (approx)
    const date = coreTimestampToDate(788918400);
    expect(date.getUTCFullYear()).toBe(2026);
  });

  it("returns null for null input", () => {
    const date = coreTimestampToDate(null);
    expect(date).toBeNull();
  });
});

describe("parseApplePodcastsRow", () => {
  const baseRow: RawPodcastRow = {
    ZTITLE: "Episode Title",
    ZPODCAST_TITLE: "Show Name",
    ZAUTHOR: "Host Name",
    ZLASTDATEPLAYED: 788918400,
    ZPUBDATE: 788000000,
    ZDURATION: 3600,
    ZPLAYSTATE: 2,
    ZUUID: "abc-123",
    ZITEMDESCRIPTIONWITHOUTHTML: "A great episode about things.",
    ZWEBPAGEURL: "https://example.com/ep1",
  };

  it("parses a complete row into an entry shape", () => {
    const result = parseApplePodcastsRow(baseRow);
    expect(result.title).toBe("Episode Title");
    expect(result.podcastName).toBe("Show Name");
    expect(result.author).toBe("Host Name");
    expect(result.durationMinutes).toBe(60);
    expect(result.uuid).toBe("abc-123");
    expect(result.source).toBe("https://example.com/ep1");
    expect(result.datePlayed).toBeInstanceOf(Date);
  });

  it("handles missing optional fields gracefully", () => {
    const sparse: RawPodcastRow = {
      ZTITLE: "Ep",
      ZPODCAST_TITLE: null,
      ZAUTHOR: null,
      ZLASTDATEPLAYED: 788918400,
      ZPUBDATE: null,
      ZDURATION: null,
      ZPLAYSTATE: 2,
      ZUUID: "xyz",
      ZITEMDESCRIPTIONWITHOUTHTML: null,
      ZWEBPAGEURL: null,
    };
    const result = parseApplePodcastsRow(sparse);
    expect(result.title).toBe("Ep");
    expect(result.podcastName).toBeNull();
    expect(result.author).toBeNull();
    expect(result.durationMinutes).toBeNull();
    expect(result.description).toBeNull();
  });

  it("formats title with podcast name prefix", () => {
    const result = parseApplePodcastsRow(baseRow);
    expect(result.formattedTitle).toBe("Show Name: Episode Title");
  });

  it("uses just episode title when no podcast name", () => {
    const row = { ...baseRow, ZPODCAST_TITLE: null };
    const result = parseApplePodcastsRow(row);
    expect(result.formattedTitle).toBe("Episode Title");
  });
});

describe("filterNewEpisodes", () => {
  it("filters out episodes already synced by UUID", () => {
    const episodes = [
      { uuid: "aaa", formattedTitle: "Ep 1" },
      { uuid: "bbb", formattedTitle: "Ep 2" },
      { uuid: "ccc", formattedTitle: "Ep 3" },
    ] as ReturnType<typeof parseApplePodcastsRow>[];

    const existingUuids = new Set(["aaa", "ccc"]);
    const result = filterNewEpisodes(episodes, existingUuids);
    expect(result).toHaveLength(1);
    expect(result[0].uuid).toBe("bbb");
  });

  it("returns all episodes if none synced yet", () => {
    const episodes = [
      { uuid: "aaa", formattedTitle: "Ep 1" },
      { uuid: "bbb", formattedTitle: "Ep 2" },
    ] as ReturnType<typeof parseApplePodcastsRow>[];

    const result = filterNewEpisodes(episodes, new Set());
    expect(result).toHaveLength(2);
  });

  it("returns empty if all already synced", () => {
    const episodes = [
      { uuid: "aaa", formattedTitle: "Ep 1" },
    ] as ReturnType<typeof parseApplePodcastsRow>[];

    const result = filterNewEpisodes(episodes, new Set(["aaa"]));
    expect(result).toHaveLength(0);
  });
});
