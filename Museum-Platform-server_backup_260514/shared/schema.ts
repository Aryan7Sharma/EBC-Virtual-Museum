import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "./models/auth";
export * from "./models/auth";

export const artifactStatusEnum = pgEnum("artifact_status", ["draft", "published"]);
export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "rejected"]);
export const categoryStatusEnum = pgEnum("category_status", ["active", "inactive"]);


// schema.activity.ts — add to your shared/schema.ts

export const activityTypeEnum = pgEnum("activity_type", [
  "artifact",
  "comment",
  "user",
]);

// Add this new enum (alongside your other enums at the top)
export const artifactDisplayLocationEnum = pgEnum("artifact_display_location", [
  "in_museum",
  "returned",
]);

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // One of: "artifact" | "comment" | "user"
  type: activityTypeEnum("type").notNull(),

  // Human-readable description shown in the dashboard
  // e.g. "New artifact added: Ancient Vase"
  title: varchar("title", { length: 500 }).notNull(),

  // Optional: reference to the entity that triggered the activity
  entityId: varchar("entity_id", { length: 255 }),

  // Optional: which user triggered this (null = system)
  actorId: varchar("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  parentId: varchar("parent_id"),
  order: integer("order").default(0),
  status: categoryStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const artifacts = pgTable("artifacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  longDescription: text("long_description"),
  categoryId: varchar("category_id").references(() => categories.id),
  material: varchar("material", { length: 100 }),
  region: varchar("region", { length: 100 }),
  period: varchar("period", { length: 100 }),
  year: varchar("year", { length: 50 }),
  dimensions: jsonb("dimensions").$type<{ width?: string; height?: string; depth?: string }>(),
  location: varchar("location", { length: 255 }),
  acquisitionDate: varchar("acquisition_date"),
  has3dModel: boolean("has_3d_model").default(false),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  modelUrl: varchar("model_url", { length: 500 }),
  status: artifactStatusEnum("status").default("published"),
  views: integer("views").default(0),
  displayLocation: artifactDisplayLocationEnum("display_location").default("in_museum"),
  featured: boolean("featured").default(true),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const artifactImages = pgTable("artifact_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artifactId: varchar("artifact_id").references(() => artifacts.id, { onDelete: "cascade" }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  isPrimary: boolean("is_primary").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artifactId: varchar("artifact_id").references(() => artifacts.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").notNull(),
  userName: varchar("user_name", { length: 100 }),
  userImage: varchar("user_image", { length: 500 }),
  content: text("content").notNull(),
  status: commentStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const artifactTags = pgTable("artifact_tags", {
  artifactId: varchar("artifact_id").references(() => artifacts.id, { onDelete: "cascade" }).notNull(),
  tagId: varchar("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  artifacts: many(artifacts),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
}));

export const artifactsRelations = relations(artifacts, ({ one, many }) => ({
  category: one(categories, {
    fields: [artifacts.categoryId],
    references: [categories.id],
  }),
  images: many(artifactImages),
  comments: many(comments),
  artifactTags: many(artifactTags),
}));

export const artifactImagesRelations = relations(artifactImages, ({ one }) => ({
  artifact: one(artifacts, {
    fields: [artifactImages.artifactId],
    references: [artifacts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  artifact: one(artifacts, {
    fields: [comments.artifactId],
    references: [artifacts.id],
  }),
}));

export const artifactTagsRelations = relations(artifactTags, ({ one }) => ({
  artifact: one(artifacts, {
    fields: [artifactTags.artifactId],
    references: [artifacts.id],
  }),
  tag: one(tags, {
    fields: [artifactTags.tagId],
    references: [tags.id],
  }),
}));

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertArtifactSchema = createInsertSchema(artifacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertArtifactImageSchema = createInsertSchema(artifactImages).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertArtifact = z.infer<typeof insertArtifactSchema>;
export type Artifact = typeof artifacts.$inferSelect;

export type InsertArtifactImage = z.infer<typeof insertArtifactImageSchema>;
export type ArtifactImage = typeof artifactImages.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type ArtifactWithRelations = Artifact & {
  category?: Category | null;
  images?: ArtifactImage[];
};
