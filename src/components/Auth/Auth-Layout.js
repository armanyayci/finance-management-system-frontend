import React from 'react';
import logo from './logo.svg';

const AuthLayout = ({children}) => {
  return (
    <div className="flex  justify-end min-h-screen bg-gray-500">
        <img 
        src={logo} // Image path
        alt="Auth Background" 
        className="w-[400px] h-[400px] mt-[120px] mr-[200px] object-cover" // image styling
      /> 
      <div className="h-full w-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;
