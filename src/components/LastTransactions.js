import React, { useEffect, useState } from 'react';
import ApiService from './service/ApiService';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, CreditCardIcon, BanknotesIcon, TagIcon } from '@heroicons/react/24/outline';

const paymentTypeIcon = (type) => {
  if (type === 'CASH') return <BanknotesIcon className="w-5 h-5 inline-block mr-1 text-gray-500" />;
  if (type === 'CARD') return <CreditCardIcon className="w-5 h-5 inline-block mr-1 text-gray-500" />;
  return <TagIcon className="w-5 h-5 inline-block mr-1 text-gray-500" />;
};

const LastTransactions = ({ customClass = '' }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await ApiService.GetAccountInfoByUsername(username);
        if (response && response.success && response.data.lastTransactions) {
          setTransactions(response.data.lastTransactions);
          setBalance(response.data.balance);
        } else {
          setTransactions([]);
          setBalance(null);
        }
      } catch (error) {
        setTransactions([]);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [username]);

  // Calculate previous balances for each transaction
  let prevBalances = [];
  if (balance !== null && transactions.length > 0) {
    let runningBalance = balance;
    for (let i = 0; i < transactions.length; i++) {
      prevBalances[i] = runningBalance;
      if (transactions[i].isIncome) {
        runningBalance -= transactions[i].amount;
      } else {
        runningBalance += transactions[i].amount;
      }
    }
  }

  // Sayfalama için işlemleri böl
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const currentPrevBalances = prevBalances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={`ml-10 ${customClass}`}>
      <div className="bg-white w-full min-h-[180px] border border-gray-300 rounded-lg shadow-md p-5">
        <p className='text-xl font-bold mb-6'>Last 3 Days Transactions</p>
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found for the last 3 days.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {currentTransactions.map((tx, idx) => (
              <div
                key={indexOfFirstItem + idx}
                className={`flex items-center justify-between rounded-xl shadow-md p-4 border-l-8 ${tx.isIncome ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
              >
                <div className="flex items-center gap-4">
                  {tx.isIncome ? (
                    <ArrowDownCircleIcon className="w-8 h-8 text-green-500" />
                  ) : (
                    <ArrowUpCircleIcon className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{tx.description}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        <TagIcon className="w-4 h-4 mr-1 text-gray-500" />{tx.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                        {paymentTypeIcon(tx.paymentType)}{tx.paymentType}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>{tx.isIncome ? '+' : '-'}{tx.amount}₺</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(tx.date).toLocaleString()}</div>
                  {currentPrevBalances[idx] !== undefined && (
                    <div className="text-xs text-blue-700 mt-2 font-semibold">Previous Balance: {currentPrevBalances[idx]}₺</div>
                  )}
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50`}
                >
                  Önceki
                </button>
                <span className="px-2 py-1 text-gray-700 font-medium">{currentPage} / {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50`}
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LastTransactions;
