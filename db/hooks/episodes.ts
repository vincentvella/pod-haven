import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { episodes } from "../schema";
import { db } from "../db";
import { asc, ne, or } from "drizzle-orm";

export function useEpisodes() {
  return useLiveQuery(
    db
      .select()
      .from(episodes)
      .orderBy(asc(episodes.created))
      .where(or(ne(episodes.listened, true), ne(episodes.dismissed, true))),
  );
}
