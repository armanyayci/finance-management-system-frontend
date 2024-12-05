import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const FinancialSummary = () => {
  // Doughnut chart verileri
  const data = {
    labels: ['Money In Cash', 'Money On Card', 'Total Savings'],
    datasets: [
      {
        data: [21750, 12100, 15000], // Veriler
        backgroundColor: ['#ff9800', '#2196f3', ' #4caf50'], // Renkler
        hoverBackgroundColor: ['#fb8c00', '#1976d2', ' #45a049'], // Hover renkleri
        borderWidth: 0, // Pasta kenarlığı yok
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
        <h1 className="text-2xl font-bold mb-4">Your Financial Summary</h1>
        <p className="mb-4">Money In Cash: <span className="font-medium">21,750 $</span></p>
        <p className="mb-4">Money On Card: <span className="font-medium">12,100 $</span></p>
        <p className="mb-4">Your Total Savings: <span className="font-medium">15,000 $</span></p>

        {/* Halkayı Küçük Boyuta Sıkıştır */}
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

