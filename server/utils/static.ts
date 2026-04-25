// import express, { type Express } from "express";
// import fs from "fs";
// import path from "path";

// export function serveStatic(app: Express) {
//   const distPath = path.resolve(__dirname, "public");
//   if (!fs.existsSync(distPath)) {
//     throw new Error(
//       `Could not find the build directory: ${distPath}, make sure to build the client first`,
//     );
//   }

//   app.use(express.static(distPath));

//   // fall through to index.html if the file doesn't exist
//   app.use("*", (_req, res) => {
//     res.sendFile(path.resolve(distPath, "index.html"));
//   });
// }

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export function serveStatic(app: Express) {
//   const distPath = path.resolve(__dirname, "../../dist");

//   app.use(express.static(distPath));
//   app.get("*", (_req, res) => {
//     res.sendFile(path.join(distPath, "index.html"));
//   });
// }

import path from "path";
import express from "express";

export function serveStatic(app: express.Express) {
  const publicDir = path.resolve(__dirname, "../public");

  if (!require("fs").existsSync(publicDir)) {
    throw new Error(
      `Could not find the build directory: ${publicDir}, make sure to build the client first`
    );
  }

  app.use(express.static(publicDir));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
