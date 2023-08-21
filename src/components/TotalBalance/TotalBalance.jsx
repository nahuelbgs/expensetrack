import React from "react";

function TotalBalance({total}) {
  return (
    <div className="flex flex-col justify-center w-full h-24">
      <p className="ml-4 text-xl font-extralight">Your total balance</p>
      <p className="ml-4 text-5xl font-semibold">${total}</p>
    </div>
  );
}

export default TotalBalance;
