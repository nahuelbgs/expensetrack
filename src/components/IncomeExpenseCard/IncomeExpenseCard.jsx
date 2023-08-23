import React from "react";
import { CircularProgress } from "@nextui-org/react";
function IncomeExpenseCard({ income, expense }) {
  return (
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

      <div className="h-full w-40 flex bg-[#A2F263] rounded-2xl items-center max-sm:hidden">
        <div className="flex p-4 justify-center">
          <img
            className="w-1/2"
            src="https://cdn-icons-png.flaticon.com/256/25/25231.png"
            alt="github logo"
          />
        </div>
      </div>

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
  );
}

export default IncomeExpenseCard;
