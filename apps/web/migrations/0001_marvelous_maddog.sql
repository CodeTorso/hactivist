CREATE TABLE `report` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`phone` integer,
	`issue` text DEFAULT 'miscellaneous' NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`resolved` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user';