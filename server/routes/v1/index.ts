import { Router } from "express";
import authRoutes from "./auth";
import publicRoutes from "./public";
import adminRoutes from "./admin";

const router = Router();

// Mount route modules
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", publicRoutes);

export default router;