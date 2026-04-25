import type { Express } from "express";
import type { Server } from "http";
import v1Routes from "./v1";
import { setupAuth } from "../middleware/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Mount v1 API routes
  app.use("/api/v1", v1Routes);

  return httpServer;
}