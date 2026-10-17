import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

const listStmt = db.prepare(
  "SELECT id, name FROM categories WHERE user_id = ? ORDER BY id"
);
const insertStmt = db.prepare(
  "INSERT INTO categories (user_id, name) VALUES (?, ?)"
);
const getStmt = db.prepare(
  "SELECT id, name FROM categories WHERE id = ? AND user_id = ?"
);
const deleteStmt = db.prepare(
  "DELETE FROM categories WHERE id = ? AND user_id = ?"
);

router.get("/", (req, res) => {
  res.json(listStmt.all(req.user.id));
});

router.post("/", (req, res) => {
  const { name } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name required" });
  }
  const result = insertStmt.run(req.user.id, name.trim());
  res.status(201).json(getStmt.get(result.lastInsertRowid, req.user.id));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = deleteStmt.run(id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

export default router;
