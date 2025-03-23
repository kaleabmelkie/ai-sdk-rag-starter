import { resources } from "@/lib/db/schema/resources";
import { nanoid } from "@/lib/utils";
import { index, pgTable, text, varchar, vector } from "drizzle-orm/pg-core";

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar("resource_id", { length: 21 }).references(
      () => resources.id,
      { onDelete: "cascade" }
    ),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 2000 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "ivfflat",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);
