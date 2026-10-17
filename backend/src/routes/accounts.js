import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

const listStmt = db.prepare(
  "SELECT id, name, gradient FROM accounts WHERE user_id = ? ORDER BY id"
);
const insertStmt = db.prepare(
  "INSERT INTO accounts (user_id, name, gradient) VALUES (?, ?, ?)"
);
const updateStmt = db.prepare(
  "UPDATE accounts SET name = COALESCE(?, name), gradient = COALESCE(?, gradient) WHERE id = ? AND user_id = ?"
);
const deleteStmt = db.prepare(
  "DELETE FROM accounts WHERE id = ? AND user_id = ?"
);
const getStmt = db.prepare(
  "SELECT id, name, gradient FROM accounts WHERE id = ? AND user_id = ?"
);

router.get("/", (req, res) => {
  res.json(listStmt.all(req.user.id));
});

router.post("/", (req, res) => {
  const { name, gradient } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name required" });
  }
  const result = insertStmt.run(req.user.id, name.trim(), gradient || null);
  res.status(201).json(getStmt.get(result.lastInsertRowid, req.user.id));
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, gradient } = req.body || {};
  const result = updateStmt.run(
    name?.trim() ?? null,
    gradient ?? null,
    id,
    req.user.id
  );
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json(getStmt.get(id, req.user.id));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = deleteStmt.run(id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

export default router;
