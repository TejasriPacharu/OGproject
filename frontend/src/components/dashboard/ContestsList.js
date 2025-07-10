import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';

// Helper to color difficulty text
const getDifficultyTextColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'hard':
      return 'text-red-400';
    default:
      return 'text-slate-300';
  }
};

// Sample contests (replace with props or API data)
const upcomingContests = [
  {
    id: 1,
    title: 'CodeSprint 2025',
    date: 'July 15, 2025',
    duration: '3 hrs',
    difficulty: 'Hard',
    participants: 1260,
  },
  {
    id: 2,
    title: 'Summer Challenge',
    date: 'July 20, 2025',
    duration: '2 hrs',
    difficulty: 'Medium',
    participants: 890,
  },
  {
    id: 3,
    title: 'Beginner Blitz',
    date: 'July 25, 2025',
    duration: '1.5 hrs',
    difficulty: 'Easy',
    participants: 430,
  },
];

const ContestsList = () => {
  return (
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
        {upcomingContests.map((contest) => (
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
  );
};

export default ContestsList;
