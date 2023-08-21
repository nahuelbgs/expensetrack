import { useState } from "react";
import { NextUIProvider, CircularProgress } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "./App.css";
import TransactionList from "./components/Transaction/TransactionList/TransactionList";
import AddTransaction from "./components/Transaction/AddTransaction/AddTransaction";
import Header from "./components/Header/Header";
import TotalBalance from "./components/TotalBalance/TotalBalance";

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
          <TotalBalance total={total}/>
          <div className="flex w-full justify-between h-1/6">
            <div className="h-full w-40 flex bg-[#3E3E3E] rounded-2xl justify-around items-center text-black">
              <div>
                <p className="text-white text-2xl">${income}</p>
                <p className="text-[#6C6C6C]">Income</p>
              </div>
              <div>
                <CircularProgress
                  classNames={{
                    svg: "w-10 h-10 drop-shadow-md",
                    indicator: "stroke-[#A2F263]",
                  }}
                  aria-label="Circular Progress"
                  value={income}
                  maxValue={70000}
                />
              </div>
            </div>

            {/* <div className="h-full w-40 flex bg-[#A2F263] rounded-2xl justify-around items-center text-black">
              <div>
                <p className="text-[#6C6C6C]">Ads</p>
              </div>
            </div> */}

            <div className="h-full w-40 flex bg-[#3E3E3E] rounded-2xl justify-around items-center text-black">
              <div>
                <p className="text-white text-2xl">${expense}</p>
                <p className="text-[#6C6C6C]">Expense</p>
              </div>
              <div>
                <CircularProgress
                  classNames={{
                    svg: "w-10 h-10 drop-shadow-md",
                    indicator: "stroke-[#A2F263]",
                  }}
                  aria-label="Circular Progress"
                  value={expense}
                  maxValue={70000}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between items-center h-fit">
            <div className="bg-[#3E3E3E] h-24 w-24 rounded-full flex flex-col justify-center">
              <div className="w-full h-1/2 flex justify-center items-center">
                <img
                  className="w-1/3"
                  src="https://pink-mask.com/wp-content/uploads/2022/02/what-is-the-white-shopping-bag-icon-1.png"
                />
              </div>
              <p className="h-1/4 text-center text-[#A2F263] font-semibold text-md leading-3">
                Shopping
              </p>
            </div>
            <div className="bg-[#3E3E3E] h-24 w-24 rounded-full flex flex-col justify-center">
              <div className="w-full h-1/2 flex justify-center items-center">
                <img
                  className="w-1/3"
                  src="https://www.pngkit.com/png/full/376-3765359_icon-nutrition-food-white-icon-png.png"
                />
              </div>
              <p className="h-1/4 text-center text-[#A2F263] font-semibold text-md leading-3">
                Food
              </p>
            </div>
            <div className="bg-[#3E3E3E] h-24 w-24 rounded-full flex flex-col justify-center">
              <div className="w-full h-1/2 flex justify-center items-center">
                <img
                  className="w-1/3"
                  src="https://www.flyycredit.com/wp-content/uploads/2018/06/globe-icon-white.png"
                />
              </div>
              <p className="h-1/4 text-center text-[#A2F263] font-semibold text-md leading-3">
                Other
              </p>
            </div>
          </div>

          <div className="w-full h-44">
            <TransactionList transactionHistory={transactionHistory} />
          </div>

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
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default App;
