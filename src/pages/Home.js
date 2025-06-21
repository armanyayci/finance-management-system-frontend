import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../Style/HomePage.css';
import FinancialSummary from '../components/FinancialSummary';
import ExpenseChart from '../components/ExpenseChart';
import LastTransactions from '../components/LastTransactions';
import ApiService from '../components/service/ApiService';

export const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const usersRes = await ApiService.GetAllUsers();
        if (usersRes && Array.isArray(usersRes)) {
          const user = usersRes.find(u => u.username === username);
          setUserInfo(user);
        }
      } catch (e) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUser();
  }, [username]);

  return (
      <div className='home'>
        <div><Sidebar/></div>
        <div className='flex-1 p-8'>
          {/* Welcome Header */}
          <div className="mb-8">
            {loading ? (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back...</h1>
            ) : userInfo ? (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userInfo.firstname} {userInfo.lastname}!</h1>
            ) : (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
            )}
            <p className="text-gray-600">Here's your financial overview for today.</p>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8'>
            <FinancialSummary/>
            <ExpenseChart/>
          </div>

          {/* Transactions Section */}
          <div className='max-w-full'>
            <LastTransactions/>
          </div>
        </div>
      </div>
  )
}

export default Home;
