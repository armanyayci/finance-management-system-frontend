// import React, { useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import ApiService from './service/ApiService';

// const FinancialSummary = () => {
//   const [accountInfo, setAccountInfo] = useState(null);
//   const username = localStorage.getItem('username');

//   useEffect(() => {
//     const fetchAccountInfo = async () => {
//       try {
//         const response = await ApiService.GetAccountInfoByUsername(username);
//         console.log(response.data);
//         if (response.success) {
//           setAccountInfo(response.data);
//         }
//       } catch (error) {
//         console.log('Error fetching account info:', error);
//       }
//     };
//     fetchAccountInfo();
//   }, [username]);

//   const data = {
//     labels: ['Balance'],
//     datasets: [
//       {
//         data: accountInfo ? [accountInfo.balance] : [0],
//         backgroundColor: ['#4caf50'],
//         hoverBackgroundColor: ['#45a049'],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const options = {
//     cutout: '50%',
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     maintainAspectRatio: false,
//   };

//   return (
//     <div>
//       <div className="bg-white w-[550px] h-[500px] border border-gray-300 rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold mb-4">Your Financial Summary</h1>
//         {accountInfo ? (
//           <>
//             <p className="mb-4">Balance: <span className="font-medium">{accountInfo.balance} {accountInfo.accountType}</span></p>
//             <p className="mb-4">Transfer Code: <span className="font-medium">{accountInfo.transferCode}</span></p>
//           </>
//         ) : (
//           <p>Loading account data...</p>
//         )}
//         <div className="my-4 flex justify-center items-center ml-60" style={{ height: '200px', width: '200px' }}>
//           <Doughnut data={data} options={options} />
//         </div>
//         <button className="w-[70%] mt-4 bg-green-500 text-white py-2 px-4 rounded-md border-none focus:outline-none focus:ring-0">
//           Transfer Money
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FinancialSummary;
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import ApiService from './service/ApiService';

const FinancialSummary = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await ApiService.GetAccountInfoByUsername(username);
        console.log('API Response:', response); // Yanıtı kontrol et
        if (response && response.success) {
          setAccountInfo(response.data);
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
      }
    };
    if (username) {
      fetchAccountInfo();
    }
  }, [username]);

  const data = {
    labels: ['Balance'],
    datasets: [
      {
        data: accountInfo ? [accountInfo.balance] : [0],
        backgroundColor: ['#4caf50'],
        hoverBackgroundColor: ['#45a049'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '50%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="bg-white w-[550px] h-[500px] border border-gray-300 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Your Financial Summary</h1>
        {accountInfo ? (
          <>
            <p className="mb-4">Balance: <span className="font-medium">{accountInfo.balance} {accountInfo.accountType}</span></p>
            <p className="mb-4">Transfer Code: <span className="font-medium">{accountInfo.transferCode}</span></p>
          </>
        ) : (
          <p>Loading account data...</p>
        )}
        <div className="my-4 flex justify-center items-center ml-60" style={{ height: '200px', width: '200px' }}>
          <Doughnut data={data} options={options} />
        </div>
        <button className="w-[70%] mt-4 bg-green-500 text-white py-2 px-4 rounded-md border-none focus:outline-none focus:ring-0">
          Transfer Money
        </button>
      </div>
    </div>
  );
};

export default FinancialSummary;

