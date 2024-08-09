CREATE TABLE `adminkey` (
	`key` text PRIMARY KEY NOT NULL,
	`issue` text DEFAULT 'unused' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;