import { AddTrack } from "react-native-track-player";
import { episodes as episodesTable } from "@/db/schema";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";

export type Episode = typeof episodesTable.$inferSelect;

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
      duration: parseInt(item.episodes.enclosures[0].length ?? "0", 10),
    } satisfies AddTrack;

    acc.push(track);

    return acc;
  }, [] as AddTrack[]);
}
