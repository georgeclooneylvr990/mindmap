import { homedir } from "os";
import { join } from "path";

// Apple Core Data epoch: January 1, 2001 00:00:00 UTC
const CORE_DATA_EPOCH = new Date("2001-01-01T00:00:00Z").getTime();

export interface RawPodcastRow {
  ZTITLE: string;
  ZPODCAST_TITLE: string | null;
  ZAUTHOR: string | null;
  ZLASTDATEPLAYED: number | null;
  ZPUBDATE: number | null;
  ZDURATION: number | null;
  ZPLAYSTATE: number;
  ZUUID: string;
  ZITEMDESCRIPTIONWITHOUTHTML: string | null;
  ZWEBPAGEURL: string | null;
}

export interface ParsedEpisode {
  title: string;
  formattedTitle: string;
  podcastName: string | null;
  author: string | null;
  datePlayed: Date | null;
  datePub: Date | null;
  durationMinutes: number | null;
  uuid: string;
  description: string | null;
  source: string | null;
}

export function coreTimestampToDate(
  timestamp: number | null
): Date | null {
  if (timestamp === null || timestamp === undefined) return null;
  return new Date(CORE_DATA_EPOCH + timestamp * 1000);
}

export function parseApplePodcastsRow(row: RawPodcastRow): ParsedEpisode {
  const podcastName = row.ZPODCAST_TITLE || null;
  const title = row.ZTITLE;
  const formattedTitle = podcastName ? `${podcastName}: ${title}` : title;

  return {
    title,
    formattedTitle,
    podcastName,
    author: row.ZAUTHOR || null,
    datePlayed: coreTimestampToDate(row.ZLASTDATEPLAYED),
    datePub: coreTimestampToDate(row.ZPUBDATE),
    durationMinutes: row.ZDURATION ? Math.round(row.ZDURATION / 60) : null,
    uuid: row.ZUUID,
    description: row.ZITEMDESCRIPTIONWITHOUTHTML || null,
    source: row.ZWEBPAGEURL || null,
  };
}

export function filterNewEpisodes(
  episodes: ParsedEpisode[],
  existingUuids: Set<string>
): ParsedEpisode[] {
  return episodes.filter((ep) => !existingUuids.has(ep.uuid));
}

export function getApplePodcastsDbPath(): string {
  return join(
    homedir(),
    "Library",
    "Group Containers",
    "243LU875E5.groups.com.apple.podcasts",
    "Documents",
    "MTLibrary.sqlite"
  );
}

export const PLAYED_EPISODES_QUERY = `
  SELECT
    e.ZTITLE,
    p.ZTITLE as ZPODCAST_TITLE,
    e.ZAUTHOR,
    e.ZLASTDATEPLAYED,
    e.ZPUBDATE,
    e.ZDURATION,
    e.ZPLAYSTATE,
    e.ZUUID,
    e.ZITEMDESCRIPTIONWITHOUTHTML,
    e.ZWEBPAGEURL
  FROM ZMTEPISODE e
  LEFT JOIN ZMTPODCAST p ON e.ZPODCAST = p.Z_PK
  WHERE e.ZLASTDATEPLAYED IS NOT NULL
  ORDER BY e.ZLASTDATEPLAYED DESC
`;
