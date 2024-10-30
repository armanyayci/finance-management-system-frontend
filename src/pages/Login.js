import React from 'react'
import AuthLayout from '../components/Auth/Auth-Layout';
import LoginForm from '../components/Auth/Login-Form';

export const Login = () => {
  return ( 
    <div>
    {/* Navbar Ekleme */}
    <nav className="bg-green-700 p-4">
      <h1 className="text-white text-center text-xl font-bold">PERSONAL FINANCE MANAGEMENT SYSTEM</h1>
    </nav>
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  </div>
  )
}
export default Login;