// import React,{useContext} from 'react'
// import AuthLayout from '../components/Auth/Auth-Layout';
// import LoginForm from '../components/Auth/Login-Form';
// import { CircularProgress } from '@mui/material';
// import { LoginContext } from "../components/Context/LoginContext";


// export const Login = () => {
//     const { loading} = useContext(LoginContext);
  
//   return ( 
    
//     <div>
//       {loading && (
//       <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
//         <CircularProgress size={60} />
//       </div>
//     )}
//     {/* Navbar Ekleme */}
//     <nav className="bg-gray-500 p-4">
//       <h1 className="text-black text-center text-xl font-bold">PERSONAL FINANCE MANAGEMENT SYSTEM</h1>
//     </nav>
//     <AuthLayout>
//       <LoginForm />
//     </AuthLayout>
//   </div>
//   )
// }
// export default Login;
import React, { useContext, useState, useEffect } from 'react';
import AuthLayout from '../components/Auth/Auth-Layout';
import LoginForm from '../components/Auth/Login-Form';
import { CircularProgress } from '@mui/material';
import { LoginContext } from "../components/Context/LoginContext";

export const Login = () => {
    const { loading } = useContext(LoginContext);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (loading) {
            setSuccessMessage("Login Successful!");
        } else {
            setTimeout(() => setSuccessMessage(''), 2000); // 2 saniye sonra kaybolsun
        }
    }, [loading]);

    return ( 
        <div>
            {/* Başarı mesajı sağ üst köşede */}
            {successMessage && (
               <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 w-60 h-12 text-xl font-semibold flex items-center justify-center">
               {successMessage}
           </div>
           
            )}

            {/* Loading ekranı */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-40">
                    <CircularProgress size={60} />
                </div>
            )}
            
            {/* Navbar */}
            <nav className="bg-gray-500 p-4">
                <h1 className="text-black text-center text-xl font-bold">
                    PERSONAL FINANCE MANAGEMENT SYSTEM
                </h1>
            </nav>
            
            <AuthLayout>
                <LoginForm />
            </AuthLayout>
        </div>
    );
};

export default Login;
