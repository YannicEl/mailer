ALTER TABLE `contact` RENAME COLUMN `message_id` TO `email`;--> statement-breakpoint
DROP INDEX IF EXISTS `contact_message_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `contact_email_unique` ON `contact` (`email`);