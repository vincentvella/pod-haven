import { AddTrack } from "react-native-track-player";
import { episodes as episodesTable } from "@/db/schema";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";
import { documentDirectory, getInfoAsync } from "expo-file-system";
import { getFileExtension } from "@/services/fs/getFileExtension";

export type Episode = typeof episodesTable.$inferSelect;

export function convertItunesDuraitonToSeconds(itunesDuration: string) {
  // itunes duration is in the format of HH:MM:SS or MM:SS or SS
  // we need to account for the possibility of MM:SS or SS so check the length of the split
  const split = itunesDuration.split(":");
  if (split.length === 3) {
    return (
      parseInt(split[0], 10) * 3600 +
      parseInt(split[1], 10) * 60 +
      parseInt(split[2], 10)
    );
  } else if (split.length === 2) {
    return parseInt(split[0], 10) * 60 + parseInt(split[1], 10);
  } else {
    return parseInt(split[0], 10);
  }
}

export async function convertItemsToTracks(
  items: ReturnType<
    typeof useReverseChronologicalUnwatchedEpisodesWithPodcastInfo
  >["data"],
): Promise<AddTrack[]> {
  const tracks: AddTrack[] = [];

  for (const item of items) {
    if (!item.episodes.enclosures || item.episodes.enclosures.length === 0) {
      continue;
    }

    const { exists, uri } = await getInfoAsync(
      `${documentDirectory}${item.episodes.id}.${getFileExtension(item.episodes.enclosures[0].url)}`,
    );
    const track = {
      id: item.episodes.episodeId,
      title: item.episodes.title ?? "",
      url: exists ? uri : item.episodes.enclosures[0].url,
      artist: item.podcasts?.collectionName ?? "",
      artwork: item.podcasts?.artworkUrl600 ?? "",
      duration: convertItunesDuraitonToSeconds(
        item.episodes.itunes_duration ?? "00",
      ),
      headers: {
        id: `${item.episodes.id}`,
        ext: getFileExtension(item.episodes.enclosures[0].url),
      },
    } satisfies AddTrack;

    tracks.push(track);
  }
  return tracks;
}
