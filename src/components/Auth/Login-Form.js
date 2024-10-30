import React from 'react'
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className='flex flex-col'>
        <label className='flex flex-col gap-2 text-lg font-semibold'>
          Username
          <input type="text" className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
        </label>
        <label className='flex flex-col gap-2 text-lg font-semibold mt-4'>
          Password
          <input type="password" className='p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
        </label>
        <button className='bg-red-600 rounded-[250px] shadow-sm text-black text-lg p-4 mt-[50px] text-lg font-semibold'>Login</button>
        <div className="text-center mb-4 mt-4 font-semibold">
          Don't you have an account? <Link to="/register" ><button className='bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]'>Register</button></Link>
        </div>
      </form>
      </div>
  )
}

export default LoginForm;
