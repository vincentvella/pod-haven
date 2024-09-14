CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`episodeId` text,
	`title` text,
	`description` text,
	`link` text,
	`published` integer,
	`created` integer,
	`category` text,
	`content` text,
	`enclosures` text,
	`content_encoded` text,
	`itunes_duration` text,
	`itunes_episode_type` text,
	`media` text,
	`podcastId` integer,
	FOREIGN KEY (`podcastId`) REFERENCES `podcasts`(`id`) ON UPDATE no action ON DELETE no action
);
