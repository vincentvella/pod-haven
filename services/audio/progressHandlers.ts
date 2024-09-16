import { db } from "@/db/db";
import { episodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function markEpisodeAsListened(id: string) {
  await db
    .update(episodes)
    .set({ listened: true })
    .where(eq(episodes.episodeId, id));
}

export async function saveEpisodeProgress(id: string, progress: number) {
  await db.update(episodes).set({ progress }).where(eq(episodes.episodeId, id));
}
