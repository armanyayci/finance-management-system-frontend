import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      setTimeout(() => setErrorMessage(''), 3000); // Error message disappears after 3 seconds
      return;
    }

    const payload = { username, password };

    try {
      const res = await axios.post('http://localhost:8080/finance-mgmt/api/api/authenticate/login', payload);
      if (res?.data?.success) {
        const token = res?.data?.data.token;
        localStorage.setItem('token', token);

         // Decode the token and log it
      const decodedData = jwtDecode(token);
      console.log("Decoded Token Data:", decodedData);
        navigate('/home');
      } else {
        setErrorMessage("Invalid username or password");
        setTimeout(() => setErrorMessage(''), 3000); // Error message disappears after 3 seconds
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
      setTimeout(() => setErrorMessage(''), 3000); // Error message disappears after 3 seconds
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
            className="p-4 border border-gray-500 shadow-sm bg-white-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-lg font-semibold mt-4">
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="p-4 border border-gray-500 shadow-sm bg-white-200 w-[70vh] rounded-[250px]"
          />
        </label>
        <button className="bg-red-600 rounded-[250px] shadow-sm text-black text-lg p-4 mt-[50px] text-lg font-semibold">
          Login
        </button>
        <div className="text-center mb-4 mt-4 font-semibold">
          Don't you have an account? 
          <Link to="/register">
            <button className="bg-blue-800 rounded shadow-sm text-black text-sm p-4 mt-4 text-lg font-semibold ml-4 w-[200px] rounded-[250px]">Register</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

