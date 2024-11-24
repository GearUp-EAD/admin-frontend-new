import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // Hardcoded credentials
  const ADMIN_EMAIL = 'admin@elitegear.com';
  const ADMIN_PASSWORD = 'admin123';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      // Set auth status in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/Dashboard'); // Redirect to dashboard
    } else {
      setError('Invalid email or password');
    }
  };

  const handleChange = (e) => {
    setError(''); // Clear error when user types
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
          alt="Sports Store"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">EliteGear</h1>
            <p className="text-gray-600">
              Admin Dashboard - Manage your sports store
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513] focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513] focus:ring-opacity-50"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-[#8B4513] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Use these credentials to login:
              <br />
              Email: admin@elitegear.com
              <br />
              Password: admin123
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;