import { Router } from "express";
import rateLimit from "express-rate-limit";
import xss from "xss";
import crypto from "crypto";
import cookieParser from "cookie-parser";

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let _firestore: any = null;
let _submissionsRef: any = null;

function getSubmissionsRef() {
  if (_submissionsRef) return _submissionsRef;

  const projectId = process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0355320903';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseId = process.env.FIREBASE_DATABASE_ID || '(default)';

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing required Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)");
  }

  let firebaseApp;
  if (getApps().length === 0) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      projectId,
    });
  } else {
    firebaseApp = getApp();
  }

  _firestore = getFirestore(firebaseApp);
  _firestore.settings({ databaseId });
  _submissionsRef = _firestore.collection('submissions');

  return _submissionsRef;
}

function getFirestoreDb() {
  if (!_firestore) getSubmissionsRef();
  return _firestore;
}

const router = Router();

const SESSION_SECRET = process.env.STUDIO_ACCESS_CODE || process.env.SESSION_SECRET || "visca-web-studio-secret-key-123";

function generateSessionToken(): string {
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 mins
  const payload = JSON.stringify({ expiresAt });
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + hmac;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payloadStr = Buffer.from(payloadB64, "base64").toString("utf8");
    const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
    if (hmac !== signature) return false;
    
    const { expiresAt } = JSON.parse(payloadStr);
    if (Date.now() > expiresAt) return false;
    
    return true;
  } catch (err) {
    return false;
  }
}

// Rate limiters
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 submissions per window
  message: { error: "Too many submissions from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 failed attempts
  message: { error: "Too many failed login attempts, please try again after 5 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Middlewares
router.use(cookieParser());

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.cookies.admin_session;
  if (!token || !verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Routes

// Submit questionnaire
router.post("/submit", submitLimiter, async (req: any, res: any) => {
  try {
    const data = req.body;
    
    // Request size limit is handled globally by express.json()
    // Honeypot check
    if (data.honeypot) {
      // Silently accept but discard
      return res.status(200).json({ success: true });
    }

    // Basic validation
    if (!data.business_name || !data.contact_person || !data.phone_number || !data.email_address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (data.phone_number.replace(/[^0-9]/g, '').length !== 10) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Sanitize input
    const sanitizedData: any = {};
    for (const key in data) {
      if (key !== "honeypot") {
        sanitizedData[key] = xss(String(data[key]));
      }
    }

    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const submittedAt = new Date().toISOString();

    const record = {
      id: id,
      business_name: sanitizedData.business_name || '',
      contact_person: sanitizedData.contact_person || '',
      phone_number: sanitizedData.phone_number || '',
      email_address: sanitizedData.email_address || '',
      business_address: sanitizedData.business_address || '',
      business_industry: sanitizedData.business_industry || '',
      existing_website: sanitizedData.existing_website || '',
      existing_website_url: sanitizedData.existing_website_url || '',
      goal_primary: sanitizedData.goal_primary || '',
      goal_products: sanitizedData.goal_products || '',
      goal_audience: sanitizedData.goal_audience || '',
      goal_action: sanitizedData.goal_action || '',
      req_pages: sanitizedData.req_pages || '',
      req_pages_other: sanitizedData.req_pages_other || '',
      req_features: sanitizedData.req_features || '',
      req_features_other: sanitizedData.req_features_other || '',
      brand_colors: sanitizedData.brand_colors || '',
      brand_fonts: sanitizedData.brand_fonts || '',
      brand_notes: sanitizedData.brand_notes || '',
      design_style: sanitizedData.design_style || '',
      ref1_url: sanitizedData.ref1_url || '',
      ref1_like: sanitizedData.ref1_like || '',
      ref2_url: sanitizedData.ref2_url || '',
      ref2_like: sanitizedData.ref2_like || '',
      ref3_url: sanitizedData.ref3_url || '',
      ref3_like: sanitizedData.ref3_like || '',
      content_notes: sanitizedData.content_notes || '',
      domain_name: sanitizedData.domain_name || '',
      hosting_provider: sanitizedData.hosting_provider || '',
      project_launch_date: sanitizedData.project_launch_date || '',
      project_budget: sanitizedData.project_budget || '',
      project_notes: sanitizedData.project_notes || '',
      dec_name: sanitizedData.dec_name || '',
      dec_agree: sanitizedData.dec_agree || '',
      content_ready: sanitizedData.content_ready || '',
      content_photos: sanitizedData.content_photos || '',
      content_copywriting: sanitizedData.content_copywriting || '',
      content_stock: sanitizedData.content_stock || '',
      domain_own: sanitizedData.domain_own || '',
      hosting_own: sanitizedData.hosting_own || '',
      domain_hosting_help: sanitizedData.domain_hosting_help || '',
      brand_logo: sanitizedData.brand_logo || '',
      brand_guidelines: sanitizedData.brand_guidelines || '',
      submittedAt: submittedAt,
      is_read: false,
      share_enabled: true
    };

    const ref = getSubmissionsRef();
    await ref.doc(id).set(record);

    res.status(200).json({ success: true, id: id });
  } catch (error: any) {
    console.error("Submission error:", error.stack || error);
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
    res.status(500).json({ error: "Internal server error", details: isProd ? undefined : error.message });
  }
});

// Admin login
router.post("/login", loginLimiter, (req: any, res: any) => {
  const { pin } = req.body;
  const accessCode = process.env.STUDIO_ACCESS_CODE || "visca61331";
  if (pin === accessCode) {
    const token = generateSessionToken();
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
    
    res.cookie("admin_session", token, {
      httpOnly: true,
      secure: !!isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 30 * 60 * 1000 // 30 mins
    });
    
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid access code" });
  }
});

// Admin logout
router.post("/logout", (req: any, res: any) => {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;
  res.clearCookie("admin_session", {
    httpOnly: true,
    secure: !!isProd,
    sameSite: isProd ? "none" : "lax"
  });
  res.status(200).json({ success: true });
});

// Get responses
router.get("/responses", requireAuth, async (req: any, res: any) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const snapshot = await getSubmissionsRef().get();
    const allResponses = snapshot.docs.map((doc: any) => doc.data());
    
    res.status(200).json(allResponses);
  } catch (error) {
    console.error("Fetch responses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Toggle Read Status
router.post("/responses/toggle-read", requireAuth, async (req: any, res: any) => {
  const { id, is_read } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Invalid format" });
  }
  try {
    await getSubmissionsRef().doc(id).update({ is_read });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Toggle read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete responses
router.post("/responses/delete", requireAuth, async (req: any, res: any) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid format" });
  }
  
  try {
    if (ids.length > 0) {
      const db = getFirestoreDb();
      const batch = db.batch();
      for (const id of ids) {
        batch.delete(getSubmissionsRef().doc(String(id)));
      }
      await batch.commit();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete responses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Share response
router.post("/responses/share", requireAuth, async (req: any, res: any) => {
  const { id } = req.body;
  try {
    const doc = await getSubmissionsRef().doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Not found" });
    const sub = doc.data();
    let token = sub.share_token;
    
    // Always reset expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const expiresAtStr = expiresAt.toISOString();

    if (!token) {
      token = crypto.randomBytes(16).toString("hex");
    }

    await getSubmissionsRef().doc(id).update({ 
      share_token: token, 
      share_expires_at: expiresAtStr, 
      share_enabled: true 
    });

    res.status(200).json({ success: true, token, expiresAt: expiresAtStr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Disable share
router.post("/responses/share/disable", requireAuth, async (req: any, res: any) => {
  const { id } = req.body;
  try {
    await getSubmissionsRef().doc(id).update({ share_enabled: false });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get shared response (Public)
router.get("/shared/:token", async (req: any, res: any) => {
  const { token } = req.params;
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const snapshot = await getSubmissionsRef().where('share_token', '==', token).limit(1).get();
    
    if (snapshot.empty) return res.status(404).json({ error: "Not found" });
    const sub = snapshot.docs[0].data();
    
    if (!sub.share_enabled) {
      return res.status(403).json({ error: "Link disabled" });
    }

    if (sub.share_expires_at && new Date(sub.share_expires_at) < new Date()) {
      return res.status(403).json({ error: "Link expired" });
    }

    res.status(200).json(sub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
