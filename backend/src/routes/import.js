import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

const insertAccount = db.prepare(
  "INSERT INTO accounts (user_id, name, gradient) VALUES (?, ?, ?)"
);
const insertCategory = db.prepare(
  "INSERT INTO categories (user_id, name) VALUES (?, ?)"
);
const insertPayment = db.prepare(
  "INSERT INTO payment_methods (user_id, name, is_credit) VALUES (?, ?, ?)"
);
const insertIncomeSource = db.prepare(
  "INSERT INTO income_sources (user_id, name) VALUES (?, ?)"
);
const insertTransaction = db.prepare(
  `INSERT INTO transactions
   (user_id, account_id, name, amount, date, type, category_id, payment_method_id, installments, income_source_id)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

const asArray = (v) => (Array.isArray(v) ? v : []);
const map = (table) => (oldId, lookup) => {
  if (oldId == null) return null;
  return lookup[String(oldId)] ?? null;
};

router.post("/", (req, res) => {
  const userId = req.user.id;
  const {
    accounts = [],
    categories = [],
    paymentMethods = [],
    incomeSources = [],
    transactions = [],
  } = req.body || {};

  const result = {
    accounts: 0,
    categories: 0,
    paymentMethods: 0,
    incomeSources: 0,
    transactions: 0,
    skippedTransactions: 0,
  };

  const run = db.transaction(() => {
    const accountIds = {};
    for (const a of asArray(accounts)) {
      if (!a?.name) continue;
      const r = insertAccount.run(userId, String(a.name), a.gradient || null);
      accountIds[String(a.id)] = Number(r.lastInsertRowid);
      result.accounts++;
    }

    const categoryIds = {};
    for (const c of asArray(categories)) {
      if (!c?.name) continue;
      const r = insertCategory.run(userId, String(c.name));
      categoryIds[String(c.id)] = Number(r.lastInsertRowid);
      result.categories++;
    }

    const paymentIds = {};
    for (const p of asArray(paymentMethods)) {
      if (!p?.name) continue;
      const r = insertPayment.run(userId, String(p.name), p.isCredit ? 1 : 0);
      paymentIds[String(p.id)] = Number(r.lastInsertRowid);
      result.paymentMethods++;
    }

    const sourceIds = {};
    for (const s of asArray(incomeSources)) {
      if (!s?.name) continue;
      const r = insertIncomeSource.run(userId, String(s.name));
      sourceIds[String(s.id)] = Number(r.lastInsertRowid);
      result.incomeSources++;
    }

    const mapAccount = map("accounts");
    const mapCategory = map("categories");
    const mapPayment = map("payment_methods");
    const mapSource = map("income_sources");

    for (const t of asArray(transactions)) {
      const newAccountId = mapAccount(t.accountId, accountIds);
      if (!newAccountId) {
        result.skippedTransactions++;
        continue;
      }
      if (t.type !== "income" && t.type !== "expense") {
        result.skippedTransactions++;
        continue;
      }
      if (!t.name || !Number.isFinite(Number(t.amount))) {
        result.skippedTransactions++;
        continue;
      }
      const date =
        typeof t.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.date)
          ? t.date
          : new Date().toISOString().slice(0, 10);

      insertTransaction.run(
        userId,
        newAccountId,
        String(t.name),
        Number(t.amount),
        date,
        t.type,
        mapCategory(t.categoryId, categoryIds),
        mapPayment(t.paymentMethodId, paymentIds),
        t.installments ?? null,
        mapSource(t.incomeSourceId, sourceIds)
      );
      result.transactions++;
    }
  });

  try {
    run();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Import failed", detail: err.message });
  }
});

export default router;
