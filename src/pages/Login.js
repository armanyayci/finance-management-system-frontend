import React, { useContext} from 'react';
import AuthLayout from '../components/Auth/Auth-Layout';
import LoginForm from '../components/Auth/Login-Form';
import { CircularProgress } from '@mui/material';
import { LoginContext } from "../components/Context/LoginContext";

export const Login = () => {
    const { loading,openSnackbar } = useContext(LoginContext);
   
    return ( 
        <div>
            {/* Loading ekranı */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-40">
                    <CircularProgress size={60} />
                </div>
            )}
            {openSnackbar && (
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
