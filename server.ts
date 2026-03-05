import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./server/routes/auth.js";
import productRoutes from "./server/routes/products.js";
import orderRoutes from "./server/routes/orders.js";
import userRoutes from "./server/routes/users.js";
import uploadRoutes from "./server/routes/upload.js";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/upload", uploadRoutes);

  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  app.use("/uploads", express.static(uploadDir));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Watch Store server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
