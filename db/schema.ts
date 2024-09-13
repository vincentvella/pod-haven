import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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
  genreIds: text("genreIds"), // array of strings separated by commas (,) in the db file
  genres: text("genres"), // array of strings separated by commas (,) in the db file
});
