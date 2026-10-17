import { useEffect, useMemo, useRef, useState } from "react";
import { useDisclosure } from "@heroui/react";
import TransactionList from "../Transaction/TransactionList/TransactionList";
import IncomeExpenseCard from "../IncomeExpenseCard/IncomeExpenseCard";
import TotalBalance from "../TotalBalance/TotalBalance";
import Header from "../Header/Header";
import Settings from "../Settings/Settings";
import BottomNav from "../BottomNav/BottomNav";
import { useT } from "../../i18n/I18n";

function Main() {
  const { t } = useT();
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const settingsModal = useDisclosure();
  const [settingsTab, setSettingsTab] = useState("accounts");
  const totalBalanceRef = useRef(null);

  const openSettings = (tab = "accounts") => {
    setSettingsTab(tab);
    settingsModal.onOpen();
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("transactionHistory");
    const savedCategories = localStorage.getItem("categories");
    const savedPaymentMethods = localStorage.getItem("paymentMethods");
    const savedIncomeSources = localStorage.getItem("incomeSources");
    const savedAccounts = localStorage.getItem("accounts");
    const savedActive = localStorage.getItem("activeAccountId");

    if (savedHistory) setTransactionHistory(JSON.parse(savedHistory));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedPaymentMethods) setPaymentMethods(JSON.parse(savedPaymentMethods));
    if (savedIncomeSources) setIncomeSources(JSON.parse(savedIncomeSources));
    if (savedAccounts) {
      const parsed = JSON.parse(savedAccounts);
      setAccounts(parsed);
      if (savedActive && parsed.some((a) => String(a.id) === savedActive)) {
        setActiveAccountId(Number(savedActive));
      } else if (parsed.length > 0) {
        setActiveAccountId(parsed[0].id);
      }
    }
  }, []);

  const persistCategories = (next) => {
    setCategories(next);
    localStorage.setItem("categories", JSON.stringify(next));
  };
  const addCategory = ({ name }) =>
    persistCategories([...categories, { id: Date.now(), name }]);
  const removeCategory = (id) =>
    persistCategories(categories.filter((c) => c.id !== id));

  const persistPaymentMethods = (next) => {
    setPaymentMethods(next);
    localStorage.setItem("paymentMethods", JSON.stringify(next));
  };
  const addPaymentMethod = ({ name, isCredit }) =>
    persistPaymentMethods([
      ...paymentMethods,
      { id: Date.now(), name, isCredit: !!isCredit },
    ]);
  const removePaymentMethod = (id) =>
    persistPaymentMethods(paymentMethods.filter((p) => p.id !== id));

  const persistIncomeSources = (next) => {
    setIncomeSources(next);
    localStorage.setItem("incomeSources", JSON.stringify(next));
  };
  const addIncomeSource = ({ name }) =>
    persistIncomeSources([...incomeSources, { id: Date.now(), name }]);
  const removeIncomeSource = (id) =>
    persistIncomeSources(incomeSources.filter((s) => s.id !== id));

  const persistAccounts = (next) => {
    setAccounts(next);
    localStorage.setItem("accounts", JSON.stringify(next));
  };
  const addAccount = ({ name, gradient }) => {
    const newAccount = { id: Date.now(), name, gradient };
    persistAccounts([...accounts, newAccount]);
    if (!activeAccountId) selectAccount(newAccount.id);
  };
  const removeAccount = (id) => {
    const next = accounts.filter((a) => a.id !== id);
    persistAccounts(next);
    if (activeAccountId === id) {
      selectAccount(next[0]?.id ?? null);
    }
  };
  const updateAccount = (id, patch) => {
    persistAccounts(
      accounts.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const selectAccount = (id) => {
    setActiveAccountId(id);
    if (id == null) localStorage.removeItem("activeAccountId");
    else localStorage.setItem("activeAccountId", String(id));
  };

  const handleTransactionName = (e) => setTransactionName(e.target.value);
  const handleTransactionAmount = (e) =>
    setTransactionAmount(parseInt(e.target.value));

  const persistHistory = (next) => {
    setTransactionHistory(next);
    localStorage.setItem("transactionHistory", JSON.stringify(next));
  };

  const increaseBalance = (e, extras = {}) => {
    if (!transactionName) return alert(t("add.alertName"));
    if (!transactionAmount) return alert(t("add.alertAmount"));
    if (!extras.accountId) return alert(t("add.alertAccount"));
    e?.preventDefault?.();
    persistHistory([
      {
        id: Date.now(),
        name: transactionName,
        amount: transactionAmount,
        date: extras.date || new Date().toISOString().slice(0, 10),
        type: "income",
        accountId: extras.accountId,
        incomeSourceId: extras.incomeSourceId ?? null,
      },
      ...transactionHistory,
    ]);
    setTransactionAmount("");
    setTransactionName("");
  };

  const decreaseBalance = (e, extras = {}) => {
    if (!transactionName) return alert(t("add.alertName"));
    if (!transactionAmount) return alert(t("add.alertAmount"));
    if (!extras.accountId) return alert(t("add.alertAccount"));
    e?.preventDefault?.();
    persistHistory([
      {
        id: Date.now(),
        name: transactionName,
        amount: transactionAmount,
        date: extras.date || new Date().toISOString().slice(0, 10),
        type: "expense",
        accountId: extras.accountId,
        categoryId: extras.categoryId ?? null,
        paymentMethodId: extras.paymentMethodId ?? null,
        installments: extras.installments ?? null,
      },
      ...transactionHistory,
    ]);
    setTransactionAmount("");
    setTransactionName("");
  };

  const handleDelete = (transaction) => {
    persistHistory(
      transactionHistory.filter((tr) => tr.id !== transaction.id)
    );
  };

  const activeTransactions = useMemo(
    () =>
      activeAccountId
        ? transactionHistory.filter((tr) => tr.accountId === activeAccountId)
        : [],
    [transactionHistory, activeAccountId]
  );

  const activeIncome = useMemo(
    () =>
      activeTransactions
        .filter((tr) => tr.type === "income")
        .reduce((sum, tr) => sum + Number(tr.amount || 0), 0),
    [activeTransactions]
  );

  const activeExpense = useMemo(
    () =>
      activeTransactions
        .filter((tr) => tr.type === "expense")
        .reduce((sum, tr) => sum + Number(tr.amount || 0), 0),
    [activeTransactions]
  );

  const accountBalances = useMemo(() => {
    const map = {};
    for (const a of accounts) map[a.id] = 0;
    for (const tr of transactionHistory) {
      if (map[tr.accountId] == null) continue;
      map[tr.accountId] +=
        (tr.type === "income" ? 1 : -1) * Number(tr.amount || 0);
    }
    return map;
  }, [accounts, transactionHistory]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4 pb-24">
      <div className="w-full max-w-md flex flex-col gap-4 flex-1">
        <Header openSettings={openSettings} />
        <TotalBalance
          ref={totalBalanceRef}
          accounts={accounts}
          accountBalances={accountBalances}
          activeAccountId={activeAccountId}
          onAccountChange={selectAccount}
          transactionName={transactionName}
          transactionAmount={transactionAmount}
          handleTransactionName={handleTransactionName}
          handleTransactionAmount={handleTransactionAmount}
          increaseBalance={increaseBalance}
          decreaseBalance={decreaseBalance}
          categories={categories}
          paymentMethods={paymentMethods}
          incomeSources={incomeSources}
          openSettings={openSettings}
        />
        <IncomeExpenseCard income={activeIncome} expense={activeExpense} />
        <TransactionList
          transactionHistory={activeTransactions}
          handleDelete={handleDelete}
          categories={categories}
          paymentMethods={paymentMethods}
          incomeSources={incomeSources}
        />
      </div>

      <Settings
        isOpen={settingsModal.isOpen}
        onOpenChange={settingsModal.onOpenChange}
        initialTab={settingsTab}
        accounts={accounts}
        categories={categories}
        paymentMethods={paymentMethods}
        incomeSources={incomeSources}
        addAccount={addAccount}
        removeAccount={removeAccount}
        updateAccount={updateAccount}
        addCategory={addCategory}
        removeCategory={removeCategory}
        addPaymentMethod={addPaymentMethod}
        removePaymentMethod={removePaymentMethod}
        addIncomeSource={addIncomeSource}
        removeIncomeSource={removeIncomeSource}
      />

      <BottomNav onAdd={(mode) => totalBalanceRef.current?.openAdd(mode)} />
    </div>
  );
}

export default Main;
