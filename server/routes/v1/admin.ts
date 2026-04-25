import { Router } from "express";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { storage } from "../../storage";
import { insertArtifactSchema, insertCategorySchema } from "@shared/schema";
import { isAuthenticated } from "../../middleware/auth";
import { ObjectStorageService, ObjectNotFoundError } from "../../config/objectStorage";
import { ObjectPermission } from "../../config/objectAcl";
import type { RequestHandler } from "express";
import multer from "multer";
import { nanoid } from "nanoid";






const router = Router();
const objectStorageService = new ObjectStorageService();

// Extend session type to include userId
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Admin middleware
const isAdmin: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  if (user.status === "blocked") {
    return res.status(403).json({ error: "Account is blocked" });
  }
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

// Apply authentication and admin check to all routes
router.use(isAuthenticated);
router.use(isAdmin);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only jpg, jpeg, png
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, and PNG images are allowed"));
    }
  },
});

// Configure multer for 3D model uploads (larger files)
const modelUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only .glb and .gltf files
    const allowedExtensions = [".glb", ".gltf", ".obj", ".fbx", ".blend"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Only GLB and GLTF and OBJ and FBX and BLEND model files are allowed"));
    }
  },
});

// Object storage routes
router.get("/objects/:objectPath(*)", async (req, res) => {
  const userId = req.session.userId;
  try {
    const objectFile = await objectStorageService.getObjectEntityFile(req.path);
    const canAccess = await objectStorageService.canAccessObjectEntity({
      objectFile,
      userId: userId,
      requestedPermission: ObjectPermission.READ,
    });
    if (!canAccess) {
      return res.sendStatus(401);
    }
    objectStorageService.downloadObject(objectFile, res);
  } catch (error) {
    console.error("Error checking object access:", error);
    if (error instanceof ObjectNotFoundError) {
      return res.sendStatus(404);
    }
    return res.sendStatus(500);
  }
});

router.post("/uploads/image", async (req, res) => {
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL("images");
    res.json({ uploadURL });
  } catch (error) {
    console.error("Error getting upload URL:", error);
    res.status(500).json({ error: "Failed to get upload URL" });
  }
});

router.post("/uploads/model", async (req, res) => {
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL("models");
    res.json({ uploadURL });
  } catch (error) {
    console.error("Error getting upload URL:", error);
    res.status(500).json({ error: "Failed to get upload URL" });
  }
});

router.put("/uploads/finalize", async (req, res) => {
  const userId = req.session.userId;
  const { uploadURL, visibility = "public" } = req.body;
  
  if (!uploadURL) {
    return res.status(400).json({ error: "uploadURL is required" });
  }

  try {
    const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
      uploadURL,
      {
        owner: userId!,
        visibility: visibility as "public" | "private",
      }
    );
    res.json({ objectPath });
  } catch (error) {
    console.error("Error finalizing upload:", error);
    res.status(500).json({ error: "Failed to finalize upload" });
  }
});

// Categories management
router.post("/categories", async (req, res) => {
  try {
    const data = insertCategorySchema.parse(req.body);
    const category = await storage.createCategory(data);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const data = insertCategorySchema.partial().parse(req.body);
    const category = await storage.updateCategory(req.params.id, data);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await storage.deleteCategory(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Upload category image
router.post("/upload/category-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // upload directory exists
    const uploadDir = "/home/dev/public/categories";
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${nanoid()}-${Date.now()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.writeFile(filepath, req.file.buffer);

    // Return URL for accessing the image
    const imageUrl = `/api/v1/categories/images/${filename}`;

    res.json({
      url: imageUrl,
      filename: filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error("Error uploading category image:", error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 3MB limit" });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Delete category image
router.delete("/upload/category-image", async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const filepath = path.join("/home/dev/public/categories", filename);

    try {
      await fs.unlink(filepath);
      res.json({ success: true, message: "Image deleted successfully" });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Image not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting category image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});


// Upload artifact image
router.post("/upload/artifact-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // upload directory exists
    const uploadDir = "/home/dev/public/artifacts_image";
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${nanoid()}-${Date.now()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.writeFile(filepath, req.file.buffer);

    // Return URL for accessing the image
    const imageUrl = `/api/v1/artifacts/images/${filename}`;

    res.json({
      url: imageUrl,
      filename: filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error("Error uploading artifact image:", error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 3MB limit" });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to upload image" });
  }
});
// Delete artifact image
router.delete("/upload/artifact-image", async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const filepath = path.join("/home/dev/public/artifacts_image", filename);

    try {
      await fs.unlink(filepath);
      res.json({ success: true, message: "Image deleted successfully" });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Image not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting artifact image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});
// Artifacts management
router.post("/artifacts", async (req, res) => {
  try {
    const userId = req.session.userId!;
    const data = insertArtifactSchema.parse({
      ...req.body,
      createdBy: userId,
    });
    const artifact = await storage.createArtifact(data);
    res.status(201).json(artifact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating artifact:", error);
    res.status(500).json({ error: "Failed to create artifact" });
  }
});

router.put("/artifacts/:id", async (req, res) => {
  try {
    const data = insertArtifactSchema.partial().parse(req.body);
    const artifact = await storage.updateArtifact(req.params.id, data);
    if (!artifact) {
      return res.status(404).json({ error: "Artifact not found" });
    }
    res.json(artifact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating artifact:", error);
    res.status(500).json({ error: "Failed to update artifact" });
  }
});

router.post("/artifacts/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid artifact IDs" });
    }
    for (const id of ids) {
      await storage.deleteArtifact(id);
    }
    res.json({ success: true, deleted: ids.length });
  } catch (error) {
    console.error("Error bulk deleting artifacts:", error);
    res.status(500).json({ error: "Failed to delete artifacts" });
  }
});

router.post("/artifacts/bulk-update", async (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid artifact IDs" });
    }
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid updates" });
    }
    const allowedFields = ["categoryId", "status"];
    const sanitizedUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = value;
      }
    }
    for (const id of ids) {
      await storage.updateArtifact(id, sanitizedUpdates);
    }
    res.json({ success: true, updated: ids.length });
  } catch (error) {
    console.error("Error bulk updating artifacts:", error);
    res.status(500).json({ error: "Failed to update artifacts" });
  }
});

router.delete("/artifacts/:id", async (req, res) => {
  try {
    await storage.deleteArtifact(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting artifact:", error);
    res.status(500).json({ error: "Failed to delete artifact" });
  }
});

// Upload artifact 3D model
router.post("/upload/artifact-model", modelUpload.single("model"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No model file provided" });
    }

    // Ensure upload directory exists
    const uploadDir = "/home/dev/public/models";
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${nanoid()}-${Date.now()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.writeFile(filepath, req.file.buffer);

    // Return URL for accessing the model
    const modelUrl = `/api/v1/artifacts/models/${filename}`;

    res.json({
      url: modelUrl,
      filename: filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error("Error uploading 3D model:", error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 50MB limit" });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to upload 3D model" });
  }
});

// Delete artifact 3D model
router.delete("/upload/artifact-model", async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const filepath = path.join("/home/dev/public/models", filename);

    try {
      await fs.unlink(filepath);
      res.json({ success: true, message: "Model deleted successfully" });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Model not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting 3D model:", error);
    res.status(500).json({ error: "Failed to delete model" });
  }
});

// Comments management
router.put("/comments/:id/approve", async (req, res) => {
  try {
    const comment = await storage.updateCommentStatus(req.params.id, "approved");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    console.error("Error approving comment:", error);
    res.status(500).json({ error: "Failed to approve comment" });
  }
});

router.put("/comments/:id/reject", async (req, res) => {
  try {
    const comment = await storage.updateCommentStatus(req.params.id, "rejected");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    console.error("Error rejecting comment:", error);
    res.status(500).json({ error: "Failed to reject comment" });
  }
});

router.delete("/comments/:id", async (req, res) => {
  try {
    await storage.deleteComment(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

router.get("/comments", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const comments = await storage.getComments({ status });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Admin stats and analytics
router.get("/stats", async (req, res) => {
  try {
    const stats = await storage.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/popular-artifacts", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const artifacts = await storage.getPopularArtifacts(limit);
    res.json(artifacts);
  } catch (error) {
    console.error("Error fetching popular artifacts:", error);
    res.status(500).json({ error: "Failed to fetch popular artifacts" });
  }
});

router.get("/recent-activity", async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

// User management
router.get("/users", async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const user = await storage.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await storage.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;