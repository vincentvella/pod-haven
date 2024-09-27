import { db } from "@/db/db";
import {
  podcasts as podcastsTable,
  episodes as episodesTable,
} from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import parse from "rss-to-json";

type Podcast = typeof podcastsTable.$inferSelect;
type Episode = typeof episodesTable.$inferSelect;

type OnCheckingPodcasts = (
  podcast: Podcast,
  position: number,
  total: number,
) => void;
type OnFoundEpisodes = (episodesToDownload: number) => void;
type OnSavingEpisodes = (episodesToSave: number) => void;

export async function fetchNewPodcasts(
  savedPodcasts: Podcast[],
  onCheckingPodcasts: OnCheckingPodcasts,
  onFoundEpisodes: OnFoundEpisodes,
  onSavingEpisodes: OnSavingEpisodes,
) {
  for (const [i, podcast] of savedPodcasts.entries()) {
    onCheckingPodcasts(podcast, i, savedPodcasts.length);
    if (!podcast.feedUrl) continue;
    const lastSavedPodcast = await db
      .select()
      .from(episodesTable)
      .where(eq(episodesTable.podcastId, podcast.id))
      .orderBy(desc(episodesTable.created))
      .limit(1);
    const response = await parse(podcast.feedUrl);
    if (!lastSavedPodcast.length) {
      onFoundEpisodes(response.items.length);
      const items = response.items.map((item) => ({
        ...item,
        id: undefined,
        episodeId: item.id,
        podcastId: podcast.id,
      }));
      await db.insert(episodesTable).values(items).onConflictDoNothing();
      continue;
    } else {
      const lastSavedEpisode = lastSavedPodcast[0];
      const itemIndex = response.items.findIndex(
        (item: any) => item.title === lastSavedEpisode.title,
      );
      console.log(
        `Found an episode for ${podcast.collectionName}... saving episodes newer than: ${new Date(lastSavedEpisode.created ?? 0).toLocaleString()}`,
      );
      onFoundEpisodes(itemIndex);
      // refactor the below code to use a reduce function and add the podcastId to the item
      const items = response.items.reduce((acc, item) => {
        if (!item.created) {
          return acc;
        } else if (!lastSavedEpisode.created) {
          // if the last saved episode doesn't have a created date, add any podcasts newer than a week
          if (item.created > Date.now() - 7 * 24 * 60 * 60 * 1000) {
            acc.push({ ...item, episodeId: item.id, podcastId: podcast.id });
            return acc;
          }
          // if the last saved episode doesn't have a created date and the current item is newer than a week, ignore it
          return acc;
        } else if (item.created > lastSavedEpisode.created) {
          // if the current item is newer than the last saved episode, add it
          acc.push({ ...item, episodeId: item.id, podcastId: podcast.id });
          return acc;
        } else {
          return acc;
        }
      }, [] as Episode[]);
      if (items.length > 0) {
        console.log(`Saving ${items.length} episodes`);
        onSavingEpisodes(items.length);
        await db.insert(episodesTable).values(items).onConflictDoNothing();
      } else {
        console.log("No new episodes found");
      }
    }
  }
}
