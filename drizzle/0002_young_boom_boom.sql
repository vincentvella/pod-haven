ALTER TABLE `episodes` ADD `watched` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `episodes` ADD `dismissed` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `podcasts` DROP COLUMN `watched`;--> statement-breakpoint
ALTER TABLE `podcasts` DROP COLUMN `dismissed`;