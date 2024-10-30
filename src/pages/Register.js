import React from 'react';
import AuthLayout from '../components/Auth/Auth-Layout';
import Registerform from '../components/Register-Form';

export const Register = () => {
  return (
    <div>
    {/* Navbar Ekleme */}
    <nav className="bg-green-700 p-4 h-[40px]">
      <h1 className="text-white text-center text-xl font-bold">PERSONAL FINANCE MANAGEMENT SYSTEM</h1>
    </nav>
    <AuthLayout>
      <Registerform />
    </AuthLayout>
  </div>
  )
}
export default Register;