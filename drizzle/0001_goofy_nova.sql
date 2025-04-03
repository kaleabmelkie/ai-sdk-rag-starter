PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_resources`("id", "content", "created_at", "updated_at") SELECT "id", "content", "created_at", "updated_at" FROM `resources`;--> statement-breakpoint
DROP TABLE `resources`;--> statement-breakpoint
ALTER TABLE `__new_resources` RENAME TO `resources`;--> statement-breakpoint
PRAGMA foreign_keys=ON;