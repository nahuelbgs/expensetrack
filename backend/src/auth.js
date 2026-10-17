import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./db.js";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "et_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60;

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: `${SEVEN_DAYS}s` });

export const setSessionCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS * 1000,
  });
};

export const clearSessionCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

const findUserById = db.prepare("SELECT id, email FROM users WHERE id = ?");

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, SECRET);
    const user = findUserById.get(payload.userId);
    if (!user) return res.status(401).json({ error: "Invalid session" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
};
