import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaCode, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
        // Fetch problems
        const problemsRes = await axios.get('/api/problems');
        console.log('problemsRes.data =', problemsRes.data); //DEBUG LINE

        const problemsToBeSolved = problemsRes.data.problems.filter(
          problem => !(problem.solvedBy || []).includes(String(user.id))
        );
        
        console.log('problemsToBeSolved =', problemsToBeSolved); //DEBUG LINE
        
        const solvedProblems = problemsRes.data.problems.filter(
          problem => (problem.solvedBy || []).includes(String(user.id))
        );
        
        console.log('solvedProblems =', solvedProblems); //DEBUG LINE
        
        // Handle different response formats - ensure we always have an array
        if (Array.isArray(problemsToBeSolved)) {
          setProblems(problemsToBeSolved);
        } else if (problemsToBeSolved && Array.isArray(problemsToBeSolved.problems)) {
          setProblems(problemsToBeSolved.problems);
        } else {
          console.error('Unexpected API response format:', problemsRes.data);
          setProblems([]);
        }
        
        if (Array.isArray(solvedProblems)) {
          setSolved(solvedProblems);
          setUserStats(prev => ({
            ...prev,
            problemsSolved: solvedProblems.length
          }));
        } else if (solvedProblems && Array.isArray(solvedProblems.problems)) {
          setSolved(solvedProblems.problems);
          setUserStats(prev => ({
            ...prev,
            problemsSolved: solvedProblems.length
          }));
        } else {
          console.error('Unexpected API response format:', problemsRes.data);
          setSolved([]);
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
    { id: 201, title: 'Weekly Contest 306', date: '2023-07-22 08:00 AM', duration: '90 minutes' },
    { id: 202, title: 'Biweekly Contest 82', date: '2023-07-29 08:00 AM', duration: '90 minutes' }
  ];

  function getDifficultyColor(difficulty) {
    if (!difficulty) return "text-gray-400"; // fallback color
  
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <div className="container mx-auto px-4">
        {/* User Info Card */}
        <div className="bg-gradient-to-l from-green-300 via-blue-500 to-purple-600 rounded-lg shadow-md text-white p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-lg font-bold opacity-90">Solved</p>
                <p className="text-6xl font-bold">{userStats.problemsSolved}</p>
              </div>
              <div>
                <p className="text-lg font-bold opacity-90">Contest Rating</p>
                <p className="text-6xl font-bold">{userStats.contestRating}</p>
              </div>
              <div>
                <p className="text-lg font-bold opacity-90">Global Rank</p>
                <p className="text-6xl font-bold">{userStats.globalRank}</p>
              </div>
              <div>
                <p className="text-lg font-bold opacity-90">Streak</p>
                <p className="text-6xl font-bold">{userStats.streak}</p>
                <p className="font-press text-sm">days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-primary-500 mr-2" />
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {solved.map(solved => (
                <div key={solved._id} className="w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-md bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/problems/${solved._id}`} className="font-medium hover:text-primary-600">
                        {solved.title}
                      </Link>
                      <p className={`text-left text-sm ${getDifficultyColor(solved.difficulty)}`}>{solved.difficulty}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {solved.tags.slice(0, 2).map((tag, index) => (
                        <span
                        key={index}
                        title={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-3 rounded text-xs font-medium hover:bg-gray-200 transition"
                      >
                        {tag}
                      </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {solved.length === 0 && (
                <p className="text-gray-500">No activity recently</p>
              )}
            </div>
            
          </div>

          {/* Available Problems */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaCode className="text-primary-500 mr-2" />
                <h2 className="text-lg font-bold">Available Problems</h2>
              </div>
              <Link to="/problems" className="text-primary-600 hover:text-primary-800 text-sm font-medium">View All</Link>
            </div>
            <div className="space-y-3">
              {problems.map(problem => (
                <div key={problem._id} className="w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-md bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/problems/${problem._id}`} className="font-medium hover:text-primary-600">
                        {problem.title}
                      </Link>
                      <p className={`text-left text-sm ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 2).map((tag, index) => (
                        <span
                        key={index}
                        title={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-3 rounded text-xs font-medium hover:bg-gray-200 transition"
                      >
                        {tag}
                      </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {problems.length === 0 && (
                <p className="text-gray-500">No problems available</p>
              )}
            </div>
          </div>

          {/* Upcoming Contests */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-primary-500 mr-2" />
              <h2 className="text-lg font-bold">Upcoming Contests</h2>
            </div>
            <div className="space-y-3">
              {upcomingContests.map(contest => (
                <div key={contest.id} className="border-b pb-2 last:border-0">
                  <p className="font-medium">{contest.title}</p>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">{contest.date}</p>
                    <p className="text-sm text-gray-600">{contest.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
