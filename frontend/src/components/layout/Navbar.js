import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// Imports
import { RiCodeLine, RiTrophyLine, RiGamepadLine, RiBarChart2Line } from 'react-icons/ri';



const MainNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link 
      to={to} 
      className="group relative flex items-center gap-2 font-medium text-white/90 hover:text-white transition-colors"
    >
      {Icon && <Icon className="text-xl text-purple-400 group-hover:text-purple-300" />}
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );

  const authLinks = (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-4"
    >
      {user && (
        <Link to="/profile">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur group-hover:blur-md transition-all duration-300" />
            <div className="relative bg-slate-900 rounded-full p-3 border border-purple-500/30">
              <FaUser className="text-purple-400 text-xl" />
            </div>
          </motion.div>
        </Link>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="relative group px-4 py-2 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative text-white font-medium">Logout</span>
      </motion.button>
    </motion.div>
  );

  const guestLinks = (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="font-code font-bold flex items-center space-x-4"
    >
      <Link to="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white hover:text-purple-300 transition-colors"
        >
          Login
        </motion.button>
      </Link>
      <Link to="/register">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-4 py-2 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-100 group-hover:opacity-80 transition-opacity duration-300" />
          <span className="relative text-white font-medium">Register</span>
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <nav className="relative backdrop-blur-xl bg-slate-900/80 text-white shadow-lg z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex justify-between items-center">
          <Link to="/" className="group">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="font-press text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              OGCode
            </motion.h1>
          </Link>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-50 p-2"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white transform origin-left transition-transform"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-white"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white transform origin-left transition-transform"
              />
            </div>
          </motion.button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 pl-10">
            <div className="flex space-x-8">
              <NavLink to={isAuthenticated ? "/dashboard" : "/"} icon={RiCodeLine}>
                {isAuthenticated ? "Dashboard" : "Home"}
              </NavLink>
              <NavLink to="/problems" icon={RiGamepadLine}>Problems</NavLink>
              <NavLink to="/contests" icon={RiTrophyLine}>Contests</NavLink>
              <NavLink to="/leaderboard" icon={RiBarChart2Line}>Leaderboard</NavLink>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? authLinks : guestLinks}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  <NavLink to={isAuthenticated ? "/dashboard" : "/"} icon={RiCodeLine}>
                    {isAuthenticated ? "Dashboard" : "Home"}
                  </NavLink>
                  <NavLink to="/problems" icon={RiGamepadLine}>Problems</NavLink>
                  <NavLink to="/contests" icon={RiTrophyLine}>Contests</NavLink>
                  <NavLink to="/leaderboard" icon={RiBarChart2Line}>Leaderboard</NavLink>
                </div>
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-4">
                      {user && (
                        <span className="text-purple-400 font-medium">
                          Welcome, {user.name} ✨
                        </span>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Link 
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-white hover:text-purple-300 transition-colors"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity">
                          Register
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default MainNavbar;