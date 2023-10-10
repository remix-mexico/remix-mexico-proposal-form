CREATE TABLE `proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_email` text NOT NULL,
	`owner_name` text NOT NULL,
	`title` text NOT NULL,
	`description` text(250),
	`read` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proposals_owner_email_unique` ON `proposals` (`owner_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `id_idx` ON `proposals` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `owner_email_idx` ON `proposals` (`owner_email`);--> statement-breakpoint
CREATE INDEX `read_idx` ON `proposals` (`read`);