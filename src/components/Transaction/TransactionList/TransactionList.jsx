import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useT } from "../../../i18n/I18n";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function formatDate(raw, lang) {
  if (!raw) return "";
  if (ISO_DATE.test(raw)) {
    const d = new Date(raw + "T00:00");
    return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return raw;
}

function TransactionRow({
  transaction,
  onDelete,
  categories,
  paymentMethods,
  incomeSources,
}) {
  const { t, lang } = useT();
  const isIncome = transaction.type === "income";
  const category = categories?.find((c) => c.id === transaction.categoryId);
  const paymentMethod = paymentMethods?.find(
    (p) => p.id === transaction.paymentMethodId
  );
  const incomeSource = incomeSources?.find(
    (s) => s.id === transaction.incomeSourceId
  );
  const meta = [];
  if (isIncome) {
    if (incomeSource) meta.push(incomeSource.name);
  } else {
    if (category) meta.push(category.name);
    if (paymentMethod) {
      meta.push(
        transaction.installments && transaction.installments > 1
          ? `${paymentMethod.name} · ${transaction.installments}x`
          : paymentMethod.name
      );
    }
  }
  const dateLabel = formatDate(transaction.date, lang);
  if (dateLabel) meta.push(dateLabel);

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex items-center justify-between px-3 py-3 bg-white/[0.03] hover:bg-white/[0.07] transition-colors rounded-2xl cursor-pointer">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isIncome ? "bg-green-electric/20" : "bg-[#ff6b4a]/20"
              }`}
            >
              <span
                className={`text-lg font-semibold ${
                  isIncome ? "text-green-electric" : "text-[#ff6b4a]"
                }`}
              >
                {isIncome ? "↑" : "↓"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {transaction.name}
              </p>
              <p className="text-white/40 text-xs truncate">
                {meta.join(" · ")}
              </p>
            </div>
          </div>
          <p
            className={`text-sm font-semibold shrink-0 ml-2 ${
              isIncome ? "text-green-electric" : "text-white"
            }`}
          >
            {isIncome ? "+" : "-"}${transaction.amount}
          </p>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Transaction actions">
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          onClick={onDelete}
        >
          {t("common.delete")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function TransactionList({
  transactionHistory,
  handleDelete,
  categories,
  paymentMethods,
  incomeSources,
}) {
  const { t } = useT();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full rounded-3xl p-4 bg-[#0f111a]/80 backdrop-blur-md border border-white/5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">{t("transactions.title")}</h2>
        <button
          onClick={onOpen}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="View all transactions"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {transactionHistory.length > 0 ? (
          transactionHistory.slice(0, 3).map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onDelete={() => handleDelete(transaction, transactionHistory)}
              categories={categories}
              paymentMethods={paymentMethods}
              incomeSources={incomeSources}
            />
          ))
        ) : (
          <div className="text-center py-6 text-white/40 text-sm">
            {t("transactions.empty")}
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
      >
        <ModalContent>
          <ModalBody className="py-6">
            <h3 className="text-xl font-semibold mb-2">{t("transactions.all")}</h3>
            <div className="flex flex-col gap-2">
              {transactionHistory.length > 0 ? (
                transactionHistory.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={() => handleDelete(transaction, transactionHistory)}
                    categories={categories}
                    paymentMethods={paymentMethods}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-default-400">
                  {t("transactions.emptyLong")}
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TransactionList;
