import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MainNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const authLinks = (
    <div className="flex items-center space-x-4">
      {user && (
        <span className="hidden md:inline text-white">
          Welcome, {user.name}
        </span>
      )}
      <Link to="/dashboard" className="text-white hover:text-gray-200">
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="bg-transparent border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-primary-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link to="/login" className="text-white hover:text-gray-200">
        Login
      </Link>
      <Link to="/register">
        <button className="bg-white text-primary-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
          Register
        </button>
      </Link>
    </div>
  );

  return (
    <nav className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl">
            OJ Platform
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 pl-10">
            <div className="flex space-x-4">
              <Link to="/" className="text-white hover:text-gray-200">Home</Link>
              <Link to="/problems" className="text-white hover:text-gray-200">Problems</Link>
              <Link to="/contests" className="text-white hover:text-gray-200">Contests</Link>
              <Link to="/leaderboard" className="text-white hover:text-gray-200">Leaderboard</Link>
            </div>
            
            <div className="flex items-center">
              {isAuthenticated ? authLinks : guestLinks}
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-blue-800">
            <div className="flex flex-col space-y-3 pb-3">
              <Link 
                to="/" 
                className="text-white hover:text-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/problems" 
                className="text-white hover:text-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Problems
              </Link>
              <Link 
                to="/contests" 
                className="text-white hover:text-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contests
              </Link>
              <Link 
                to="/leaderboard" 
                className="text-white hover:text-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </div>
            
            <div className="pt-3 border-t border-blue-800">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  {user && (
                    <span className="text-white">
                      Welcome, {user.name}
                    </span>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-transparent border border-white text-white px-3 py-1 rounded hover:bg-white hover:text-primary-600 transition-colors w-min"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="bg-white text-primary-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
