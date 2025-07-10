import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearErrors, isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, password, password2 } = formData;

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Clear any previous errors when component mounts
    clearErrors();
  }, [isAuthenticated, navigate, clearErrors]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear specific field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== password2) {
      errors.password2 = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      await register(name, email, password);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16213E] via-slate-900 to-[#6C63FF] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-slate-800/50 p-8 sm:p-12 rounded-3xl shadow-neon border border-purple-500/30 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] text-transparent bg-clip-text animate-gradient-move">
            Create Account
          </h2>
          <p className="text-slate-300 text-base">
            Create your account to join our platform
          </p>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl flex items-center mb-4 shadow-neon animate-pulse">
            <FaExclamationTriangle className="mr-2 text-red-400 animate-bounce" />
            <span>{error}</span>
          </div>
        )}
        <form className="space-y-7" onSubmit={onSubmit} autoComplete="off">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-purple-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={onChange}
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${formErrors.name ? 'border-red-500' : 'border-purple-500/30'} rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-slate-400 transition-all duration-200`}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-400 animate-pulse">{formErrors.name}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${formErrors.email ? 'border-red-500' : 'border-blue-500/30'} rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-slate-400 transition-all duration-200`}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-400 animate-pulse">{formErrors.email}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-pink-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${formErrors.password ? 'border-red-500' : 'border-pink-500/30'} rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder:text-slate-400 transition-all duration-200`}
                placeholder="Enter a strong password"
                autoComplete="new-password"
              />
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-400 animate-pulse">{formErrors.password}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-green-400" />
              </div>
              <input
                id="password2"
                name="password2"
                type="password"
                value={password2}
                onChange={onChange}
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${formErrors.password2 ? 'border-red-500' : 'border-green-500/30'} rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder:text-slate-400 transition-all duration-200`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>
            {formErrors.password2 && (
              <p className="mt-1 text-xs text-red-400 animate-pulse">{formErrors.password2}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Creating Account...
                </span>
              ) : (
                <span>Register ✨</span>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text underline underline-offset-4 hover:from-pink-400 hover:to-purple-400 transition-all duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
