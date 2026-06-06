CREATE TABLE `newsletters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(500) NOT NULL,
	`titleAr` varchar(500) NOT NULL,
	`contentEn` text NOT NULL,
	`contentAr` text NOT NULL,
	`issueNumber` varchar(50),
	`publishDate` timestamp,
	`pdfUrl` text,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletters_id` PRIMARY KEY(`id`)
);
