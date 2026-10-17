import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import accountsRoutes from "./routes/accounts.js";
import categoriesRoutes from "./routes/categories.js";
import paymentMethodsRoutes from "./routes/paymentMethods.js";
import incomeSourcesRoutes from "./routes/incomeSources.js";
import transactionsRoutes from "./routes/transactions.js";
import importRoutes from "./routes/import.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/payment-methods", paymentMethodsRoutes);
app.use("/api/income-sources", incomeSourcesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/import", importRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`expensetrack-backend listening on http://localhost:${PORT}`);
});
