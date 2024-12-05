import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const FinancialSummary = () => {
  // Veriyi kategorilere ayırıyoruz
  const data = {
    labels: ['Ev Harcamaları', 'Kira', 'Sağlık', 'Giyim', 'Faturalar'],
    datasets: [
      {
        label: 'Harcamalar',
        data: [1200, 1500, 600, 400, 850],  // Her kategoriye karşılık gelen harcama miktarları
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'], // Her bir dilim için renkler
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'], // Kenar renkleri
        borderWidth: 1,
      },
    ],
  };
  const options = {
    cutout: '50%', // Ortadaki boşluğu kontrol eder
    plugins: {
      legend: {
        display: false, // Etiketleri gizle (isteğe bağlı)
      },
    },
    maintainAspectRatio: false, // Grafik boyutlarını esnek yapar
  };

  return (
    <div>
      <div className="bg-white w-[550px] h-[500px] border border-gray-300 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Expense Analyzer</h1>

        {/* From and To Date Inputs */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="w-[48%]">
            <label className="block text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Total Expense Text */}
        <p className="text-lg font-medium text-gray-800">Your total expense: <span className="font-bold text-red-500">4,550 $</span></p>

        <div className="my-4 flex justify-center items-center ml-40" style={{ height: '200px', width: '200px' }}>
          <Doughnut data={data} options={options} />
        </div>
        <div className="flex justify-center">
            <button className='border-2 border-gray-200 bg-white w-40 h-10 rounded-lg text-gray-600'>
                Show full list
            </button>
        </div>


      </div>
    </div>
  );
};

export default FinancialSummary;


