import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';
import { FaRegCircle } from 'react-icons/fa';
import { FaBolt } from 'react-icons/fa';
import { FaFire } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa';


const ProblemsList = () => {
  const { user } = useContext(AuthContext);
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
        return 'px-4 py-1.5 text-sm bg-[#32CD32] bg-opacity-20 text-[#32CD32] rounded-full font-medium border border-[#32CD32] border-opacity-30';
      case 'Medium':
        return 'px-4 py-1.5 text-sm bg-[#FFD93D] bg-opacity-20 text-[#FFD93D] rounded-full font-medium border border-[#FFD93D] border-opacity-30';
      case 'Hard':
        return 'px-4 py-1.5 text-sm bg-[#FF6B6B] bg-opacity-20 text-[#FF6B6B] rounded-full font-medium border border-[#FF6B6B] border-opacity-30';
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
    <div className="min-h-[300px] flex flex-col justify-center items-center bg-gradient-to-br from-[#16213E] via-slate-900 to-[#6C63FF] rounded-3xl shadow-neon p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-lg text-slate-200 font-semibold">Loading problems...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[300px] flex flex-col justify-center items-center bg-gradient-to-br from-[#16213E] via-slate-900 to-[#6C63FF] rounded-3xl shadow-neon p-10">
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl flex items-center mb-4 shadow-neon animate-pulse">
        <span className="mr-2">🚨</span>
        <span>{error}</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-neon">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4ECDC4] to-[#6C63FF] text-transparent bg-clip-text animate-gradient-move">Coding Problems</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-neon border border-purple-500/30 backdrop-blur-xl ${filter === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105' : 'bg-slate-800/50 text-slate-300 hover:bg-purple-500/20 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('easy')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-neon border border-green-500/30 backdrop-blur-xl ${filter === 'easy' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white scale-105' : 'bg-slate-800/50 text-green-300 hover:bg-green-500/20 hover:text-white'}`}
            >
              Easy
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-neon border border-yellow-400/30 backdrop-blur-xl ${filter === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white scale-105' : 'bg-slate-800/50 text-yellow-200 hover:bg-yellow-500/20 hover:text-white'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilter('hard')}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-neon border border-red-500/30 backdrop-blur-xl ${filter === 'hard' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white scale-105' : 'bg-slate-800/50 text-red-300 hover:bg-red-500/20 hover:text-white'}`}
            >
              Hard
            </button>
          </div>
        </div>
        {filteredProblems.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl shadow-neon p-10 text-center border border-purple-500/30 backdrop-blur-xl">
            <p className="text-slate-400 text-lg">No problems found</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-3xl shadow-neon overflow-hidden border border-purple-500/30 backdrop-blur-xl">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</th>
                  <th className="py-3 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Solved By</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredProblems) && filteredProblems.map((problem, index) => (
                  <tr key={problem.id} className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-200">
                    <td className="py-4 px-6 text-left">
                      {solved.some(p => p._id === problem._id) ? (
                        <FaCheckCircle className="text-green-400 text-lg drop-shadow-neon" />
                      ) : (
                        <FaRegCircle className="text-slate-500 text-lg" />
                      )}
                    </td>
                    <td className="text-left py-4 px-6">
                      <Link to={`/problems/${problem._id}`} className="font-medium text-lg hover:text-purple-400 transition-colors">
                        {problem.title}
                      </Link>
                    </td>
                    <td className="text-left py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-neon ${
                        problem.difficulty === 'Easy'  ? getDifficultyColor('Easy') :
                        problem.difficulty === 'Medium'  ? getDifficultyColor('Medium') :
                        problem.difficulty === 'Hard'  ? getDifficultyColor('Hard') :
                        'bg-slate-700 text-slate-200'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(problem.tags) && problem.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            title={tag}
                            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-300 px-2 py-1 rounded-md text-xs font-medium border border-purple-500/20 backdrop-blur-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-left py-4 px-6">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 border border-blue-500/20 backdrop-blur-md">
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
    </div>
  );
};

export default ProblemsList;
