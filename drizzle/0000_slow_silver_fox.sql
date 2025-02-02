CREATE TABLE `podcasts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wrapperType` text,
	`kind` text,
	`collectionId` integer,
	`trackId` integer,
	`artistName` text,
	`collectionName` text,
	`trackName` text,
	`collectionCensoredName` text,
	`trackCensoredName` text,
	`collectionViewUrl` text,
	`feedUrl` text,
	`trackViewUrl` text,
	`artworkUrl30` text,
	`artworkUrl60` text,
	`artworkUrl100` text,
	`artworkUrl600` text,
	`collectionPrice` integer,
	`trackPrice` integer,
	`collectionHdPrice` integer,
	`releaseDate` text,
	`collectionExplicitness` text,
	`trackExplicitness` text,
	`trackCount` integer,
	`trackTimeMillis` integer,
	`country` text,
	`currency` text,
	`primaryGenreName` text,
	`contentAdvisoryRating` text,
	`genreIds` text,
	`genres` text,
	`watched` integer DEFAULT false,
	`dismissed` integer DEFAULT false
);
