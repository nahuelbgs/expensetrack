import { useState, useEffect } from "react";
import TransactionList from "../Transaction/TransactionList/TransactionList";
import IncomeExpenseCard from "../IncomeExpenseCard/IncomeExpenseCard";
import TotalBalance from "../TotalBalance/TotalBalance";
import Header from "../Header/Header";
import AddTransaction from "../Transaction/AddTransaction/AddTransaction";

function Main() {
  const [total, setTotal] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const savedTotal = localStorage.getItem("total");
    const savedTransactionHistory = localStorage.getItem("transactionHistory");
    const savedIncome = localStorage.getItem("income");
    const savedExpense = localStorage.getItem("expense");

    setTotal(savedTotal ? parseInt(savedTotal) : 0);
    setTransactionHistory(
      savedTransactionHistory ? JSON.parse(savedTransactionHistory) : []
    );
    setIncome(savedIncome ? parseInt(savedIncome) : 0);
    setExpense(savedExpense ? parseInt(savedExpense) : 0);
  }, []);

  const date = new Date();
  const transaction = {
    id: Date.now(),
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
    if (transaction.name === "") {
      alert("The transaction name cannot be empty.");
    } else if (transaction.amount.length === 0) {
      alert("The transaction amount cannot be empty.");
    } else {
      e.preventDefault();
      localStorage.setItem("total", parseInt(total) + transactionAmount);
      setTotal(total + transactionAmount);
      setTransactionHistory([transaction, ...transactionHistory]);
      transaction.type = "income";
      localStorage.setItem(
        "transactionHistory",
        JSON.stringify([transaction, ...transactionHistory])
      );
      localStorage.setItem("income", parseInt(income) + transactionAmount);
      setIncome(income + transactionAmount);
      setTransactionAmount("");
      setTransactionName("");
    }
  };
  const decreaseBalance = (e) => {
    if (transaction.name === "") {
      alert("The transaction name cannot be empty.");
    } else if (transaction.amount.length === 0) {
      alert("The transaction amount cannot be empty.");
    } else {
      e.preventDefault();
      localStorage.setItem("total", parseInt(total) - transactionAmount);
      setTotal(total - transactionAmount);
      setTransactionHistory([transaction, ...transactionHistory]);
      transaction.type = "expense";
      localStorage.setItem(
        "transactionHistory",
        JSON.stringify([transaction, ...transactionHistory])
      );
      localStorage.setItem("expense", parseInt(expense) + transactionAmount);
      setExpense(expense + transactionAmount);
      setTransactionAmount("");
      setTransactionName("");
    }
  };
  const handleDelete = (transaction, transactionsArray) => {
    const updatedTransactionHistory = transactionsArray.filter(
      (singleTransaction) => singleTransaction.id !== transaction.id
    );
    localStorage.setItem(
      "transactionHistory",
      JSON.stringify(updatedTransactionHistory)
    );
    const updatedTotal =
      transaction.type === "income"
        ? total - transaction.amount
        : total + transaction.amount;
    localStorage.setItem("total", updatedTotal);
    setTotal(updatedTotal);
    if (transaction.type === "income") {
      const updatedIncome = income - transaction.amount;
      localStorage.setItem("income", updatedIncome);
      setIncome(updatedIncome);
    } else {
      const updatedExpense = expense - transaction.amount;
      localStorage.setItem("expense", updatedExpense);
      setExpense(updatedExpense);
    }
    setTransactionHistory(updatedTransactionHistory);
  };

  return (
    <div className="m-auto max-w-2xl h-screen flex flex-col items-center justify-between px-4 py-1">
      <Header />
      <TotalBalance total={total} />
      <IncomeExpenseCard income={income} expense={expense} />
      <TransactionList
        transactionHistory={transactionHistory}
        handleDelete={handleDelete}
      />
      <AddTransaction
        transactionName={transactionName}
        transactionAmount={transactionAmount}
        handleTransactionName={handleTransactionName}
        handleTransactionAmount={handleTransactionAmount}
        increaseBalance={increaseBalance}
        decreaseBalance={decreaseBalance}
      />
    </div>
  );
}

export default Main;
