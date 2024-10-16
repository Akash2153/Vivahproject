// src/components/AuthForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(''); // Success or error messages
  const [isError, setIsError] = useState(false); // Flag to indicate error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Simple form validation
  const validateForm = () => {
    const { email, password, username } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin && !username.trim()) {
      setMessage('Please enter a username.');
      setIsError(true);
      return false;
    }
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email.');
      setIsError(true);
      return false;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsError(true);
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegisterAndLogin();
    }
  };

  // Handle Registration and Immediate Login
  const handleRegisterAndLogin = async () => {
    const { username, email, password } = formData;

    try {
      // Attempt to register the user
      await axios.post('http://localhost:8081/register', { username, email, password });

      // If registration is successful, attempt to log in
      const loginResponse = await axios.post('http://localhost:8081/login', { email, password });

      setMessage(`Registration and login successful. Welcome, ${loginResponse.data.user.username}!`);
      setIsError(false);

      // Reset form
      resetForm();
    } catch (error) {
      if (error.response?.status === 409) {
        // User already exists, attempt to log in
        await tryLoginAfterRegister();
      } else {
        setMessage(error.response?.data?.error || 'Registration failed. Please try again.');
        setIsError(true);
      }
    }
  };

  const tryLoginAfterRegister = async () => {
    const { email, password } = formData;
    try {
      const loginResponse = await axios.post('http://localhost:8081/login', { email, password });
      setMessage(`Login successful. Welcome back, ${loginResponse.data.user.username}!`);
      setIsError(false);
      resetForm();
    } catch (loginError) {
      setMessage(loginError.response?.data?.error || 'Login failed after registration attempt.');
      setIsError(true);
    }
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    try {
      const response = await axios.post('http://localhost:8081/login', { email, password });
      setMessage(`Login successful. Welcome, ${response.data.user.username}!`);
      setIsError(false);
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
      setIsError(true);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
    });
    setMessage('');
    setIsError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {/* Display Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username - Only show in Register mode */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-indigo-700 transition duration-300"
              type="submit"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

    
        <div className="mt-6 text-center">
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm(); 
            }}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
