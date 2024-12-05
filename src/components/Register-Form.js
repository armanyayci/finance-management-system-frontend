import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!username || !firstname || !lastname || !password || !email) {
      setErrorMessage('Please fill in all the fields');
      setTimeout(() => setErrorMessage(''), 3000); // Remove error after 3 seconds
      return;
    }

    const payload = {
      username,
      firstname,
      lastname,
      password,
      email,
    };

    try {
      await axios.post('http://localhost:8080/finance-mgmt/api/api/authenticate/signup', payload);
      navigate('/');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Error message */}
        {errorMessage && (
          <div className="text-red-600 bg-red-200 p-2 rounded-md mb-2 w-[70vh] text-center shadow-md">
            {errorMessage}
          </div>
        )}
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          First Name
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Last Name
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold">
          E-Mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 border border-gray-500 shadow-sm bg-gray-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <button className="bg-red-600 rounded shadow-sm text-black text-lg p-3 mt-4 rounded-[250px]">
          Register
        </button>
        <div className="text-center mb-4 mt-4 font-semibold">
          Have you already an account?{' '}
          <Link to="/">
            <button className="bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]">
              Login
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
