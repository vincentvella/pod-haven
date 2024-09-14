import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { episodes } from "../schema";
import { db } from "../db";
import { and, asc, desc, eq, ne, or } from "drizzle-orm";

export function useReverseChronologicalUnwatchedEpisodes() {
  return useLiveQuery(
    db
      .select()
      .from(episodes)
      .orderBy(asc(episodes.created))
      .where(and(eq(episodes.listened, false), eq(episodes.dismissed, false))),
  );
}

export function useEpisodes(podcastId: number) {
  return useLiveQuery(
    db
      .select()
      .from(episodes)
      .orderBy(desc(episodes.created))
      .where(eq(episodes.podcastId, podcastId)),
  );
}
