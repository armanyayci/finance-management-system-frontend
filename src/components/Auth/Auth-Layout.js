import React from 'react';
import logo from './logo.svg';

const AuthLayout = ({children}) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left: Logo/Visual */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-200 to-blue-400">
        <img 
          src={logo}
          alt="Auth Background"
          className="w-[320px] h-[320px] object-contain drop-shadow-xl mb-6"
        />
        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Finance Management</h1>
        <p className="text-blue-900/70 mt-2 text-lg font-medium">Welcome to your secure portal</p>
      </div>
      {/* Right: Form */}
      <div className="flex items-center justify-center w-1/2 min-h-screen">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;
