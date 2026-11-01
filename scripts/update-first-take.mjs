import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const playlistId =
  process.env.FIRST_TAKE_PLAYLIST_ID ||
  "PLeLvSt3A0Ddk9lGjNqmzT0ctVPA5xfinn";
const apiKey = process.env.YOUTUBE_API_KEY;
const outputPath = resolve("public/song_data/first_take.json");

if (!apiKey) {
  throw new Error(
    "YOUTUBE_API_KEY is not set. Set it in .env.local or the GitHub Actions secret.",
  );
}

const songs = [];
let pageToken;
const normalizeTitle = (value) => value.replace(/\u00a0/g, " ").trim();
const removeChannelName = (value) => {
  const normalized = normalizeTitle(value);
  const channelIndex = normalized.search(/THE FIRST TAKE/i);

  if (channelIndex === -1) {
    return normalized;
  }

  return normalized
    .slice(0, channelIndex)
    .replace(/\s*\/\s*[^/]*$/, "")
    .trim();
};

do {
  const params = new URLSearchParams({
    part: "snippet",
    playlistId,
    maxResults: "50",
    key: apiKey,
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
  );
  const body = await response.json();

  if (!response.ok) {
    const reason = body.error?.errors?.[0]?.reason ?? "unknown";
    throw new Error(
      `YouTube API request failed (${response.status}, ${reason}): ${body.error?.message ?? "unknown error"}`,
    );
  }

  for (const item of body.items ?? []) {
    const videoId = item.snippet?.resourceId?.videoId;
    const rawTitle = item.snippet?.title;

    if (
      !videoId ||
      !rawTitle ||
      rawTitle === "Private video" ||
      rawTitle === "Deleted video"
    ) {
      continue;
    }

    songs.push({
      id: videoId,
      title: removeChannelName(rawTitle),
      artist: "",
      url: `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: item.snippet.publishedAt ?? null,
    });
  }

  pageToken = body.nextPageToken;
} while (pageToken);

if (songs.length === 0) {
  throw new Error("No public videos were found in the playlist.");
}

const temporaryPath = `${outputPath}.tmp`;
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(temporaryPath, `${JSON.stringify(songs, null, 2)}\n`, "utf8");
await rename(temporaryPath, outputPath);

console.log(`Updated ${outputPath} with ${songs.length} videos.`);
