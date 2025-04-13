import {
  integer,
  pgEnum,
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
  views: integer("views").notNull().default(0), // NEW: Tracks video views
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }), // Foreign key reference to users table
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(), // Automatically sets the timestamp
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Automatically updates the timestamp
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

export const videoRatingsTable = pgTable(
  "video_ratings",
  {
    videoId: integer("video_id")
      .notNull()
      .references(() => videosTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    status: text("status").notNull().$type<"LIKED" | "DISLIKED">(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.videoId, t.userId] }), // Composite Primary Key
  ]
);

export const historyTable = pgTable(
  "history",
  {
    videoId: integer("video_id")
      .notNull()
      .references(() => videosTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.videoId, table.userId] })]
);

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  originalCommentId: integer("original_comment_id").references(
    () => commentsTable.id,
    { onDelete: "cascade" }
  ),
  replyToCommentId: integer("reply_to_comment_id").references(
    () => commentsTable.id,
    { onDelete: "cascade" }
  ),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  videoId: integer("video_id")
    .notNull()
    .references(() => videosTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Define enum for status
export const ratingStatusEnum = pgEnum("rating_status", ["LIKED", "DISLIKED"]);

export const commentRatingsTable = pgTable(
  "comment_ratings",
  {
    commentId: integer("comment_id")
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    status: ratingStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.commentId, table.userId] })]
);
