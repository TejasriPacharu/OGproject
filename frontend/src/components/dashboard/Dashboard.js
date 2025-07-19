import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaCode, FaCalendarAlt, FaChartLine, FaFire, FaTrophy, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BACKEND_URI } from '../../config';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);         
  const [loading, setLoading] = useState(true);    
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    contestRating: 0,
    globalRank: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const problemsRes = await axios.get(`${BACKEND_URI}/api/problems`);
        const problemsToBeSolved = problemsRes.data.problems.filter(
          problem => !(problem.solvedBy || []).includes(String(user.id))
        );
        
        const solvedProblems = problemsRes.data.problems.filter(
          problem => (problem.solvedBy || []).includes(String(user.id))
        );
        
        if (Array.isArray(problemsToBeSolved)) {
          setProblems(problemsToBeSolved.slice(0, 4)); // Show only 4 problems
        } else if (problemsToBeSolved && Array.isArray(problemsToBeSolved.problems)) {
          setProblems(problemsToBeSolved.problems.slice(0, 4));
        }
        
        if (Array.isArray(solvedProblems)) {
          setSolved(solvedProblems.slice(0, 4));
          setUserStats(prev => ({
            ...prev,
            problemsSolved: solvedProblems.length
          }));
        } else if (solvedProblems && Array.isArray(solvedProblems.problems)) {
          setSolved(solvedProblems.problems.slice(0, 4));
          setUserStats(prev => ({
            ...prev,
            problemsSolved: solvedProblems.length
          }));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [user]);

  const upcomingContests = [
    { 
      id: 201, 
      title: 'Weekly Contest 306', 
      date: '2023-07-22 08:00 AM', 
      duration: '90 minutes',
      participants: 1200,
      difficulty: 'Medium' 
    },
    { 
      id: 202, 
      title: 'Biweekly Contest 82', 
      date: '2023-07-29 08:00 AM', 
      duration: '90 minutes',
      participants: 800,
      difficulty: 'Hard' 
    }
  ];

  function getDifficultyColor(difficulty) {
    const colors = {
      easy: "from-green-400 to-green-500",
      medium: "from-yellow-400 to-yellow-500",
      hard: "from-red-400 to-red-500"
    };
    return colors[difficulty?.toLowerCase()] || "from-gray-400 to-gray-500";
  }

  function getDifficultyTextColor(difficulty) {
    const colors = {
      easy: "text-green-500",
      medium: "text-yellow-500",
      hard: "text-red-500"
    };
    return colors[difficulty?.toLowerCase()] || "text-gray-500";
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0F172A]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 backdrop-blur-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Problems Solved</p>
                <h3 className="text-3xl font-bold mt-1">{userStats.problemsSolved}</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <FaCode className="text-2xl text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 backdrop-blur-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Contest Rating</p>
                <h3 className="text-3xl font-bold mt-1">{userStats.contestRating}</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FaTrophy className="text-2xl text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 backdrop-blur-xl border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Global Rank</p>
                <h3 className="text-3xl font-bold mt-1">#{userStats.globalRank}</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <FaRocket className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 backdrop-blur-xl border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Current Streak</p>
                <h3 className="text-3xl font-bold mt-1">{userStats.streak} days</h3>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-xl">
                <FaFire className="text-2xl text-orange-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 backdrop-blur-xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaChartLine className="text-purple-400" />
                Recent Activity
              </h2>
              <Link to="/problems" className="text-purple-400 hover:text-purple-300 text-sm">
                View All →
              </Link>
            </div>
            <div className="grid gap-4">
              {solved.map(solved => (
                <motion.div
                  key={solved._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Link 
                        to={`/problems/${solved._id}`} 
                        className="font-medium text-lg hover:text-purple-400 transition-colors"
                      >
                        {solved.title}
                      </Link>
                      <p className={`text-sm text-left ${getDifficultyTextColor(solved.difficulty)}`}>
                        {solved.difficulty}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {solved.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 px-2 py-1 rounded-md text-xs font-medium border border-purple-500/20 backdrop-blur-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Contests */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" />
                Upcoming Contests
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingContests.map(contest => (
                <motion.div
                  key={contest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300"
                >
                  <h3 className="font-medium text-lg mb-2">{contest.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-slate-400">Date</p>
                      <p className="font-medium">{contest.date}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-slate-400">Duration</p>
                      <p className="font-medium">{contest.duration}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-slate-400">Difficulty</p>
                      <p className={`font-medium ${getDifficultyTextColor(contest.difficulty)}`}>
                        {contest.difficulty}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <p className="text-slate-400">Participants</p>
                      <p className="font-medium">{contest.participants}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;