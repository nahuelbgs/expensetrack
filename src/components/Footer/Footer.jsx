import React from "react";
import AddTransaction from "../Transaction/AddTransaction/AddTransaction";
import { Link } from 'react-router-dom'
export default function Footer({
  transactionName,
  transactionAmount,
  handleTransactionName,
  handleTransactionAmount,
  increaseBalance,
  decreaseBalance,
}) {
  return (
    <footer className="w-full flex justify-around items-center h-12">
      <Link to='/'>Home</Link>
      <AddTransaction
        transactionName={transactionName}
        transactionAmount={transactionAmount}
        handleTransactionName={handleTransactionName}
        handleTransactionAmount={handleTransactionAmount}
        increaseBalance={increaseBalance}
        decreaseBalance={decreaseBalance}
      />
      <Link to='/profile'>Profile</Link>
    </footer>
  );
}
