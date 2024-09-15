import { AddTrack } from "react-native-track-player";
import { episodes as episodesTable } from "@/db/schema";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";

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

export function convertItemsToTracks(
  items: ReturnType<
    typeof useReverseChronologicalUnwatchedEpisodesWithPodcastInfo
  >["data"],
): AddTrack[] {
  return items.reduce((acc, item) => {
    if (!item.episodes.enclosures || item.episodes.enclosures.length === 0) {
      return acc;
    }

    const track = {
      id: item.episodes.episodeId,
      title: item.episodes.title ?? "",
      url: item.episodes.enclosures[0].url,
      artist: item.podcasts?.collectionName ?? "",
      artwork: item.podcasts?.artworkUrl600 ?? "",
      duration: convertItunesDuraitonToSeconds(
        item.episodes.itunes_duration ?? "00",
      ),
    } satisfies AddTrack;

    acc.push(track);

    return acc;
  }, [] as AddTrack[]);
}
