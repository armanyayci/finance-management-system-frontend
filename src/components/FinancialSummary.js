import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ApiService from './service/ApiService';
import TransferMoney from '../pages/TranferMoney';
import { Copy } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BanknotesIcon, IdentificationIcon, ClipboardDocumentIcon, ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

const FinancialSummary = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
  const username = localStorage.getItem('username');
 
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await ApiService.GetAccountInfoByUsername(username);
        if (response && response.success) {
          setAccountInfo(response.data);
          // Calculate income and expense from lastTransactions
          if (response.data.lastTransactions) {
            let income = 0;
            let expense = 0;
            response.data.lastTransactions.forEach(tx => {
              if (tx.isIncome) income += tx.amount;
              else expense += tx.amount;
            });
            setIncomeExpense({ income, expense });
          } else {
            setIncomeExpense({ income: 0, expense: 0 });
          }
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
        setIncomeExpense({ income: 0, expense: 0 });
      }
    };
    if (username) {
      fetchAccountInfo();
    }
  }, [username]);

  const handleCopy = () => {
    if (accountInfo?.transferCode) {
      navigator.clipboard.writeText(accountInfo.transferCode);
      toast.success('Transfer Code Copied!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [incomeExpense.income, incomeExpense.expense],
        backgroundColor: ['#22c55e', '#ef4444'],
        hoverBackgroundColor: ['#16a34a', '#dc2626'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex justify-center items-center min-h-[520px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
      <ToastContainer />
      <div className="bg-white w-full max-w-[500px] border border-gray-200 rounded-2xl shadow-2xl p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <BanknotesIcon className="w-8 h-8 text-green-500" /> Financial Summary
        </h1>
        {accountInfo ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-[160px] h-[160px] mb-4">
                <Doughnut data={data} options={options} />
              </div>
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 mb-2">Last 3 Days</p>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-1">
                    <ArrowDownCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-lg font-bold text-green-600">{incomeExpense.income}₺</span>
                    <span className="text-xs text-gray-500">Income</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpCircleIcon className="w-5 h-5 text-red-500" />
                    <span className="text-lg font-bold text-red-600">{incomeExpense.expense}₺</span>
                    <span className="text-xs text-gray-500">Expense</span>
                  </div>
                </div>
              </div>
              <span className="text-4xl font-extrabold text-green-600 mb-2">{accountInfo.balance}</span>
              <span className="text-md font-semibold text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                <IdentificationIcon className="w-4 h-4 text-gray-400" />
                {accountInfo.accountType}
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <ClipboardDocumentIcon className="w-4 h-4 text-blue-500" />
                  {accountInfo.transferCode}
                </span>
                <button onClick={handleCopy} className="ml-2 p-1 rounded hover:bg-blue-200 transition-colors">
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg">Loading account data...</p>
          </div>
        )}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl text-lg font-bold shadow hover:from-green-600 hover:to-green-700 transition-colors"
        >
          Transfer Money
        </button>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <TransferMoney setIsModalOpen={setIsModalOpen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSummary;

