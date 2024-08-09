CREATE TABLE `imagelink` (
	`reportId` integer NOT NULL,
	`imageUrl` text NOT NULL,
	FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `report` DROP COLUMN `imageUrl`;