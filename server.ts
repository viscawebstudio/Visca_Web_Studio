import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);
  
  // Compression middleware
  app.use(compression());
  
  // Security Headers
  app.use(helmet({
    xFrameOptions: false, // Prevent breaking AI Studio iframe preview
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://cdn.phototourl.com"],
        connectSrc: ["'self'", "https://api.emailjs.com"],
        frameAncestors: ["*"], // Allow framing in AI Studio
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    },
  }));
  
  // Custom Permissions-Policy Header
  app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=()");
    next();
  });

  app.use(express.json());

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
