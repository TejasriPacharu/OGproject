import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaCode, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Sample data - in a real app, this would come from API calls
  const recentActivity = [
    { id: 1, type: 'submission', problem: 'Two Sum', result: 'Accepted', date: '2023-07-15' },
    { id: 2, type: 'contest', name: 'Weekly Contest 305', rank: '156', date: '2023-07-10' },
    { id: 3, type: 'submission', problem: 'Valid Parentheses', result: 'Wrong Answer', date: '2023-07-08' }
  ];

  const recommendedProblems = [
    { id: 101, title: 'Merge Two Sorted Lists', difficulty: 'Easy', tags: ['Linked List', 'Recursion'] },
    { id: 102, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Dynamic Programming'] },
    { id: 103, title: 'Unique Paths', difficulty: 'Medium', tags: ['Math', 'Dynamic Programming', 'Combinatorics'] }
  ];

  const upcomingContests = [
    { id: 201, title: 'Weekly Contest 306', date: '2023-07-22 08:00 AM', duration: '90 minutes' },
    { id: 202, title: 'Biweekly Contest 82', date: '2023-07-29 08:00 AM', duration: '90 minutes' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <div className="container mx-auto px-4">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-md text-white p-6 mb-6">
          <div className="md:flex justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3 mr-4">
                  <FaUser className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="opacity-90">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <p className="text-sm opacity-75">Problems Solved</p>
                <p className="text-xl font-bold">23</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Contest Rating</p>
                <p className="text-xl font-bold">1243</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Global Rank</p>
                <p className="text-xl font-bold">9,654</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Streak</p>
                <p className="text-xl font-bold">5 days</p>
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
              {recentActivity.map(activity => (
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
                          <p className="text-sm text-gray-600">Rank: {activity.rank}</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Problems */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-4">
              <FaCode className="text-primary-500 mr-2" />
              <h2 className="text-lg font-bold">Recommended Problems</h2>
            </div>
            <div className="space-y-3">
              {recommendedProblems.map(problem => (
                <div key={problem.id} className="border-b pb-2 last:border-0">
                  <p className="font-medium mb-1">{problem.title}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Contests */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-primary-500 mr-2" />
              <h2 className="text-lg font-bold">Upcoming Contests</h2>
            </div>
            <div className="space-y-4">
              {upcomingContests.map(contest => (
                <div key={contest.id} className="border-b pb-3 last:border-0">
                  <p className="font-medium">{contest.title}</p>
                  <p className="text-sm text-gray-700">
                    <span className="block mb-1">{contest.date}</span>
                    <span className="text-gray-500">{contest.duration}</span>
                  </p>
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
