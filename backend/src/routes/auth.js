import { Router } from "express";
import db from "../db.js";
import {
  hashPassword,
  comparePassword,
  signToken,
  setSessionCookie,
  clearSessionCookie,
  requireAuth,
} from "../auth.js";

const router = Router();

const insertUser = db.prepare(
  "INSERT INTO users (email, password_hash) VALUES (?, ?)"
);
const findByEmail = db.prepare(
  "SELECT id, email, password_hash FROM users WHERE email = ?"
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 chars" });
  }

  if (findByEmail.get(email)) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hash = await hashPassword(password);
  const result = insertUser.run(email, hash);
  const user = { id: result.lastInsertRowid, email };
  const token = signToken({ userId: user.id });
  setSessionCookie(res, token);
  res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password required" });
  }
  const row = findByEmail.get(email);
  if (!row) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await comparePassword(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ userId: row.id });
  setSessionCookie(res, token);
  res.json({ user: { id: row.id, email: row.email } });
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
