import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

const SELECT_COLS = `
  id,
  account_id       AS accountId,
  name,
  amount,
  date,
  type,
  category_id      AS categoryId,
  payment_method_id AS paymentMethodId,
  installments,
  income_source_id AS incomeSourceId
`;

const listStmt = db.prepare(
  `SELECT ${SELECT_COLS} FROM transactions WHERE user_id = ? ORDER BY id DESC`
);
const insertStmt = db.prepare(
  `INSERT INTO transactions
   (user_id, account_id, name, amount, date, type, category_id, payment_method_id, installments, income_source_id)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const getStmt = db.prepare(
  `SELECT ${SELECT_COLS} FROM transactions WHERE id = ? AND user_id = ?`
);
const deleteStmt = db.prepare(
  "DELETE FROM transactions WHERE id = ? AND user_id = ?"
);

const belongsTo = (table, id, userId) => {
  if (id == null) return true;
  const row = db
    .prepare(`SELECT 1 FROM ${table} WHERE id = ? AND user_id = ?`)
    .get(id, userId);
  return !!row;
};

router.get("/", (req, res) => {
  res.json(listStmt.all(req.user.id));
});

router.post("/", (req, res) => {
  const {
    accountId,
    name,
    amount,
    date,
    type,
    categoryId = null,
    paymentMethodId = null,
    installments = null,
    incomeSourceId = null,
  } = req.body || {};

  if (!accountId || !Number.isFinite(Number(accountId))) {
    return res.status(400).json({ error: "accountId required" });
  }
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name required" });
  }
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: "amount must be positive" });
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  }
  if (type !== "income" && type !== "expense") {
    return res.status(400).json({ error: "type must be income|expense" });
  }

  if (!belongsTo("accounts", Number(accountId), req.user.id)) {
    return res.status(400).json({ error: "accountId not found" });
  }
  if (!belongsTo("categories", categoryId, req.user.id)) {
    return res.status(400).json({ error: "categoryId not found" });
  }
  if (!belongsTo("payment_methods", paymentMethodId, req.user.id)) {
    return res.status(400).json({ error: "paymentMethodId not found" });
  }
  if (!belongsTo("income_sources", incomeSourceId, req.user.id)) {
    return res.status(400).json({ error: "incomeSourceId not found" });
  }

  const result = insertStmt.run(
    req.user.id,
    Number(accountId),
    name.trim(),
    Number(amount),
    date,
    type,
    categoryId,
    paymentMethodId,
    installments,
    incomeSourceId
  );
  res.status(201).json(getStmt.get(result.lastInsertRowid, req.user.id));
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = deleteStmt.run(id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

export default router;
