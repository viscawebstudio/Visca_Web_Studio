import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import questionnaireRouter from "./server/questionnaire";

dotenv.config();

const app = express();

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
      connectSrc: ["'self'", "https://api.emailjs.com", "ws:", "wss:"],
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

app.use(express.json({ limit: "1mb" })); // Request size limits

// API Routes
app.use("/api/questionnaire", questionnaireRouter);

// Global Error Handler for API routes
app.use("/api", (err: any, req: any, res: any, next: any) => {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

export { app };
export default app;

// Setup local serving / development if not running on Vercel
if (!process.env.VERCEL) {
  const startLocalServer = async () => {
    const PORT = 3000;
    
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
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
  };

  startLocalServer();
}
