import { pgTable, serial, text, real, boolean, timestamp } from "drizzle-orm/pg-core";

export const songsTable = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  duration: real("duration"),
  audioFilename: text("audio_filename").notNull(),
  posterFilename: text("poster_filename"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Song = typeof songsTable.$inferSelect;
export type InsertSong = typeof songsTable.$inferInsert;
