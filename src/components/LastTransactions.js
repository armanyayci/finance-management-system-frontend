import React from 'react';

const LastTransactions = () => {
  return (
    <div className="ml-10"> {/* 5px'lik sağ ve sol boşluk */}
      <div className="bg-white w-[100%] h-[130px] border border-gray-300 rounded-lg shadow-md p-3 ">
       <p className='text-xl font-bold mb-4'>Last 3 transactions </p>
       <ul>
        <li>Transaction 1</li>
        <li>Transaction 2</li>
        <li>Transaction 3</li>
       </ul>
      </div>
    </div>
  );
};

export default LastTransactions;
