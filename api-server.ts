import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import questionnaireRouter from "./server/questionnaire.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.disable("etag");
app.disable("x-powered-by");

// Compression middleware
app.use(compression());

// CORS configuration
const allowedOrigins = [
  process.env.VITE_SITE_URL, "https://viscawebstudio.com",
  process.env.APP_URL,
];
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000", "http://localhost:5173");
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // and allow AI Studio preview origins (ending with .run.app)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".run.app") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Security Headers
app.use(
  helmet({
    xFrameOptions: false, // Prevent breaking AI Studio iframe preview
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    originAgentCluster: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:
          process.env.NODE_ENV === "production"
            ? ["'self'"]
            : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        fontSrc: ["https://fonts.gstatic.com"],
        connectSrc:
          process.env.NODE_ENV === "production"
            ? ["'self'", "https://api.emailjs.com"]
            : ["'self'", "https://api.emailjs.com", "ws:", "wss:"],
        imgSrc: [
          "'self'",
          "data:",
          "https://images.unsplash.com",
          "https://cdn.phototourl.com",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors:
          process.env.NODE_ENV === "production"
            ? [
                "'self'",
                "https://aistudio.google.com",
                "https://ai.studio.google.com",
                "https://*.google.com",
              ]
            : ["*"], // Required for AI Studio preview
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  }),
);

// Custom Permissions-Policy Header
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=(), payment=()",
  );
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Secure JSON parsing and limits
app.use(express.json({ limit: "1mb" })); 

// Global API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." }
});

// API Routes
app.use("/api", apiLimiter);
app.use("/api/questionnaire", questionnaireRouter);

// Global Error Handler for API routes
app.use(
  "/api",
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("API Error:", err);
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: isProd ? undefined : err.message,
      });
  },
);

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
      const cwd = process.cwd();
      const distPath = cwd.endsWith("dist") ? cwd : path.join(cwd, "dist");

      app.use(
        "/assets",
        express.static(path.join(distPath, "assets"), {
          maxAge: "1y",
          immutable: true,
        }),
      );

      app.use(
        express.static(distPath, {
          setHeaders: (res, filePath) => {
            if (filePath.endsWith("index.html")) {
              res.setHeader("Cache-Control", "no-cache");
            }
          },
        }),
      );

      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.info(`Server running on port ${PORT}`);
    });
  };

  startLocalServer();
}
