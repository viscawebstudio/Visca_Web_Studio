import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import xss from "xss";
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

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: "Too many requests. Please wait 15 minutes before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      // CSRF Protection: Enforce JSON Content-Type
      if (req.headers["content-type"] !== "application/json") {
        return res.status(415).json({ error: "Unsupported Media Type" });
      }

      let { name, email, phone, company, business_type, budget, message } = req.body;
      
      // Initial presence check
      if (!name || !email || !phone) {
        return res.status(400).json({ error: "Name, email, and phone are required." });
      }

      // Convert all inputs to strings
      name = String(name || "");
      email = String(email || "");
      phone = String(phone || "");
      company = String(company || "");
      business_type = String(business_type || "");
      budget = String(budget || "");
      message = String(message || "");

      const sanitize = (val: string) => {
        // Trim whitespace
        let cleaned = val.trim();
        // Prevent hidden characters
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, "");
        // Remove HTML tags, JavaScript, and prevent XSS
        return xss(cleaned, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ["script", "style", "iframe"] });
      };

      name = sanitize(name);
      email = sanitize(email);
      phone = sanitize(phone);
      company = sanitize(company);
      business_type = sanitize(business_type);
      budget = sanitize(budget);
      message = sanitize(message);

      // Prevent SQL injection style payloads (--, ';, UNION SELECT, 1=1)
      const sqlInjectionPattern = /(--|';|UNION\s+SELECT|1=1|' OR |" OR )/i;
      const inputs = [name, email, phone, company, business_type, budget, message];
      if (inputs.some(val => sqlInjectionPattern.test(val))) {
        return res.status(400).json({ error: "Invalid characters detected in input." });
      }

      // Validation Limits
      if (name.length > 50) return res.status(400).json({ error: "Name must be maximum 50 characters." });
      if (company.length > 80) return res.status(400).json({ error: "Company must be maximum 80 characters." });
      if (business_type.length > 50) return res.status(400).json({ error: "Business type must be maximum 50 characters." });
      if (message.length > 1000) return res.status(400).json({ error: "Message must be maximum 1000 characters." });

      // Reject malformed email addresses
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address." });
      }

      // Reject invalid phone numbers (exactly 10 digits)
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: "Phone number must be exactly 10 digits." });
      }

      // Budget: Numbers only (strip formatting characters if any, then check if it's purely digits)
      const cleanedBudget = budget.replace(/[,.\s₹$€£\u202F\u00A0]/g, "");
      if (cleanedBudget && !/^\d+$/.test(cleanedBudget)) {
        return res.status(400).json({ error: "Budget must contain numbers only." });
      }

      const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;

      
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
         console.error("EmailJS environment variables are missing.");
         res.status(500).json({ error: "EmailJS credentials are not configured. Please add them to the environment variables." });
         return;
      }

      res.status(200).json({ 
        success: true,
        sanitizedData: {
          name,
          email,
          phone,
          company,
          business_type,
          budget,
          message
        },
        config: {
          SERVICE_ID,
          TEMPLATE_ID,
          PUBLIC_KEY
        }
      });
    } catch (error: any) {
      console.error("Internal Server Error:", error);
      res.status(500).json({ error: "An internal server error occurred while sending your inquiry." });
    }
  });

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
