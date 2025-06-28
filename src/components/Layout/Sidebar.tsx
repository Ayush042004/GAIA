import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Upload, 
  Calendar, 
  Users, 
  BarChart3, 
  BookOpen,
  Palette,
  Brain,
  Trophy,
  Medal,
  Crown,
  Star
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Materials', icon: Upload },
  { id: 'sessions', label: 'Study Sessions', icon: Calendar },
  { id: 'quiz', label: 'AI Quiz', icon: Brain },
  { id: 'whiteboard', label: 'Whiteboard', icon: Palette },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  // Mock leaderboard data - in a real app this would come from the backend
  const topStudents = [
    { 
      id: '1', 
      name: 'Sarah Kim', 
      studyHours: 42.5, 
      rank: 1, 
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      streak: 15,
      points: 2850
    },
    { 
      id: '2', 
      name: 'Alex Chen', 
      studyHours: 38.2, 
      rank: 2, 
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      streak: 12,
      points: 2640
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      studyHours: 35.8, 
      rank: 3, 
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      streak: 8,
      points: 2420
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-purple-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800/50';
      case 2:
        return 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800/50';
      case 3:
        return 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/50';
      default:
        return 'from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800/50';
    }
  };

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white/60 dark:bg-gray-900/95 backdrop-blur-sm border-r border-purple-100 dark:border-gray-800 h-full transition-all duration-300 overflow-y-auto"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = state.activeView === item.id;
            
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: item.id as any })}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:scale-102'
                }`}
                whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ 
                    rotate: isActive ? 360 : 0,
                    scale: isActive ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'} transition-colors duration-300`} />
                </motion.div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Top Performers Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-200 transition-colors duration-300">Top Performers</span>
          </div>
          
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                className={`p-3 rounded-lg bg-gradient-to-r ${getRankColor(student.rank)} border transition-all duration-100 cursor-pointer`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700"
                    />
                    <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                      {getRankIcon(student.rank)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {student.name}
                      </p>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        #{student.rank}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {student.studyHours}h
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          {student.streak}d
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for points */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(student.points / 3000) * 100}%` }}
                      transition={{ delay: 0.2 * index, duration: 0.8 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {student.points} pts
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      3000
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'leaderboard' })}
            className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-md transition-all duration-100"
          >
            View Full Leaderboard
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-200 transition-colors duration-300">Active Study Rooms</span>
          </div>
          <motion.p 
            className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            3
          </motion.p>
          <p className="text-xs text-purple-600 dark:text-purple-400 transition-colors duration-300">Join or create new rooms</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-2 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200 transition-colors duration-300">Study Streak</span>
          </div>
          <motion.p 
            className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            12 days
          </motion.p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 transition-colors duration-300">Keep it going! 🔥</p>
        </motion.div>
      </div>
    </motion.aside>
  );
}