import path from "path";
import fs from "fs/promises";
import { Router } from "express";
import { z } from "zod";
import { storage } from "../../storage";
import { insertCommentSchema } from "@shared/schema";
import { isAuthenticated } from "../../middleware/auth";
import { ObjectStorageService } from "../../config/objectStorage";

const router = Router();
const objectStorageService = new ObjectStorageService();

// Public object downloads
router.get("/public-objects/:filePath(*)", async (req, res) => {
  let filePath = req.params.filePath;
  
  if (!filePath) {
    return res.status(400).json({ error: "File path required" });
  }
  
  filePath = filePath.replace(/\\/g, "/");
  
  if (filePath.includes("..") || 
      filePath.startsWith("/") || 
      filePath.includes("//") ||
      /[<>:"|?*\x00-\x1f]/.test(filePath)) {
    return res.status(400).json({ error: "Invalid file path" });
  }
  
  try {
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    objectStorageService.downloadObject(file, res);
  } catch (error) {
    console.error("Error searching for public object:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Categories
router.get("/categories", async (req, res) => {
  try {
    const withCount = req.query.withCount === "true";
    const categories = await storage.getCategories(withCount);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await storage.getCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// Serve category images
router.get("/categories/images/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join("/home/dev/public/categories", filename);

    try {
      // Check if file exists
      await fs.access(filepath);

      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const contentType = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
      }[ext] || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      // Read and send file
      const fileBuffer = await fs.readFile(filepath);
      res.send(fileBuffer);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Image not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error serving category image:", error);
    res.status(500).json({ error: "Failed to serve image" });
  }
});

// Artifacts
router.get("/artifacts/images/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join("/home/dev/public/artifacts_image", filename);

    try {
      // Check if file exists
      await fs.access(filepath);

      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const contentType = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
      }[ext] || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

      // Read and send file
      const fileBuffer = await fs.readFile(filepath);
      res.send(fileBuffer);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Image not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error serving artifact image:", error);
    res.status(500).json({ error: "Failed to serve image" });
  }
});

router.get("/artifacts/suggestions", async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json([]);
    }
    const suggestions = await storage.getSearchSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

router.get("/artifacts", async (req, res) => {
  try {
    const options = {
      search: req.query.search as string | undefined,
      categoryId: req.query.category as string | undefined,
      featured: req.query.featured === "true" ? true : undefined,
      status: req.query.status as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      periodFrom: req.query.periodFrom as string | undefined,
      periodTo: req.query.periodTo as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
    };
    const result = await storage.getArtifacts(options);
    res.json({
      artifacts: result.artifacts,
      total: result.total,
      page: options.page,
      totalPages: Math.ceil(result.total / options.limit),
    });
  } catch (error) {
    console.error("Error fetching artifacts:", error);
    res.status(500).json({ error: "Failed to fetch artifacts" });
  }
});

router.get("/artifacts/:id", async (req, res) => {
  try {
    const artifact = await storage.getArtifact(req.params.id);
    if (!artifact) {
      return res.status(404).json({ error: "Artifact not found" });
    }
    await storage.incrementArtifactViews(req.params.id);
    res.json(artifact);
  } catch (error) {
    console.error("Error fetching artifact:", error);
    res.status(500).json({ error: "Failed to fetch artifact" });
  }
});

// // Serve artifact 3D models
// router.get("/artifacts/models/:filename", async (req, res) => {
//   try {
//     const { filename } = req.params;

//     // Validate filename to prevent directory traversal
//     if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
//       return res.status(400).json({ error: "Invalid filename" });
//     }

//     const filepath = path.join("/home/dev/public/models", filename);

//     try {
//       // Check if file exists
//       await fs.access(filepath);

//       // Set appropriate content type based on file extension
//       const ext = path.extname(filename).toLowerCase();
//       const contentType = {
//         ".glb": "model/gltf-binary",
//         ".gltf": "model/gltf+json",
//       }[ext] || "application/octet-stream";

//       res.setHeader("Content-Type", contentType);
//       res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
//       res.setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS for 3D viewers
      
//       // For .gltf files, might want to allow embedding
//       if (ext === ".gltf") {
//         res.setHeader("Content-Disposition", "inline");
//       }

//       // Read and send file
//       const fileBuffer = await fs.readFile(filepath);
//       res.send(fileBuffer);
//     } catch (error: any) {
//       if (error.code === "ENOENT") {
//         return res.status(404).json({ error: "Model not found" });
//       }
//       throw error;
//     }
//   } catch (error) {
//     console.error("Error serving 3D model:", error);
//     res.status(500).json({ error: "Failed to serve model" });
//   }
// });
router.get("/artifacts/models/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join("/home/dev/public/models", filename);

    try {
      // Check if file exists
      await fs.access(filepath);

      // Set appropriate content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      const contentType = {
        ".glb": "model/gltf-binary",
        ".gltf": "model/gltf+json",
        ".obj": "model/obj",
        ".fbx": "application/octet-stream",
        ".blend": "application/x-blender",
      }[ext] || "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS for 3D viewers
      
      // For text-based formats, allow embedding
      if (ext === ".gltf" || ext === ".obj") {
        res.setHeader("Content-Disposition", "inline");
      }

      // Read and send file
      const fileBuffer = await fs.readFile(filepath);
      res.send(fileBuffer);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "Model not found" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error serving 3D model:", error);
    res.status(500).json({ error: "Failed to serve model" });
  }
});

router.get("/artifacts/:id/related", async (req, res) => {
  try {
    const related = await storage.getRelatedArtifacts(req.params.id);
    res.json(related);
  } catch (error) {
    console.error("Error fetching related artifacts:", error);
    res.status(500).json({ error: "Failed to fetch related artifacts" });
  }
});

// Comments
router.get("/artifacts/:id/comments", async (req, res) => {
  try {
    const comments = await storage.getComments({
      artifactId: req.params.id,
      status: "approved",
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/artifacts/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = insertCommentSchema.parse({
      ...req.body,
      artifactId: req.params.id,
      userId: user.id,
      userName: [user.firstName, user.lastName].filter(Boolean).join(" ") || "Anonymous",
      userImage: user.profileImageUrl,
    });
    
    const comment = await storage.createComment(data);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

export default router;