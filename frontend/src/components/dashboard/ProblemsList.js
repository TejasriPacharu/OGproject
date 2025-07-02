import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('/api/problems');
        setProblems(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-600';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading problems...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Problems</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Difficulty</th>
              <th className="py-3 px-4 text-left">Tags</th>
              <th className="py-3 px-4 text-left">Solved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map(problem => (
              <tr key={problem._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-3 px-4">
                  <Link to={`/problems/${problem._id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    {problem.title}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {problem.solvedBy ? problem.solvedBy.length : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsList;
