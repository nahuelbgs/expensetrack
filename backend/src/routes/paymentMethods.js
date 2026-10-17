import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

const listStmt = db.prepare(
  "SELECT id, name, is_credit AS isCredit FROM payment_methods WHERE user_id = ? ORDER BY id"
);
const insertStmt = db.prepare(
  "INSERT INTO payment_methods (user_id, name, is_credit) VALUES (?, ?, ?)"
);
const getStmt = db.prepare(
  "SELECT id, name, is_credit AS isCredit FROM payment_methods WHERE id = ? AND user_id = ?"
);
const deleteStmt = db.prepare(
  "DELETE FROM payment_methods WHERE id = ? AND user_id = ?"
);

router.get("/", (req, res) => {
  const rows = listStmt.all(req.user.id);
  res.json(rows.map((r) => ({ ...r, isCredit: !!r.isCredit })));
});

router.post("/", (req, res) => {
  const { name, isCredit } = req.body || {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name required" });
  }
  const result = insertStmt.run(req.user.id, name.trim(), isCredit ? 1 : 0);
  const row = getStmt.get(result.lastInsertRowid, req.user.id);
  res.status(201).json({ ...row, isCredit: !!row.isCredit });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = deleteStmt.run(id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

export default router;
