ALTER TABLE proposals ADD `created_at` text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `proposals` (`created_at`);