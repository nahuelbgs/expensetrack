import React from "react";
import AddTransaction from "../Transaction/AddTransaction/AddTransaction";

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
      <p>Home</p>
      <AddTransaction
        transactionName={transactionName}
        transactionAmount={transactionAmount}
        handleTransactionName={handleTransactionName}
        handleTransactionAmount={handleTransactionAmount}
        increaseBalance={increaseBalance}
        decreaseBalance={decreaseBalance}
      />
      <p>Profile</p>
    </footer>
  );
}
