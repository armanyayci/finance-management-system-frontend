import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from './service/ApiService';
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import logo from './Auth/logo.svg';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    email: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.registerUser(formData);
      if (response.success) {
        setMessage("User successfully registered");
        setTimeout(() => {
          navigate('/')
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || error.message || "Unable to register a user");
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <div className="flex w-full max-w-5xl min-h-[600px] rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-700 p-10">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-6 drop-shadow-xl" />
          <div className="text-white text-3xl font-extrabold mb-2 drop-shadow-xl text-center">Welcome!</div>
          <p className="text-white/80 text-lg max-w-xs text-center">Join us and manage your finances with style and security.</p>
        </div>
        {/* Center Form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-white/95 px-12 py-10">
          {message && (
            <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-3 shadow-md z-50">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
            <div className="mb-2">
              <h2 className="text-4xl font-bold text-center text-indigo-700 mb-1 tracking-tight">Create Account</h2>
              <p className="text-center text-gray-500 text-lg">Start your financial journey with us!</p>
            </div>
            {errorMessage && (
              <div className="text-red-600 bg-red-100 p-2 rounded-md text-center shadow mb-2 animate-pulse">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-400" /> Username
              </label>
              <input
                value={formData.username}
                onChange={handleChange}
                required
                type="text"
                name='username'
                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-indigo-400" /> E-Mail
              </label>
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-indigo-400" /> First Name
              </label>
              <input
                type="text"
                name='firstname'
                value={formData.firstname}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-indigo-400" /> Last Name
              </label>
              <input
                type="text"
                name='lastname'
                value={formData.lastname}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                autoComplete="family-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold flex items-center gap-2">
                <LockClosedIcon className="w-5 h-5 text-indigo-400" /> Password
              </label>
              <input
                type="password"
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                autoComplete="new-password"
              />
            </div>
            <button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-colors rounded-xl shadow text-white text-lg p-3 mt-2 font-bold w-full">
              Register
            </button>
            <div className="text-center mt-2 font-semibold text-gray-700">
              Have you already an account?{' '}
              <button type="button" className="bg-blue-700 hover:bg-blue-800 transition-colors rounded-xl shadow text-white text-base p-3 mt-2 font-semibold ml-3 w-40" onClick={() => window.location.href = '/'}>
                Login
              </button>
            </div>
          </form>
        </div>
        {/* Right Panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-gradient-to-tl from-indigo-500 via-blue-500 to-indigo-700 p-10">
          <div className="flex flex-col items-center">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80" className="mb-6">
              <circle cx="40" cy="40" r="38" stroke="#fff" strokeWidth="4" fill="#6366f1" />
              <path d="M25 40h30M40 25v30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="text-white text-3xl font-extrabold mb-2 drop-shadow-xl text-center">FinanceApp</div>
            <p className="text-white/80 text-lg max-w-xs text-center">Secure. Fast. Beautiful. Your money, your rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;




// Form validation
    // if (!username || !firstname || !lastname || !password || !email) {
    //   setErrorMessage('Please fill in all the fields');
    //   setTimeout(() => setErrorMessage(''), 3000); // Remove error after 3 seconds
    //   return;
    // }

    // const payload = {
    //   username,
    //   firstname,
    //   lastname,
    //   password,
    //   email,
    // };

    // try {
    //   await axios.post('http://localhost:8080/finance-mgmt/api/api/authenticate/signup', payload);
    //   navigate('/');
    // } catch (error) {
    //   setErrorMessage('Registration failed. Please try again.');
    //   setTimeout(() => setErrorMessage(''), 3000);
    // }