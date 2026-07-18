var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  app: () => app,
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express2 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_compression = __toESM(require("compression"), 1);

// server/questionnaire.ts
var import_express = require("express");
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_xss = __toESM(require("xss"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  submissions: () => submissions
});
var import_sqlite_core = require("drizzle-orm/sqlite-core");
var submissions = (0, import_sqlite_core.sqliteTable)("submissions", {
  id: (0, import_sqlite_core.text)("id").primaryKey(),
  business_name: (0, import_sqlite_core.text)("business_name"),
  contact_person: (0, import_sqlite_core.text)("contact_person"),
  phone_number: (0, import_sqlite_core.text)("phone_number"),
  email_address: (0, import_sqlite_core.text)("email_address"),
  business_address: (0, import_sqlite_core.text)("business_address"),
  business_industry: (0, import_sqlite_core.text)("business_industry"),
  existing_website: (0, import_sqlite_core.text)("existing_website"),
  existing_website_url: (0, import_sqlite_core.text)("existing_website_url"),
  goal_primary: (0, import_sqlite_core.text)("goal_primary"),
  goal_products: (0, import_sqlite_core.text)("goal_products"),
  goal_audience: (0, import_sqlite_core.text)("goal_audience"),
  goal_action: (0, import_sqlite_core.text)("goal_action"),
  req_pages: (0, import_sqlite_core.text)("req_pages"),
  req_pages_other: (0, import_sqlite_core.text)("req_pages_other"),
  req_features: (0, import_sqlite_core.text)("req_features"),
  req_features_other: (0, import_sqlite_core.text)("req_features_other"),
  brand_colors: (0, import_sqlite_core.text)("brand_colors"),
  brand_fonts: (0, import_sqlite_core.text)("brand_fonts"),
  brand_notes: (0, import_sqlite_core.text)("brand_notes"),
  design_style: (0, import_sqlite_core.text)("design_style"),
  ref1_url: (0, import_sqlite_core.text)("ref1_url"),
  ref1_like: (0, import_sqlite_core.text)("ref1_like"),
  ref2_url: (0, import_sqlite_core.text)("ref2_url"),
  ref2_like: (0, import_sqlite_core.text)("ref2_like"),
  ref3_url: (0, import_sqlite_core.text)("ref3_url"),
  ref3_like: (0, import_sqlite_core.text)("ref3_like"),
  content_notes: (0, import_sqlite_core.text)("content_notes"),
  domain_name: (0, import_sqlite_core.text)("domain_name"),
  hosting_provider: (0, import_sqlite_core.text)("hosting_provider"),
  project_launch_date: (0, import_sqlite_core.text)("project_launch_date"),
  project_budget: (0, import_sqlite_core.text)("project_budget"),
  project_notes: (0, import_sqlite_core.text)("project_notes"),
  dec_name: (0, import_sqlite_core.text)("dec_name"),
  dec_agree: (0, import_sqlite_core.text)("dec_agree"),
  content_ready: (0, import_sqlite_core.text)("content_ready"),
  content_photos: (0, import_sqlite_core.text)("content_photos"),
  content_copywriting: (0, import_sqlite_core.text)("content_copywriting"),
  content_stock: (0, import_sqlite_core.text)("content_stock"),
  domain_own: (0, import_sqlite_core.text)("domain_own"),
  hosting_own: (0, import_sqlite_core.text)("hosting_own"),
  domain_hosting_help: (0, import_sqlite_core.text)("domain_hosting_help"),
  brand_logo: (0, import_sqlite_core.text)("brand_logo"),
  brand_guidelines: (0, import_sqlite_core.text)("brand_guidelines"),
  submittedAt: (0, import_sqlite_core.text)("submitted_at"),
  is_read: (0, import_sqlite_core.integer)("is_read", { mode: "boolean" }).default(false),
  share_token: (0, import_sqlite_core.text)("share_token"),
  share_expires_at: (0, import_sqlite_core.text)("share_expires_at"),
  share_enabled: (0, import_sqlite_core.integer)("share_enabled", { mode: "boolean" }).default(true)
});

// server/db/index.ts
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_module = require("module");
var import_meta = {};
var require2 = (0, import_module.createRequire)(import_meta.url);
function parseSQLCondition(cond) {
  if (!cond || !cond.queryChunks || !Array.isArray(cond.queryChunks)) {
    return { field: "", value: null, operator: "all" };
  }
  const chunks = cond.queryChunks;
  const columnChunk = chunks.find((c) => c && typeof c === "object" && c.name && c.dataType);
  if (!columnChunk) {
    return { field: "", value: null, operator: "all" };
  }
  const field = columnChunk.name;
  const operatorChunk = chunks.find((c) => c && typeof c === "object" && c.value && Array.isArray(c.value) && typeof c.value[0] === "string" && (c.value[0].includes(" = ") || c.value[0].includes(" in ")));
  let operator = "eq";
  if (operatorChunk) {
    const opStr = operatorChunk.value[0];
    if (opStr.includes(" in ")) {
      operator = "in";
    }
  }
  let value = null;
  if (operator === "in") {
    const arrayChunk = chunks.find((c) => Array.isArray(c));
    if (arrayChunk) {
      value = arrayChunk.map((p) => p && p.value !== void 0 ? p.value : p);
    } else {
      const paramChunk = chunks.find((c) => c && typeof c === "object" && c.value !== void 0 && !Array.isArray(c.value));
      if (paramChunk) {
        value = Array.isArray(paramChunk.value) ? paramChunk.value : [paramChunk.value];
      }
    }
  } else {
    const paramChunk = chunks.find((c) => c && typeof c === "object" && c.value !== void 0 && !Array.isArray(c.value) && !c.columnType && !c.queryChunks);
    if (paramChunk) {
      value = paramChunk.value;
    }
  }
  return { field, value, operator };
}
var JsonDatabase = class {
  constructor() {
    if (process.env.VERCEL) {
      this.filePath = import_path.default.join("/tmp", "submissions.json");
      const srcPath = import_path.default.join(process.cwd(), "submissions.json");
      if (!import_fs.default.existsSync(this.filePath)) {
        try {
          if (import_fs.default.existsSync(srcPath)) {
            import_fs.default.copyFileSync(srcPath, this.filePath);
            console.log("submissions.json copied to /tmp successfully");
          } else {
            import_fs.default.writeFileSync(this.filePath, "[]", "utf8");
            console.log("No submissions.json found, starting with empty array in /tmp");
          }
        } catch (err) {
          console.error("Error copying/initializing submissions.json in /tmp:", err);
        }
      }
    } else {
      this.filePath = import_path.default.join(process.cwd(), "submissions.json");
      if (!import_fs.default.existsSync(this.filePath)) {
        import_fs.default.writeFileSync(this.filePath, "[]", "utf8");
      }
    }
  }
  readData() {
    try {
      if (import_fs.default.existsSync(this.filePath)) {
        const content = import_fs.default.readFileSync(this.filePath, "utf8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("Error reading json database:", e);
    }
    return [];
  }
  writeData(data) {
    try {
      import_fs.default.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("Error writing to json database:", e);
    }
  }
  insert(table) {
    return {
      values: async (record) => {
        const data = this.readData();
        const normalizedRecord = { ...record };
        if (record.submittedAt !== void 0) {
          normalizedRecord.submittedAt = record.submittedAt;
        }
        data.push(normalizedRecord);
        this.writeData(data);
        return { lastInsertRowid: data.length };
      }
    };
  }
  select() {
    return {
      from: (table) => {
        const data = this.readData();
        let filtered = [...data];
        const builder = {
          where: (condition) => {
            const { field, value, operator } = parseSQLCondition(condition);
            if (field) {
              if (operator === "eq") {
                filtered = filtered.filter((item) => {
                  const itemVal = item[field] !== void 0 ? item[field] : field === "submitted_at" ? item.submittedAt : void 0;
                  return String(itemVal) === String(value);
                });
              } else if (operator === "in" && Array.isArray(value)) {
                filtered = filtered.filter((item) => {
                  const itemVal = item[field] !== void 0 ? item[field] : field === "submitted_at" ? item.submittedAt : void 0;
                  return value.map(String).includes(String(itemVal));
                });
              }
            }
            return builder;
          },
          limit: (n) => {
            filtered = filtered.slice(0, n);
            return builder;
          },
          then: (resolve, reject) => {
            const mapped = filtered.map((item) => ({
              ...item,
              submittedAt: item.submittedAt || item.submitted_at || ""
            }));
            return Promise.resolve(mapped).then(resolve, reject);
          }
        };
        return builder;
      }
    };
  }
  update(table) {
    return {
      set: (updateValues) => {
        return {
          where: async (condition) => {
            const data = this.readData();
            const { field, value, operator } = parseSQLCondition(condition);
            let updatedCount = 0;
            if (field) {
              const updatedData = data.map((item) => {
                const itemVal = item[field] !== void 0 ? item[field] : field === "submitted_at" ? item.submittedAt : void 0;
                let matches = false;
                if (operator === "eq") {
                  matches = String(itemVal) === String(value);
                } else if (operator === "in" && Array.isArray(value)) {
                  matches = value.map(String).includes(String(itemVal));
                }
                if (matches) {
                  updatedCount++;
                  return { ...item, ...updateValues };
                }
                return item;
              });
              if (updatedCount > 0) {
                this.writeData(updatedData);
              }
            }
            return { changes: updatedCount };
          }
        };
      }
    };
  }
  delete(table) {
    return {
      where: async (condition) => {
        const data = this.readData();
        const { field, value, operator } = parseSQLCondition(condition);
        let deletedCount = 0;
        if (field) {
          const filteredData = data.filter((item) => {
            const itemVal = item[field] !== void 0 ? item[field] : field === "submitted_at" ? item.submittedAt : void 0;
            let matches = false;
            if (operator === "eq") {
              matches = String(itemVal) === String(value);
            } else if (operator === "in" && Array.isArray(value)) {
              matches = value.map(String).includes(String(itemVal));
            }
            if (matches) {
              deletedCount++;
              return false;
            }
            return true;
          });
          if (deletedCount > 0) {
            this.writeData(filteredData);
          }
        }
        return { changes: deletedCount };
      }
    };
  }
};
var db;
var isJsonDb = false;
if (process.env.VERCEL) {
  console.log("Running on Vercel: Using JsonDatabase fallback directly to avoid native better-sqlite3 issues");
  db = new JsonDatabase();
  isJsonDb = true;
} else {
  try {
    const sqlitePackage = "better-sqlite3";
    const Database = require2(sqlitePackage);
    const drizzlePackage = "drizzle-orm/better-sqlite3";
    const { drizzle } = require2(drizzlePackage);
    const dbPath = import_path.default.join(process.cwd(), "sqlite.db");
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema: schema_exports });
    console.log("Initialized drizzle with better-sqlite3 successfully");
  } catch (err) {
    console.log("Failed to load better-sqlite3, falling back to JsonDatabase:", err.message);
    db = new JsonDatabase();
    isJsonDb = true;
  }
}

// server/questionnaire.ts
var import_drizzle_orm = require("drizzle-orm");
var router = (0, import_express.Router)();
var SESSION_SECRET = process.env.STUDIO_ACCESS_CODE || process.env.SESSION_SECRET || "visca-web-studio-secret-key-123";
function generateSessionToken() {
  const expiresAt = Date.now() + 30 * 60 * 1e3;
  const payload = JSON.stringify({ expiresAt });
  const hmac = import_crypto.default.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + hmac;
}
function verifySessionToken(token) {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payloadStr = Buffer.from(payloadB64, "base64").toString("utf8");
    const hmac = import_crypto.default.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
    if (hmac !== signature) return false;
    const { expiresAt } = JSON.parse(payloadStr);
    if (Date.now() > expiresAt) return false;
    return true;
  } catch (err) {
    return false;
  }
}
var submitLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 5,
  // Limit each IP to 5 submissions per window
  message: { error: "Too many submissions from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false
});
var loginLimiter = (0, import_express_rate_limit.default)({
  windowMs: 5 * 60 * 1e3,
  // 5 minutes
  max: 5,
  // 5 failed attempts
  message: { error: "Too many failed login attempts, please try again after 5 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
  // Don't count successful logins
});
router.use((0, import_cookie_parser.default)());
var requireAuth = (req, res, next) => {
  const token = req.cookies.admin_session;
  if (!token || !verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
router.post("/submit", submitLimiter, async (req, res) => {
  try {
    const data = req.body;
    if (data.honeypot) {
      return res.status(200).json({ success: true });
    }
    if (!data.business_name || !data.contact_person || !data.phone_number || !data.email_address) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (data.phone_number.replace(/[^0-9]/g, "").length !== 10) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    const sanitizedData = {};
    for (const key in data) {
      if (key !== "honeypot") {
        sanitizedData[key] = (0, import_xss.default)(String(data[key]));
      }
    }
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const submittedAt = (/* @__PURE__ */ new Date()).toISOString();
    await db.insert(submissions).values({
      id,
      business_name: sanitizedData.business_name || "",
      contact_person: sanitizedData.contact_person || "",
      phone_number: sanitizedData.phone_number || "",
      email_address: sanitizedData.email_address || "",
      business_address: sanitizedData.business_address || "",
      business_industry: sanitizedData.business_industry || "",
      existing_website: sanitizedData.existing_website || "",
      existing_website_url: sanitizedData.existing_website_url || "",
      goal_primary: sanitizedData.goal_primary || "",
      goal_products: sanitizedData.goal_products || "",
      goal_audience: sanitizedData.goal_audience || "",
      goal_action: sanitizedData.goal_action || "",
      req_pages: sanitizedData.req_pages || "",
      req_pages_other: sanitizedData.req_pages_other || "",
      req_features: sanitizedData.req_features || "",
      req_features_other: sanitizedData.req_features_other || "",
      brand_colors: sanitizedData.brand_colors || "",
      brand_fonts: sanitizedData.brand_fonts || "",
      brand_notes: sanitizedData.brand_notes || "",
      design_style: sanitizedData.design_style || "",
      ref1_url: sanitizedData.ref1_url || "",
      ref1_like: sanitizedData.ref1_like || "",
      ref2_url: sanitizedData.ref2_url || "",
      ref2_like: sanitizedData.ref2_like || "",
      ref3_url: sanitizedData.ref3_url || "",
      ref3_like: sanitizedData.ref3_like || "",
      content_notes: sanitizedData.content_notes || "",
      domain_name: sanitizedData.domain_name || "",
      hosting_provider: sanitizedData.hosting_provider || "",
      project_launch_date: sanitizedData.project_launch_date || "",
      project_budget: sanitizedData.project_budget || "",
      project_notes: sanitizedData.project_notes || "",
      dec_name: sanitizedData.dec_name || "",
      dec_agree: sanitizedData.dec_agree || "",
      content_ready: sanitizedData.content_ready || "",
      content_photos: sanitizedData.content_photos || "",
      content_copywriting: sanitizedData.content_copywriting || "",
      content_stock: sanitizedData.content_stock || "",
      domain_own: sanitizedData.domain_own || "",
      hosting_own: sanitizedData.hosting_own || "",
      domain_hosting_help: sanitizedData.domain_hosting_help || "",
      brand_logo: sanitizedData.brand_logo || "",
      brand_guidelines: sanitizedData.brand_guidelines || "",
      submittedAt
    });
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Submission error:", error.stack || error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});
router.post("/login", loginLimiter, (req, res) => {
  const { pin } = req.body;
  const accessCode = process.env.STUDIO_ACCESS_CODE || "visca61331";
  if (pin === accessCode) {
    const token = generateSessionToken();
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
    res.cookie("admin_session", token, {
      httpOnly: true,
      secure: !!isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 30 * 60 * 1e3
      // 30 mins
    });
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid access code" });
  }
});
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
  res.clearCookie("admin_session", {
    httpOnly: true,
    secure: !!isProd,
    sameSite: isProd ? "none" : "lax"
  });
  res.status(200).json({ success: true });
});
router.get("/responses", requireAuth, async (req, res) => {
  try {
    const allResponses = await db.select().from(submissions);
    res.status(200).json(allResponses);
  } catch (error) {
    console.error("Fetch responses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/responses/toggle-read", requireAuth, async (req, res) => {
  const { id, is_read } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Invalid format" });
  }
  try {
    await db.update(submissions).set({ is_read }).where((0, import_drizzle_orm.eq)(submissions.id, id));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Toggle read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/responses/delete", requireAuth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid format" });
  }
  try {
    if (ids.length > 0) {
      await db.delete(submissions).where((0, import_drizzle_orm.inArray)(submissions.id, ids.map(String)));
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete responses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/responses/share", requireAuth, async (req, res) => {
  const { id } = req.body;
  try {
    const row = await db.select().from(submissions).where((0, import_drizzle_orm.eq)(submissions.id, id)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    const sub = row[0];
    let token = sub.share_token;
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const expiresAtStr = expiresAt.toISOString();
    if (!token) {
      token = import_crypto.default.randomBytes(16).toString("hex");
    }
    await db.update(submissions).set({
      share_token: token,
      share_expires_at: expiresAtStr,
      share_enabled: true
    }).where((0, import_drizzle_orm.eq)(submissions.id, id));
    res.status(200).json({ success: true, token, expiresAt: expiresAtStr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/responses/share/disable", requireAuth, async (req, res) => {
  const { id } = req.body;
  try {
    await db.update(submissions).set({ share_enabled: false }).where((0, import_drizzle_orm.eq)(submissions.id, id));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/shared/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const row = await db.select().from(submissions).where((0, import_drizzle_orm.eq)(submissions.share_token, token)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    const sub = row[0];
    if (!sub.share_enabled) {
      return res.status(403).json({ error: "Link disabled" });
    }
    if (sub.share_expires_at && new Date(sub.share_expires_at) < /* @__PURE__ */ new Date()) {
      return res.status(403).json({ error: "Link expired" });
    }
    res.status(200).json(sub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
var questionnaire_default = router;

// server.ts
import_dotenv.default.config();
var app = (0, import_express2.default)();
app.set("trust proxy", 1);
app.use((0, import_compression.default)());
app.use((0, import_helmet.default)({
  xFrameOptions: false,
  // Prevent breaking AI Studio iframe preview
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://cdn.phototourl.com"],
      connectSrc: ["'self'", "https://api.emailjs.com", "ws:", "wss:"],
      frameAncestors: ["*"],
      // Allow framing in AI Studio
      formAction: ["'self'"],
      baseUri: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536e3,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
}));
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=()");
  next();
});
app.use(import_express2.default.json({ limit: "1mb" }));
app.use("/api/questionnaire", questionnaire_default);
var server_default = app;
if (!process.env.VERCEL) {
  const startLocalServer = async () => {
    const PORT = 3e3;
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } else {
      const distPath = import_path2.default.join(process.cwd(), "dist");
      app.use(import_express2.default.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(import_path2.default.join(distPath, "index.html"));
      });
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  };
  startLocalServer();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
