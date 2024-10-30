import React from 'react'
import { Link } from 'react-router-dom'

const Registerform = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <form className='flex flex-col'>
      <label className='flex flex-col gap-2 text-lg font-semibold'>
        Username
        <input type="text"  className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
      </label>
      <label className='flex flex-col gap-2 text-lg font-semibold'>
        First Name
        <input type="text"  className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
      </label>
      <label className='flex flex-col gap-2 text-lg font-semibold'>
        Last Name
        <input type="text"  className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
      </label>
      <label className='flex flex-col gap-2 text-lg font-semibold'>
        Password
        <input type="password"  className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
      </label>
      <label className='flex flex-col gap-2 text-lg font-semibold'>
        E-Mail
        <input type="email"  className='p-4  border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]' />
      </label>
      <button className='bg-red-600 rounded shadow-sm text-black text-lg p-3 mt-4 rounded-[250px]'>Register</button>
      <div className="text-center mb-4 mt-4 font-semibold">Have you already an account? <Link to="/login"><button className='bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]'>Login</button></Link></div>
    </form>
    </div>
  )
}

export default Registerform