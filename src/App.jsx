import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import TransactionList from "./components/Transaction/TransactionList/TransactionList";
import Header from "./components/Header/Header";
import TotalBalance from "./components/TotalBalance/TotalBalance";
import IncomeExpenseCard from "./components/IncomeExpenseCard/IncomeExpenseCard";
import Filters from "./components/Filters/Filters";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  const [total, setTotal] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [id, setId] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const date = new Date();
  const transaction = {
    id: id,
    name: transactionName,
    amount: transactionAmount,
    date: date.toLocaleString(),
    type: "",
  };

  const handleTransactionName = (e) => {
    setTransactionName(e.target.value);
  };

  const handleTransactionAmount = (e) => {
    setTransactionAmount(parseInt(e.target.value));
  };
  const increaseBalance = (e) => {
    e.preventDefault();
    setTotal(total + transactionAmount);
    setTransactionHistory([transaction, ...transactionHistory]);
    setIncome(income + transactionAmount);
    setTransactionAmount("");
    setTransactionName("");
    setId(id + 1);
    transaction.type = "income";
  };
  const decreaseBalance = (e) => {
    e.preventDefault();
    setTotal(total - transactionAmount);
    setTransactionHistory([transaction, ...transactionHistory]);
    setExpense(expense + transactionAmount);
    setTransactionAmount("");
    setTransactionName("");
    setId(id + 1);
    transaction.type = "exponse";
  };

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className="m-auto max-w-2xl h-screen flex flex-col items-center justify-between px-4 pt-1">
          <Header />
          <TotalBalance total={total} />
          <IncomeExpenseCard income={income} expense={expense} />
          <TransactionList transactionHistory={transactionHistory} />
          <Footer
            transactionName={transactionName}
            transactionAmount={transactionAmount}
            handleTransactionName={handleTransactionName}
            handleTransactionAmount={handleTransactionAmount}
            increaseBalance={increaseBalance}
            decreaseBalance={decreaseBalance}
          />
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default App;
