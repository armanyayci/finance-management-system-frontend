import React from 'react';
import Sidebar from '../components/Sidebar';
import '../Style/HomePage.css';
import FinancialSummary from '../components/FinancialSummary';
import ExpenseChart from '../components/ExpenseChart';
import LastTransactions from '../components/LastTransactions';

export const Home = () => {

  return (
    <div className='home'>
    <div><Sidebar/></div>
    <div className='flex flex-col ml-10 mt-10'>
      <div className='ml-10 flex flex-row gap-10'>
          <FinancialSummary/>
          <ExpenseChart/>
      </div>
      <div className='mt-10'>
        <LastTransactions/>
      </div>
    </div>
    
     </div>
  )
}
export default Home;