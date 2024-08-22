CREATE TABLE `domain_dkim_token` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`domain_id` integer NOT NULL,
	`value` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`domain_id`) REFERENCES `domain`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `domain_dkim_token_value_unique` ON `domain_dkim_token` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `domain_dkim_token_domain_id_value_unique` ON `domain_dkim_token` (`domain_id`,`value`);