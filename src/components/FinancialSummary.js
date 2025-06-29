import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ApiService from './service/ApiService';
import TransferMoney from '../pages/TranferMoney';
import { Copy } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BanknotesIcon, IdentificationIcon, ClipboardDocumentIcon, ArrowDownCircleIcon, ArrowUpCircleIcon, EyeIcon, EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const FinancialSummary = ({ accounts = [], currentAccountIndex = 0, onAccountChange }) => {
  const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
  const [showBalance, setShowBalance] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hesap değiştiğinde gelir/gideri güncelle
  useEffect(() => {
    if (accounts.length > 0 && accounts[currentAccountIndex]) {
      const account = accounts[currentAccountIndex];
      if (account && account.lastTransactions) {
        let income = 0;
        let expense = 0;
        account.lastTransactions.forEach(tx => {
          if (tx.isIncome) income += tx.amount;
          else expense += tx.amount;
        });
        setIncomeExpense({ income, expense });
      } else {
        setIncomeExpense({ income: 0, expense: 0 });
      }
    }
  }, [accounts, currentAccountIndex]);

  const handleCopy = () => {
    const account = accounts[currentAccountIndex];
    if (account?.transferCode) {
      navigator.clipboard.writeText(account.transferCode);
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

  const handleNextAccount = () => {
    if (onAccountChange) {
      const newIndex = (currentAccountIndex + 1) % accounts.length;
      onAccountChange(newIndex);
    }
  };

  const handlePrevAccount = () => {
    if (onAccountChange) {
      const newIndex = (currentAccountIndex - 1 + accounts.length) % accounts.length;
      onAccountChange(newIndex);
    }
  };

  const account = accounts[currentAccountIndex];

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
        {accounts.length > 0 && account ? (
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
                    <span className="text-lg font-bold text-green-600">{showBalance ? incomeExpense.income.toFixed(2) + '₺' : '****'}</span>
                    <span className="text-xs text-gray-500">Income</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpCircleIcon className="w-5 h-5 text-red-500" />
                    <span className="text-lg font-bold text-red-600">{showBalance ? incomeExpense.expense.toFixed(2) + '₺' : '****'}</span>
                    <span className="text-xs text-gray-500">Expense</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-extrabold text-green-600">
                  {showBalance ? account.balance : '****'}
                </span>
                <button
                  onClick={() => setShowBalance((prev) => !prev)}
                  className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                  title={showBalance ? 'Bakiyeyi Gizle' : 'Bakiyeyi Göster'}
                >
                  {showBalance ? (
                    <EyeSlashIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <EyeIcon className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>
              <span className="text-md font-semibold text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                <IdentificationIcon className="w-4 h-4 text-gray-400" />
                {account.accountType}
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <ClipboardDocumentIcon className="w-4 h-4 text-blue-500" />
                  {account.transferCode}
                </span>
                <button onClick={handleCopy} className="ml-2 p-1 rounded hover:bg-blue-200 transition-colors">
                  <Copy size={18} />
                </button>
              </div>
              {/* Hesaplar arası geçiş butonları */}
              {accounts.length > 1 && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handlePrevAccount}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Önceki Hesap"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-500" />
                  </button>
                  <button
                    onClick={handleNextAccount}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Sonraki Hesap"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-400">{currentAccountIndex + 1} / {accounts.length}</div>
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

