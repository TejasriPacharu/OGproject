import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';
import { FaRegCircle } from 'react-icons/fa';


const ProblemsList = () => {
  const {user } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // added filter state
  const [solved, setSolved] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('/api/problems');
        // Handle different response formats - ensure we always have an array

        const solvedProblems = response.data.problems.filter(
          problem => (problem.solvedBy || []).includes(String(user.id))
        );

        if (Array.isArray(solvedProblems)) {
          setSolved(solvedProblems);
        } else if (solvedProblems && Array.isArray(solvedProblems.problems)) {
          setSolved(solvedProblems.problems);
        } else {
          console.error('Unexpected API response format:', response.data);
          setSolved([]);
        }

        if (Array.isArray(response.data)) {
          setProblems(response.data);
        } else if (response.data && Array.isArray(response.data.problems)) {
          // If response.data has a problems array property
          setProblems(response.data.problems);
        } else {
          console.error('Unexpected API response format:', response.data);
          setProblems([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error.message || 'Failed to fetch problems');
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Make sure problems is always an array before filtering
  const problemsArray = Array.isArray(problems) ? problems : [];
  const filteredProblems = problemsArray.filter(problem => {
    if (filter === 'all') return true;
    return problem.difficulty?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-700">Loading problems...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 text-lg mb-2">Error</p>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Coding Problems</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            All
          </button>
          <button 
            onClick={() => setFilter('easy')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            Easy
          </button>
          <button 
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            Medium
          </button>
          <button 
            onClick={() => setFilter('hard')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            Hard
          </button>
        </div>
      </div>
      
      {filteredProblems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <p className="text-gray-500 text-lg">No problems found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="items-center justify-center py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="items-center justify-center py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="items-center justify-center py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="items-center justify-center py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="items-center justify-center py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solved By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredProblems) && filteredProblems.map((problem, index) => (
                <tr key={problem.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-4 px-6 text-sm font-medium text-left">
                    {solved.some(p => p._id === problem._id) ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaRegCircle className="text-gray-500 text-lg" />
                    )}
                  </td>
                  <td className="text-left py-4 px-6">
                    <Link to={`/problems/${problem._id}`} className="text-blue-600 hover:text-blue-800 text-base font-medium hover:underline">
                      {problem.title}
                      </Link>
                  </td>
                  <td className="text-left py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(problem.tags) && problem.tags.map((tag, index) => (
                        <span
                          key={index}
                          title={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-left py-4 px-6">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {problem.solvedBy ? problem.solvedBy.length : 0} users
                    </div>
              </td>
            </tr>
          ))}
        </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default ProblemsList;
