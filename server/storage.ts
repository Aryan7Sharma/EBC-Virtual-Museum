import { eq, desc, asc, and, or, like, sql, count } from "drizzle-orm";
import { db } from "./config/db";
import bcrypt from "bcrypt";
import {
  users,
  artifacts,
  artifactImages,
  comments,
  categories,
  tags,
  artifactTags,
  type User,
  type UpsertUser,
  type Artifact,
  type InsertArtifact,
  type ArtifactImage,
  type InsertArtifactImage,
  type Comment,
  type InsertComment,
  type Category,
  type InsertCategory,
  type Tag,
  type InsertTag,
  type ArtifactWithRelations,
} from "@shared/schema";


const SALT_ROUNDS = 10;
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  getArtifacts(options?: {
    search?: string;
    categoryId?: string;
    featured?: boolean;
    status?: string;
    sortBy?: string;
    periodFrom?: string;
    periodTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ artifacts: ArtifactWithRelations[]; total: number }>;
  getArtifact(id: string): Promise<ArtifactWithRelations | undefined>;
  createArtifact(artifact: InsertArtifact): Promise<Artifact>;
  updateArtifact(id: string, artifact: Partial<InsertArtifact>): Promise<Artifact | undefined>;
  deleteArtifact(id: string): Promise<void>;
  getRelatedArtifacts(id: string, limit?: number): Promise<ArtifactWithRelations[]>;
  incrementArtifactViews(id: string): Promise<void>;
  getSearchSuggestions(query: string): Promise<{ type: string; value: string; count?: number }[]>;
  getPopularArtifacts(limit?: number): Promise<ArtifactWithRelations[]>;

  getArtifactImages(artifactId: string): Promise<ArtifactImage[]>;
  createArtifactImage(image: InsertArtifactImage): Promise<ArtifactImage>;
  deleteArtifactImage(id: string): Promise<void>;

  getCategories(withCount?: boolean): Promise<(Category & { artifactCount?: number })[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;

  getComments(options?: { artifactId?: string; status?: string }): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateCommentStatus(id: string, status: string): Promise<Comment | undefined>;
  deleteComment(id: string): Promise<void>;

  getStats(): Promise<{
    totalArtifacts: number;
    totalUsers: number;
    pendingComments: number;
    totalViews: number;
  }>;
}

export class DatabaseStorage implements IStorage {
    static getUser(userId: string) {
        throw new Error("Method not implemented.");
    }
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
  }
   async verifyPassword(email: string, password: string): Promise<User | null> {
      const user = await this.getUserByEmail(email);
      
      if (!user || !user.passwordHash) {
        return null;
      }
  
      const isValid = await bcrypt.compare(password, user.passwordHash);
      return isValid ? user : null;
    }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username)).limit(1);
    return user;
  }

  async createUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
    }).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getSearchSuggestions(query: string): Promise<{ type: string; value: string; count?: number }[]> {
    const suggestions: { type: string; value: string; count?: number }[] = [];
    const lowerQuery = query.toLowerCase();

    const titleResults = await db
      .select({ title: artifacts.title })
      .from(artifacts)
      .where(and(
        eq(artifacts.status, "published"),
        sql`LOWER(${artifacts.title}) LIKE ${'%' + lowerQuery + '%'}`
      ))
      .limit(5);
    
    titleResults.forEach(r => {
      if (r.title) suggestions.push({ type: "artifact", value: r.title });
    });

    const categoryResults = await db
      .select({ name: categories.name })
      .from(categories)
      .where(sql`LOWER(${categories.name}) LIKE ${'%' + lowerQuery + '%'}`)
      .limit(3);
    
    categoryResults.forEach(r => {
      if (r.name) suggestions.push({ type: "category", value: r.name });
    });

    const materialResults = await db
      .selectDistinct({ material: artifacts.material })
      .from(artifacts)
      .where(and(
        eq(artifacts.status, "published"),
        sql`LOWER(${artifacts.material}) LIKE ${'%' + lowerQuery + '%'}`
      ))
      .limit(3);
    
    materialResults.forEach(r => {
      if (r.material) suggestions.push({ type: "material", value: r.material });
    });

    const regionResults = await db
      .selectDistinct({ region: artifacts.region })
      .from(artifacts)
      .where(and(
        eq(artifacts.status, "published"),
        sql`LOWER(${artifacts.region}) LIKE ${'%' + lowerQuery + '%'}`
      ))
      .limit(3);
    
    regionResults.forEach(r => {
      if (r.region) suggestions.push({ type: "region", value: r.region });
    });

    return suggestions.slice(0, 10);
  }

  async getArtifacts(options?: {
    search?: string;
    categoryId?: string;
    featured?: boolean;
    status?: string;
    sortBy?: string;
    periodFrom?: string;
    periodTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{ artifacts: ArtifactWithRelations[]; total: number }> {
    const {
      search,
      categoryId,
      featured,
      status = "published",
      sortBy = "newest",
      periodFrom,
      periodTo,
      page = 1,
      limit = 12,
    } = options || {};

    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(artifacts.status, status as "draft" | "published"));
    }
    if (categoryId) {
      conditions.push(eq(artifacts.categoryId, categoryId));
    }
    if (featured !== undefined) {
      conditions.push(eq(artifacts.featured, featured));
    }
    if (search) {
      conditions.push(
        or(
          like(artifacts.title, `%${search}%`),
          like(artifacts.shortDescription, `%${search}%`),
          like(artifacts.material, `%${search}%`),
          like(artifacts.region, `%${search}%`)
        )
      );
    }
    if (periodFrom) {
      conditions.push(sql`${artifacts.year} >= ${periodFrom}`);
    }
    if (periodTo) {
      conditions.push(sql`${artifacts.year} <= ${periodTo}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(artifacts)
      .where(whereClause);

    let orderBy;
    switch (sortBy) {
      case "oldest":
        orderBy = asc(artifacts.createdAt);
        break;
      case "a-z":
        orderBy = asc(artifacts.title);
        break;
      case "z-a":
        orderBy = desc(artifacts.title);
        break;
      default:
        orderBy = desc(artifacts.createdAt);
    }

    const offset = (page - 1) * limit;

    const results = await db
      .select()
      .from(artifacts)
      .leftJoin(categories, eq(artifacts.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const artifactIds = results.map((r) => r.artifacts.id);
    const images = artifactIds.length > 0
      ? await db
          .select()
          .from(artifactImages)
          .where(sql`${artifactImages.artifactId} IN (${sql.join(artifactIds.map(id => sql`${id}`), sql`, `)})`)
      : [];

    const artifactsWithRelations: ArtifactWithRelations[] = results.map((r) => ({
      ...r.artifacts,
      category: r.categories,
      images: images.filter((img) => img.artifactId === r.artifacts.id),
    }));

    return { artifacts: artifactsWithRelations, total };
  }

  async getArtifact(id: string): Promise<ArtifactWithRelations | undefined> {
    const [result] = await db
      .select()
      .from(artifacts)
      .leftJoin(categories, eq(artifacts.categoryId, categories.id))
      .where(eq(artifacts.id, id))
      .limit(1);

    if (!result) return undefined;

    const images = await db
      .select()
      .from(artifactImages)
      .where(eq(artifactImages.artifactId, id))
      .orderBy(asc(artifactImages.order));

    return {
      ...result.artifacts,
      category: result.categories,
      images,
    };
  }

  async createArtifact(artifact: InsertArtifact): Promise<Artifact> {
    const [created] = await db.insert(artifacts).values({
      ...artifact,
      dimensions: artifact.dimensions
        ? {
            width: artifact.dimensions.width as string | undefined,
            height: artifact.dimensions.height as string | undefined,
            depth: artifact.dimensions.depth as string | undefined,
          }
        : null,
    }).returning();
    return created;
  }

  async updateArtifact(id: string, artifact: Partial<InsertArtifact>): Promise<Artifact | undefined> {
    const [updated] = await db
      .update(artifacts)
      .set({ 
        ...artifact, 
        updatedAt: new Date(),
        dimensions: artifact.dimensions
          ? {
              width: artifact.dimensions.width as string | undefined,
              height: artifact.dimensions.height as string | undefined,
              depth: artifact.dimensions.depth as string | undefined,
            }
          : null,
      })
      .where(eq(artifacts.id, id))
      .returning();
    return updated;
  }

  async deleteArtifact(id: string): Promise<void> {
    await db.delete(artifacts).where(eq(artifacts.id, id));
  }

  async getRelatedArtifacts(id: string, limit = 4): Promise<ArtifactWithRelations[]> {
    const artifact = await this.getArtifact(id);
    if (!artifact) return [];

    const baseConditions = [
      eq(artifacts.status, "published"),
      sql`${artifacts.id} != ${id}`,
    ];

    let results: { artifacts: typeof artifacts.$inferSelect; categories: typeof categories.$inferSelect | null }[] = [];

    if (artifact.categoryId) {
      const categoryResults = await db
        .select()
        .from(artifacts)
        .leftJoin(categories, eq(artifacts.categoryId, categories.id))
        .where(and(...baseConditions, eq(artifacts.categoryId, artifact.categoryId)))
        .limit(limit);
      results = categoryResults;
    }

    if (results.length < limit && artifact.period) {
      const periodResults = await db
        .select()
        .from(artifacts)
        .leftJoin(categories, eq(artifacts.categoryId, categories.id))
        .where(and(
          ...baseConditions,
          eq(artifacts.period, artifact.period),
          sql`${artifacts.id} NOT IN (${results.length > 0 ? sql.join(results.map(r => sql`${r.artifacts.id}`), sql`, `) : sql`''`})`
        ))
        .limit(limit - results.length);
      results = [...results, ...periodResults];
    }

    if (results.length < limit && artifact.region) {
      const regionResults = await db
        .select()
        .from(artifacts)
        .leftJoin(categories, eq(artifacts.categoryId, categories.id))
        .where(and(
          ...baseConditions,
          eq(artifacts.region, artifact.region),
          sql`${artifacts.id} NOT IN (${results.length > 0 ? sql.join(results.map(r => sql`${r.artifacts.id}`), sql`, `) : sql`''`})`
        ))
        .limit(limit - results.length);
      results = [...results, ...regionResults];
    }

    if (results.length < limit) {
      const anyResults = await db
        .select()
        .from(artifacts)
        .leftJoin(categories, eq(artifacts.categoryId, categories.id))
        .where(and(
          ...baseConditions,
          sql`${artifacts.id} NOT IN (${results.length > 0 ? sql.join(results.map(r => sql`${r.artifacts.id}`), sql`, `) : sql`''`})`
        ))
        .orderBy(desc(artifacts.views))
        .limit(limit - results.length);
      results = [...results, ...anyResults];
    }

    const artifactIds = results.map((r) => r.artifacts.id);
    const images = artifactIds.length > 0
      ? await db
          .select()
          .from(artifactImages)
          .where(sql`${artifactImages.artifactId} IN (${sql.join(artifactIds.map(id => sql`${id}`), sql`, `)})`)
      : [];

    return results.map((r) => ({
      ...r.artifacts,
      category: r.categories,
      images: images.filter((img) => img.artifactId === r.artifacts.id),
    }));
  }

  async incrementArtifactViews(id: string): Promise<void> {
    await db
      .update(artifacts)
      .set({ views: sql`${artifacts.views} + 1` })
      .where(eq(artifacts.id, id));
  }

  async getPopularArtifacts(limit = 10): Promise<ArtifactWithRelations[]> {
    const results = await db
      .select()
      .from(artifacts)
      .leftJoin(categories, eq(artifacts.categoryId, categories.id))
      .where(eq(artifacts.status, "published"))
      .orderBy(desc(artifacts.views))
      .limit(limit);

    const artifactIds = results.map((r) => r.artifacts.id);
    const images = artifactIds.length > 0
      ? await db
          .select()
          .from(artifactImages)
          .where(sql`${artifactImages.artifactId} IN (${sql.join(artifactIds.map(id => sql`${id}`), sql`, `)})`)
      : [];

    return results.map((r) => ({
      ...r.artifacts,
      category: r.categories,
      images: images.filter((img) => img.artifactId === r.artifacts.id),
    }));
  }

  async getArtifactImages(artifactId: string): Promise<ArtifactImage[]> {
    return db
      .select()
      .from(artifactImages)
      .where(eq(artifactImages.artifactId, artifactId))
      .orderBy(asc(artifactImages.order));
  }

  async createArtifactImage(image: InsertArtifactImage): Promise<ArtifactImage> {
    const [created] = await db.insert(artifactImages).values(image).returning();
    return created;
  }

  async deleteArtifactImage(id: string): Promise<void> {
    await db.delete(artifactImages).where(eq(artifactImages.id, id));
  }

  async getCategories(withCount = false): Promise<(Category & { artifactCount?: number })[]> {
    if (withCount) {
      const results = await db
        .select({
          category: categories,
          count: count(artifacts.id),
        })
        .from(categories)
        .leftJoin(artifacts, eq(categories.id, artifacts.categoryId))
        .groupBy(categories.id)
        .orderBy(asc(categories.order), asc(categories.name));

      return results.map((r) => ({
        ...r.category,
        artifactCount: r.count,
      }));
    }

    return db.select().from(categories).orderBy(asc(categories.order), asc(categories.name));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.update(artifacts).set({ categoryId: null }).where(eq(artifacts.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getComments(options?: { artifactId?: string; status?: string }): Promise<Comment[]> {
    const conditions = [];
    if (options?.artifactId) {
      conditions.push(eq(comments.artifactId, options.artifactId));
    }
    if (options?.status && options.status !== "all") {
      conditions.push(eq(comments.status, options.status as "pending" | "approved" | "rejected"));
    }

    return db
      .select()
      .from(comments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(comments.createdAt));
  }

  async getComment(id: string): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    return comment;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [created] = await db.insert(comments).values(comment).returning();
    return created;
  }

  async updateCommentStatus(id: string, status: string): Promise<Comment | undefined> {
    const [updated] = await db
      .update(comments)
      .set({ status: status as "pending" | "approved" | "rejected", updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return updated;
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async getStats(): Promise<{
    totalArtifacts: number;
    totalUsers: number;
    pendingComments: number;
    totalViews: number;
  }> {
    const [artifactStats] = await db
      .select({ count: count(), views: sql<number>`COALESCE(SUM(${artifacts.views}), 0)` })
      .from(artifacts);
    const [userStats] = await db.select({ count: count() }).from(users);
    const [commentStats] = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.status, "pending"));

    return {
      totalArtifacts: artifactStats.count,
      totalUsers: userStats.count,
      pendingComments: commentStats.count,
      totalViews: Number(artifactStats.views) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
