import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const podcasts = sqliteTable("podcasts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // make columns for each field of the podcast object in the exact order as above
  wrapperType: text("wrapperType"),
  kind: text("kind"),
  collectionId: integer("collectionId"),
  trackId: integer("trackId"),
  artistName: text("artistName"),
  collectionName: text("collectionName"),
  trackName: text("trackName"),
  collectionCensoredName: text("collectionCensoredName"),
  trackCensoredName: text("trackCensoredName"),
  collectionViewUrl: text("collectionViewUrl"),
  feedUrl: text("feedUrl"),
  trackViewUrl: text("trackViewUrl"),
  artworkUrl30: text("artworkUrl30"),
  artworkUrl60: text("artworkUrl60"),
  artworkUrl100: text("artworkUrl100"),
  artworkUrl600: text("artworkUrl600"),
  collectionPrice: integer("collectionPrice"),
  trackPrice: integer("trackPrice"),
  collectionHdPrice: integer("collectionHdPrice"),
  releaseDate: text("releaseDate"),
  collectionExplicitness: text("collectionExplicitness"),
  trackExplicitness: text("trackExplicitness"),
  trackCount: integer("trackCount"),
  trackTimeMillis: integer("trackTimeMillis"),
  country: text("country"),
  currency: text("currency"),
  primaryGenreName: text("primaryGenreName"),
  contentAdvisoryRating: text("contentAdvisoryRating"),
  genreIds: text("genreIds", { mode: "json" }), // stringified array of genre ids
  genres: text("genres", { mode: "json" }), // stringified array of genre names
});

export const episodes = sqliteTable("episodes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  episodeId: text("episodeId"),
  title: text("title"),
  description: text("description"),
  link: text("link"),
  published: integer("published"),
  created: integer("created"),
  category: text("category", { mode: "json" }),
  content: text("content"),
  enclosures: text("enclosures", { mode: "json" }).$type<
    {
      length: string;
      type: string;
      url: string;
    }[]
  >(),
  content_encoded: text("content_encoded"),
  itunes_duration: text("itunes_duration"),
  itunes_episode_type: text("itunes_episode_type"),
  media: text("media", { mode: "json" }),
  podcastId: integer("podcastId").references(() => podcasts.id),
  listened: integer("listened", { mode: "boolean" }).default(false),
  dismissed: integer("dismissed", { mode: "boolean" }).default(false),
  progress: integer("progress").default(0),
});
