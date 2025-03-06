import React from 'react';

const TotalIncome = () => {
  return (
    <div className="ml-10"> {/* 5px'lik sağ ve sol boşluk */}
      <div className="bg-white w-[100%] h-[130px] border border-gray-300 rounded-lg shadow-md p-3 ">
        <p className="mb-2">Your total income before tax: <span className="font-medium text-green-800">21,750 $</span></p>
        <p className="mb-2">You need to pay: 
            <span className="font-medium text-red-800">12,100 $</span>
            <span><button className='border-2 border-gray-200 bg-white w-40 h-8 rounded-lg text-gray-600 ml-7'>
                Calculate
            </button></span>
        </p>
        <p className="mb-2">Your total income after tax: <span className="font-medium text-green-800">15,000 $</span></p>
      </div>
    </div>
  );
};

export default TotalIncome;
