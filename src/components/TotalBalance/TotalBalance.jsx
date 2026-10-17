import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useT } from "../../i18n/I18n";
import { resolveGradient } from "../../accountGradients";

function fmt(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-US");
}

function PickerButton({ label, value, placeholder, onClick }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className="h-10 px-3 rounded-xl bg-default-100 hover:bg-default-200 text-left text-sm flex items-center justify-between transition-colors"
      >
        <span className={value ? "" : "text-default-400"}>
          {value || placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function PickerModal({ isOpen, onOpenChange, title, items, selectedId, onSelect, allowClear = true }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="sm"
      shouldBlockScroll={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody className="pb-4 gap-1">
              {items.map((item) => {
                const isSelected = String(item.id) === String(selectedId);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(isSelected && allowClear ? "" : item.id);
                      onClose();
                    }}
                    className={`px-3 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-green-electric/20 text-green-electric"
                        : "hover:bg-default-100"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function AccountCard({ name, balance, gradient, t }) {
  return (
    <div
      className="w-full rounded-3xl p-5 relative overflow-hidden shadow-2xl"
      style={{ background: resolveGradient(gradient) }}
    >
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-start justify-between">
        <p className="text-white/70 text-sm tracking-widest font-light truncate">
          {name}
        </p>
        <div className="flex -space-x-2 shrink-0">
          <span className="w-6 h-6 rounded-full bg-[#eb001b]" />
          <span className="w-6 h-6 rounded-full bg-[#f79e1b] mix-blend-screen" />
        </div>
      </div>
      <div className="relative mt-6">
        <p className="text-white/60 text-xs">{t("card.balance")}</p>
        <p className="text-4xl font-semibold text-white mt-1 tracking-tight">
          ${fmt(balance)}
        </p>
      </div>
    </div>
  );
}

function PlaceholderCard({ t, onCreate }) {
  return (
    <div
      className="w-full rounded-3xl p-5 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center gap-3 min-h-[160px]"
      style={{ background: resolveGradient("midnight") }}
    >
      <p className="text-white/60 text-sm">{t("card.balance")}</p>
      <Button
        className="bg-white/10 text-white"
        variant="flat"
        onPress={onCreate}
      >
        {t("add.createAccount")}
      </Button>
    </div>
  );
}

const TotalBalance = forwardRef(function TotalBalance({
  accounts,
  accountBalances,
  activeAccountId,
  onAccountChange,
  transactionName,
  transactionAmount,
  handleTransactionName,
  handleTransactionAmount,
  increaseBalance,
  decreaseBalance,
  categories,
  paymentMethods,
  incomeSources,
  openSettings,
}, ref) {
  const { t } = useT();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const categoryPicker = useDisclosure();
  const paymentPicker = useDisclosure();
  const incomeSourcePicker = useDisclosure();
  const accountPicker = useDisclosure();
  const [mode, setMode] = useState("income");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [incomeSourceId, setIncomeSourceId] = useState("");
  const [installments, setInstallments] = useState("1");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const selectedPM = paymentMethods?.find(
    (p) => String(p.id) === String(paymentMethodId)
  );
  const showInstallments = mode === "expense" && selectedPM?.isCredit;
  const hasAccounts = (accounts || []).length > 0;

  const scrollerRef = useRef(null);
  const skipScrollSync = useRef(false);
  const isFirstScrollSync = useRef(true);

  useEffect(() => {
    if (!hasAccounts) return;
    const el = scrollerRef.current;
    if (!el) return;
    const idx = accounts.findIndex((a) => a.id === activeAccountId);
    if (idx < 0) return;
    const card = el.children[idx];
    if (!card) return;
    const target =
      card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    if (Math.abs(el.scrollLeft - target) > 2) {
      skipScrollSync.current = true;
      const smooth = !isFirstScrollSync.current;
      el.scrollTo({ left: target, behavior: smooth ? "smooth" : "instant" });
      setTimeout(
        () => (skipScrollSync.current = false),
        smooth ? 500 : 50
      );
    }
    isFirstScrollSync.current = false;
  }, [activeAccountId, accounts, hasAccounts]);

  const handleScroll = () => {
    if (skipScrollSync.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    const next = accounts[closestIdx];
    if (next && next.id !== activeAccountId) {
      onAccountChange(next.id);
    }
  };

  const stepAccount = (delta) => {
    if (!hasAccounts) return;
    const idx = accounts.findIndex((a) => a.id === activeAccountId);
    const nextIdx = Math.max(0, Math.min(accounts.length - 1, idx + delta));
    if (nextIdx !== idx) onAccountChange(accounts[nextIdx].id);
  };

  const openWith = (nextMode) => {
    if (!hasAccounts) {
      openSettings?.("accounts");
      return;
    }
    setMode(nextMode);
    setAccountId(String(activeAccountId || ""));
    setCategoryId("");
    setPaymentMethodId("");
    setIncomeSourceId("");
    setInstallments("1");
    setDate(new Date().toISOString().slice(0, 10));
    onOpen();
  };

  useImperativeHandle(ref, () => ({ openAdd: openWith }), [
    hasAccounts,
    activeAccountId,
  ]);

  const handleConfirm = (onClose) => {
    const commonExtras = {
      accountId: accountId ? Number(accountId) : null,
      date,
    };
    if (mode === "income") {
      increaseBalance(undefined, {
        ...commonExtras,
        incomeSourceId: incomeSourceId ? Number(incomeSourceId) : null,
      });
    } else {
      decreaseBalance(undefined, {
        ...commonExtras,
        categoryId: categoryId ? Number(categoryId) : null,
        paymentMethodId: paymentMethodId ? Number(paymentMethodId) : null,
        installments:
          paymentMethodId && selectedPM?.isCredit
            ? Number(installments) || 1
            : null,
      });
    }
    onClose();
  };

  const selectedAccount = (accounts || []).find(
    (a) => String(a.id) === String(accountId)
  );

  return (
    <div className="w-full">
      {hasAccounts ? (
        <>
          <div className="relative -mx-1">
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="w-full flex overflow-x-auto snap-x snap-mandatory gap-2 px-6 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {accounts.map((a) => {
                const isActive = a.id === activeAccountId;
                return (
                  <div
                    key={a.id}
                    role={isActive ? undefined : "button"}
                    tabIndex={isActive ? -1 : 0}
                    onClick={isActive ? undefined : () => onAccountChange(a.id)}
                    className={`snap-center shrink-0 w-[calc(100%-48px)] transition-all duration-300 ease-out ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-[0.94] opacity-70"
                    }`}
                  >
                    <AccountCard
                      name={a.name}
                      balance={accountBalances?.[a.id] ?? 0}
                      gradient={a.gradient}
                      t={t}
                    />
                  </div>
                );
              })}
            </div>
            {accounts.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => stepAccount(-1)}
                  disabled={
                    accounts.findIndex((a) => a.id === activeAccountId) === 0
                  }
                  aria-label="Previous account"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => stepAccount(1)}
                  disabled={
                    accounts.findIndex((a) => a.id === activeAccountId) ===
                    accounts.length - 1
                  }
                  aria-label="Next account"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {accounts.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2.5">
              {accounts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onAccountChange(a.id)}
                  aria-label={`Switch to ${a.name}`}
                  className={`h-1.5 rounded-full transition-all ${
                    a.id === activeAccountId
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <PlaceholderCard t={t} onCreate={() => openSettings?.("accounts")} />
      )}

      <div className="w-full mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={() => openWith("income")}
          className="h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white text-lg font-light"
          aria-label="Add income"
        >
          +
        </button>
        <button
          onClick={() => openWith("expense")}
          className="h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          aria-label="Add expense"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          className="h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
          aria-label="View card"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        shouldBlockScroll={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="pt-6 gap-4">
                <p className="text-lg font-semibold">
                  {mode === "income" ? t("add.income") : t("add.expense")}
                </p>
                <Input
                  type="text"
                  label={t("common.name")}
                  placeholder={t("add.transactionName")}
                  onChange={handleTransactionName}
                  value={transactionName}
                  labelPlacement="outside"
                />
                <Input
                  type="number"
                  label={t("common.amount")}
                  placeholder="0.00"
                  labelPlacement="outside"
                  onChange={handleTransactionAmount}
                  value={transactionAmount}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                />
                <Input
                  type="date"
                  label={t("common.date")}
                  labelPlacement="outside"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <PickerButton
                  label={t("add.account")}
                  value={selectedAccount?.name}
                  placeholder={t("add.selectAccount")}
                  onClick={accountPicker.onOpen}
                />

                {mode === "income" && (
                  <>
                    {(incomeSources || []).length === 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{t("add.source")}</span>
                        <Button
                          variant="flat"
                          onPress={() => openSettings?.("income")}
                          className="justify-start"
                        >
                          {t("add.createSource")}
                        </Button>
                      </div>
                    ) : (
                      <PickerButton
                        label={`${t("add.source")} (${t("common.optional")})`}
                        value={
                          incomeSources.find(
                            (s) => String(s.id) === String(incomeSourceId)
                          )?.name
                        }
                        placeholder={t("add.selectSource")}
                        onClick={incomeSourcePicker.onOpen}
                      />
                    )}
                  </>
                )}
                {mode === "expense" && (
                  <>
                    {(categories || []).length === 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{t("add.category")}</span>
                        <Button
                          variant="flat"
                          onPress={() => openSettings?.("categories")}
                          className="justify-start"
                        >
                          {t("add.createCategory")}
                        </Button>
                      </div>
                    ) : (
                      <PickerButton
                        label={`${t("add.category")} (${t("common.optional")})`}
                        value={
                          categories.find(
                            (c) => String(c.id) === String(categoryId)
                          )?.name
                        }
                        placeholder={t("add.selectCategory")}
                        onClick={categoryPicker.onOpen}
                      />
                    )}

                    {(paymentMethods || []).length === 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{t("add.payment")}</span>
                        <Button
                          variant="flat"
                          onPress={() => openSettings?.("payment")}
                          className="justify-start"
                        >
                          {t("add.createPayment")}
                        </Button>
                      </div>
                    ) : (
                      <PickerButton
                        label={`${t("add.payment")} (${t("common.optional")})`}
                        value={
                          paymentMethods.find(
                            (p) => String(p.id) === String(paymentMethodId)
                          )?.name
                        }
                        placeholder={t("add.selectPayment")}
                        onClick={paymentPicker.onOpen}
                      />
                    )}

                    {showInstallments && (
                      <Input
                        type="number"
                        min="1"
                        label={t("add.installments")}
                        labelPlacement="outside"
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                      />
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {mode === "income" ? (
                  <Button
                    className="w-full bg-green-electric text-black font-semibold"
                    onPress={() => handleConfirm(onClose)}
                  >
                    {t("add.income")}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[#ff6b4a] text-white font-semibold"
                    onPress={() => handleConfirm(onClose)}
                  >
                    {t("add.expense")}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <PickerModal
        isOpen={accountPicker.isOpen}
        onOpenChange={accountPicker.onOpenChange}
        title={t("picker.account")}
        items={accounts || []}
        selectedId={accountId}
        onSelect={(id) => setAccountId(String(id))}
        allowClear={false}
      />
      <PickerModal
        isOpen={categoryPicker.isOpen}
        onOpenChange={categoryPicker.onOpenChange}
        title={t("picker.category")}
        items={categories || []}
        selectedId={categoryId}
        onSelect={(id) => setCategoryId(String(id))}
      />
      <PickerModal
        isOpen={paymentPicker.isOpen}
        onOpenChange={paymentPicker.onOpenChange}
        title={t("picker.payment")}
        items={paymentMethods || []}
        selectedId={paymentMethodId}
        onSelect={(id) => setPaymentMethodId(String(id))}
      />
      <PickerModal
        isOpen={incomeSourcePicker.isOpen}
        onOpenChange={incomeSourcePicker.onOpenChange}
        title={t("picker.source")}
        items={incomeSources || []}
        selectedId={incomeSourceId}
        onSelect={(id) => setIncomeSourceId(String(id))}
      />
    </div>
  );
});

export default TotalBalance;
