import React from "react";

function TransactionList({ transactionHistory }) {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl">Transactions</h2>
        <button>View More</button>
      </div>
      <div className="w-full">
        {transactionHistory.map((transaction) => (
          <div
            className="flex justify-around mb-1 bg-[#3E3E3E] rounded-2xl"
            key={transaction.id}
          >
            <div className="mb-2 mt-2">
              <p className="font-semibold text-lg text-white">
                {transaction.name}
              </p>
              <p className="text-sm text-[#6C6C6C]">{transaction.date}</p>
            </div>
            <div className="flex items-center">
              <p className="font-semibold text-lg text-white">
                <span>{transaction.type === "income" ? "+" : "-"}</span>$
                {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
