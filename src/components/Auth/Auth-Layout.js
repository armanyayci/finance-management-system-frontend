import React from 'react';
const AuthLayout = ({children}) => {
  return (
    <div className="flex  justify-end min-h-screen bg-green-700">
       <img 
        src={require('./Fotoğraf.jpeg')} // Görsel yolu
        alt="Auth Background" 
        className="w-[300px] h-[400px] mt-[120px] mr-[200px] object-cover" // Görsel boyutlandırma
      />
      <div className="h-full w-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;
