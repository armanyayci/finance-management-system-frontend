import React from 'react';
import Sidebar from '../components/Sidebar';
import '../Style/HomePage.css';
import FinancialSummary from '../components/FinancialSummary';
import ExpenseChart from '../components/ExpenseChart';
import TotalIncome from '../components/TotalIncome';
//import { jwtDecode } from 'jwt-decode';
export const Home = () => {
  // const userToken= localStorage.getItem('token');
  // const data =jwtDecode(userToken);                   token'dan datayı alma işlemi
  //  const fullname=data.sub;
  return (
    <div className='home'>
    <div><Sidebar/></div>
    <div className='flex flex-col ml-10 mt-10'>
      <div className='ml-10 flex flex-row gap-10'>
          <FinancialSummary/>
          <ExpenseChart/>
      </div>
      <div className='mt-10'>
        <TotalIncome/>
      </div>
    </div>
    
     </div>
  )
}
export default Home;