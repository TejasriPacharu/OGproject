import { Tooltip } from "@nextui-org/react";
import axios from "axios";
import monthDaysByYear from "month-days-by-year";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { BACKEND_URI } from "../../config";

const Submissions = ({ user, onActiveDaysChange }) => {
  const targetId = user?.id;
  const year = new Date().getFullYear();
  const days = monthDaysByYear(year);
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(year, i, 1).toLocaleDateString(undefined, { month: "short" })
  );
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!targetId) return;
    const getUserSubmissions = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URI}/api/submissions/user/${targetId}`);
        setSubmissions(data.submissions || []);
      } catch (error) {
        toast.error("Failed to fetch submissions 😢");
        console.error("Failed to load submissions:", error);
      }
    };
    getUserSubmissions();
  }, [targetId]);
   
  const submissionGroups = submissions.reduce((acc, s) => {
    const date = s.createdAt.split("T")[0];
    acc[date] = acc[date] ? [...acc[date], s] : [s];
    return acc;
  }, {});

  const activeDaysCount = Object.keys(submissionGroups).length;
  const streakEmoji = activeDaysCount > 30 ? "🔥" : activeDaysCount > 15 ? "💪" : "✨";
  
  // Pass activeDaysCount to parent component when it changes
  useEffect(() => {
    if (onActiveDaysChange) {
      onActiveDaysChange(activeDaysCount);
    }
  }, [activeDaysCount, onActiveDaysChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-slate-800/30 to-purple-900/30 rounded-3xl p-8 backdrop-blur-xl border border-slate-700/50 shadow-xl hover:shadow-purple-500/20 transition-all duration-500"
      style={{
        backgroundImage: "radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1), transparent)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-50" />
      
      <div className="relative flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Submission Activity {streakEmoji}
          </h2>
          <p className="text-slate-400 text-sm">Tracking your progress in {year}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-purple-500/10 rounded-xl px-4 py-2 border border-purple-500/20"
          >
            <span className="text-sm font-medium">
              Active days: <span className="text-purple-400 font-bold">{activeDaysCount}</span>
            </span>
          </motion.div>
          
          <div className="flex gap-2 items-center text-sm bg-slate-800/50 rounded-xl px-4 py-2">
            <span className="w-3 h-3 rounded-full bg-slate-600"></span>
            <span className="text-slate-400">Less</span>
            <span className="w-3 h-3 rounded-full bg-violet-600 glow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-fuchsia-500 glow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-pink-500 glow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-purple-400 glow-sm"></span>
            <span className="text-slate-400">More</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 overflow-x-auto custom-scrollbar pb-4">
        {days.map((dayCount, monthIndex) => {
          const startDate = new Date(year, monthIndex, 1);
          const startDayOfWeek = startDate.getDay();
          const gridColumns = [];
          let dayIdx = 0;

          for (let col = 0; col < 6; col++) {
            const columnCells = [];
            for (let row = 0; row < 7; row++) {
              if (col === 0 && row < startDayOfWeek) {
                columnCells.push(
                  <div key={`e-${row}`} className="w-3 h-3" />
                );
              } else if (dayIdx < dayCount) {
                const isoDate = new Date(year, monthIndex, dayIdx + 1)
                  .toISOString()
                  .split("T")[0];
                const dailySubs = submissionGroups[isoDate] || [];
                
                let cellColor = "bg-slate-700/30";
                if (dailySubs.length > 0) {
                  if (dailySubs.length <= 2) cellColor = "bg-violet-600";
                  else if (dailySubs.length <= 4) cellColor = "bg-fuchsia-500";
                  else if (dailySubs.length <= 6) cellColor = "bg-pink-500";
                  else cellColor = "bg-purple-400";
                }

                const formattedDate = new Date(isoDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const tooltipMsg = dailySubs.length
                  ? `${dailySubs.length} submission${dailySubs.length > 1 ? 's' : ''} on ${formattedDate}`
                  : `No submissions on ${formattedDate}`;

                columnCells.push(
                  <Tooltip 
                    key={row} 
                    content={tooltipMsg}
                    placement="top"
                    className="bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 px-3 py-2 rounded-lg"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: (monthIndex * 7 + row) * 0.001,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileHover={{ 
                        scale: 1.5,
                        transition: { duration: 0.2 }
                      }}
                      className={`w-3 h-3 rounded-full ${cellColor} hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300`}
                    />
                  </Tooltip>
                );
                dayIdx++;
              }
            }
            if (columnCells.length)
              gridColumns.push(
                <div key={`col-${col}`} className="flex flex-col gap-1">
                  {columnCells}
                </div>
              );
            if (dayIdx >= dayCount) break;
          }
          
          // Add a month label and return the gridColumns
          return (
            <div key={`month-${monthIndex}`} className="flex flex-col gap-1">
              <div className="text-xs text-slate-400 mb-1 text-center">{monthNames[monthIndex]}</div>
              <div className="flex flex-row gap-1">{gridColumns}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Submissions;