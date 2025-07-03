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

        // Handle different response formats - ensure we always have an array
        if (Array.isArray(problemsRes.data)) {
          setProblems(problemsRes.data);
        } else if (problemsRes.data && Array.isArray(problemsRes.data.problems)) {
          setProblems(problemsRes.data.problems);
        } else {
          console.error('Unexpected API response format:', problemsRes.data);
          setProblems([]);
        }
        
        setLoading(false);
        // Rest of your fetching code...
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [user]);

  // Sample data - in a real app, this would come from API calls
  const recentActivity = [
    { id: 1, type: 'submission', problem: 'Two Sum', result: 'Accepted', date: '2023-07-15' },
    { id: 2, type: 'contest', name: 'Weekly Contest 305', rank: '156', date: '2023-07-10' },
    { id: 3, type: 'submission', problem: 'Valid Parentheses', result: 'Wrong Answer', date: '2023-07-08' }
  ];

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
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        {activity.type === 'submission' ? (
                          <>
                            <p className="font-medium">{activity.problem}</p>
                            <p className={`text-sm ${activity.result === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                              {activity.result}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">{activity.name}</p>
                            <p className="text-sm">Rank: {activity.rank}</p>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent activity</p>
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
              {problems.slice(0, 2).map(problem => (
                <div key={problem.id} className="w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-md bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/problems/${problem.id}`} className="font-medium hover:text-primary-600">
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
