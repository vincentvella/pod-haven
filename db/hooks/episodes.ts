import { episodes, podcasts } from "../schema";
import { db } from "../db";
import { and, asc, desc, eq } from "drizzle-orm";
import useQuery from "./useQuery";

export function useReverseChronologicalUnwatchedEpisodesWithPodcastInfo() {
  return useQuery(
    async () =>
      await db
        .select()
        .from(episodes)
        .orderBy(asc(episodes.created))
        .leftJoin(podcasts, eq(episodes.podcastId, podcasts.id))
        .where(
          and(eq(episodes.listened, false), eq(episodes.dismissed, false)),
        ),
    [],
    5000,
  );
}

export function useEpisodes(podcastId: number) {
  return useQuery(
    async () =>
      await db
        .select()
        .from(episodes)
        .orderBy(desc(episodes.created))
        .where(eq(episodes.podcastId, podcastId)),
    [],
  );
}
