CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`summaryEn` text,
	`summaryAr` text,
	`contentEn` text NOT NULL,
	`contentAr` text NOT NULL,
	`coverImageUrl` text,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`userName` varchar(255),
	`contentType` varchar(20) NOT NULL,
	`contentId` varchar(100) NOT NULL,
	`text` text NOT NULL,
	`editToken` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`imageUrl` text NOT NULL,
	`thumbnailUrl` text,
	`imageUrlAr` text,
	`thumbnailUrlAr` text,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`guestName` varchar(255),
	`contentType` varchar(20) NOT NULL,
	`contentId` varchar(100) NOT NULL,
	`value` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`duration` varchar(20),
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
