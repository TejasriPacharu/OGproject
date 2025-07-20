import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Submissions from '../profile/submissions';
import axios from 'axios';
import { BACKEND_URI } from '../../config';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Updated skills with more Gen Z relevant tech stack
  const skills = [
    { name: 'C++', level: 100, color: '#FF6B6B' },
    { name: 'Python', level: 85, color: '#4ECDC4' },
    { name: 'JavaScript', level: 90, color: '#FFD93D' },
    { name: 'Java', level: 88, color: '#6C63FF' },
  ];

  const stats = {
    solved: 228,
    total: 2811,
    rank: {
      easy: '98/100',
      medium: '114/178',
      hard: '16/149'
    },
    streak: 15
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get(`${BACKEND_URI}/api/auth/me`, config);
        setProfile(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1A1A2E] dark:bg-[#1A1A2E] light:bg-[#F7F7F7] text-white dark:text-white light:text-slate-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 dark:border-purple-500 light:border-slate-300"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1A1A2E] dark:bg-[#1A1A2E] light:bg-[#F7F7F7] text-white dark:text-white light:text-slate-800">
        <p className="text-white dark:text-white light:text-slate-800 text-lg">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] dark:bg-[#1A1A2E] light:bg-[#F7F7F7] text-white dark:text-white light:text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#16213E] dark:bg-[#16213E] light:bg-slate-100 rounded-3xl shadow-neon p-6 md:p-8 border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50"
        >
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 bg-gradient-to-br from-[#4ECDC4] to-[#6C63FF] dark:from-[#4ECDC4] dark:to-[#6C63FF] light:from-slate-300 light:to-slate-500 rounded-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-3">
                  <span className="text-3xl text-white dark:text-white light:text-slate-800 font-bold">T</span>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="h-6 w-6 bg-[#50FA7B] dark:bg-[#50FA7B] light:bg-slate-300 rounded-full border-4 border-[#16213E] dark:border-[#16213E] light:border-slate-100"></div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] dark:from-[#4ECDC4] dark:to-[#6C63FF] light:from-slate-300 light:to-slate-500 text-transparent bg-clip-text">
                  teja
                </h1>
                <p className="text-gray-400 dark:text-gray-400 light:text-slate-600 mb-2">{profile.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 text-sm bg-[#6C63FF] bg-opacity-20 text-[#6C63FF] rounded-full font-medium border border-[#6C63FF] border-opacity-30">
                    Pro Coder ⚡
                  </span>
                  <span className="px-4 py-1.5 text-sm bg-[#FF6B6B] bg-opacity-20 text-[#FF6B6B] rounded-full font-medium border border-[#FF6B6B] border-opacity-30">
                    🔥 {stats.streak} Day Streak
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/edit')}
                className="px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] dark:from-[#4ECDC4] dark:to-[#6C63FF] light:from-slate-300 light:to-slate-500 text-white dark:text-white light:text-slate-800 rounded-xl text-sm font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                ✏️ Edit Profile
              </button>
              <button className="px-6 py-3 bg-[#ffffff0a] dark:bg-[#ffffff0a] light:bg-slate-100 text-white dark:text-white light:text-slate-800 rounded-xl text-sm font-medium border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50 hover:border-[#4ECDC4] dark:hover:border-[#4ECDC4] light:hover:border-slate-300 transition-all duration-300 transform hover:scale-105">
                🔗 Share Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats and Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#16213E] dark:bg-[#16213E] light:bg-slate-100 rounded-3xl shadow-neon p-6 md:p-8 border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50"
          >
            <h2 className="text-xl font-bold mb-8 bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] dark:from-[#4ECDC4] dark:to-[#6C63FF] light:from-slate-300 light:to-slate-500 text-transparent bg-clip-text">
              Problem Solving Stats
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ffffff0a"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#statsGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(stats.solved / stats.total) * 283} 283`}
                  />
                  <defs>
                    <linearGradient id="statsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ECDC4" />
                      <stop offset="100%" stopColor="#6C63FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-3xl font-bold text-white dark:text-white light:text-slate-800">{stats.solved}</div>
                  <div className="text-sm text-gray-400 dark:text-gray-400 light:text-slate-600">Problems Solved</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ffffff0a] dark:bg-[#ffffff0a] light:bg-slate-100 rounded-xl p-4 text-center border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50 hover:border-[#50FA7B] dark:hover:border-[#50FA7B] light:hover:border-slate-300 transition-all"
                >
                  <div className="text-[#50FA7B] dark:text-[#50FA7B] light:text-slate-800 text-sm font-medium">Easy</div>
                  <div className="text-white dark:text-white light:text-slate-800 font-bold text-lg">{stats.rank.easy}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ffffff0a] dark:bg-[#ffffff0a] light:bg-slate-100 rounded-xl p-4 text-center border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50 hover:border-[#FFD93D] dark:hover:border-[#FFD93D] light:hover:border-slate-300 transition-all"
                >
                  <div className="text-[#FFD93D] dark:text-[#FFD93D] light:text-slate-800 text-sm font-medium">Medium</div>
                  <div className="text-white dark:text-white light:text-slate-800 font-bold text-lg">{stats.rank.medium}</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#ffffff0a] dark:bg-[#ffffff0a] light:bg-slate-100 rounded-xl p-4 text-center border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50 hover:border-[#FF6B6B] dark:hover:border-[#FF6B6B] light:hover:border-slate-300 transition-all"
                >
                  <div className="text-[#FF6B6B] dark:text-[#FF6B6B] light:text-slate-800 text-sm font-medium">Hard</div>
                  <div className="text-white dark:text-white light:text-slate-800 font-bold text-lg">{stats.rank.hard}</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Skills Card with Vertical Bars */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#16213E] dark:bg-[#16213E] light:bg-slate-100 rounded-3xl shadow-neon p-6 md:p-8 border border-[#ffffff1a] dark:border-[#ffffff1a] light:border-slate-300/50"
          >
            <h2 className="text-xl font-bold mb-8 bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] dark:from-[#4ECDC4] dark:to-[#6C63FF] light:from-slate-300 light:to-slate-500 text-transparent bg-clip-text">
              Skills & Expertise
            </h2>
            <div className="flex justify-between items-end h-64 mt-8">
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="relative group w-12 rounded-t-lg"
                  style={{ backgroundColor: skill.color }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-white dark:text-white light:text-slate-800 whitespace-nowrap">
                    {skill.name}
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 dark:text-gray-400 light:text-slate-600"
                  >
                    {skill.level}%
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

          <Submissions/>
      </div>
    </div>
  );
};

export default Profile;