import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: varchar({ length: 255 }),
  gid: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  src: varchar("src", { length: 500 }).notNull(), // Video URL
  thumbnail: varchar("thumbnail", { length: 500 }), // Thumbnail URL
  duration: integer("duration").notNull(), // Video duration in seconds
  user_id: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }), // Foreign key reference to users table
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(), // Automatically sets the timestamp
});

export const watchLaterTable = pgTable(
  "watch_laters",
  {
    videoId: integer("video_id")
      .notNull()
      .references(() => videosTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.videoId, table.userId] })]
);

export const subscribersTable = pgTable(
  "subscribers",
  {
    channelId: integer("channel_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.channelId, table.userId] }), // Composite Primary Key
  ]
);
