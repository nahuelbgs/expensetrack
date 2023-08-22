import React from "react";

function Filters() {
  return (
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
  );
}

export default Filters;
