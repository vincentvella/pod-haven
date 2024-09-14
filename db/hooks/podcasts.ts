import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { podcasts } from "../schema";
import { db } from "../db";

export function usePodcasts() {
  return useLiveQuery(db.select().from(podcasts));
}
