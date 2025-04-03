import { resources } from "@/lib/db/schema/resources";
import { nanoid } from "@/lib/utils";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const embeddings = sqliteTable(
  "embeddings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: text("resource_id").references(() => resources.id, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    // Turso has built-in vector search capabilities
    // We're storing the embedding as a JSON string
    embedding: text("embedding", { mode: "json" }).notNull(),
  },
  (table) => ({
    // Turso supports full-text search natively
    contentIndex: index("contentIndex").on(table.content),
  })
);
