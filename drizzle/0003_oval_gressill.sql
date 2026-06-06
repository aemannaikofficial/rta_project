ALTER TABLE `newsletters` ADD `subtitleEn` varchar(500);--> statement-breakpoint
ALTER TABLE `newsletters` ADD `subtitleAr` varchar(500);--> statement-breakpoint
ALTER TABLE `newsletters` ADD `monthEn` varchar(100);--> statement-breakpoint
ALTER TABLE `newsletters` ADD `monthAr` varchar(100);--> statement-breakpoint
ALTER TABLE `newsletters` ADD `year` varchar(20);--> statement-breakpoint
ALTER TABLE `newsletters` ADD `forewordEn` text;--> statement-breakpoint
ALTER TABLE `newsletters` ADD `forewordAr` text;--> statement-breakpoint
ALTER TABLE `newsletters` ADD `sections` text;--> statement-breakpoint
ALTER TABLE `newsletters` ADD `referencesCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `newsletters` ADD `previewUrl` text;