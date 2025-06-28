import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  TrendingUp,
  Clock,
  BookOpen,
  Brain,
  Users,
  Calendar,
  Target,
  Zap,
  Award,
  Filter,
  ChevronDown
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  studyHours: number;
  streak: number;
  points: number;
  quizzesCompleted: number;
  materialsUploaded: number;
  sessionsAttended: number;
  weeklyGrowth: number;
  badges: string[];
  isCurrentUser?: boolean;
}

type SortBy = 'points' | 'studyHours' | 'streak' | 'quizzes';
type TimeFilter = 'week' | 'month' | 'allTime';

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortBy>('points');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [showFilters, setShowFilters] = useState(false);

  // Mock leaderboard data - in a real app this would come from the backend
  const students: Student[] = [
    {
      id: '1',
      name: 'Sarah Kim',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 1,
      studyHours: 42.5,
      streak: 15,
      points: 2850,
      quizzesCompleted: 28,
      materialsUploaded: 12,
      sessionsAttended: 18,
      weeklyGrowth: 15,
      badges: ['Study Master', 'Quiz Champion', 'Streak Legend']
    },
    {
      id: '2',
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 2,
      studyHours: 38.2,
      streak: 12,
      points: 2640,
      quizzesCompleted: 24,
      materialsUploaded: 8,
      sessionsAttended: 15,
      weeklyGrowth: 12,
      badges: ['Consistent Learner', 'Team Player'],
      isCurrentUser: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 3,
      studyHours: 35.8,
      streak: 8,
      points: 2420,
      quizzesCompleted: 22,
      materialsUploaded: 15,
      sessionsAttended: 12,
      weeklyGrowth: 8,
      badges: ['Content Creator', 'Rising Star']
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 4,
      studyHours: 32.1,
      streak: 10,
      points: 2180,
      quizzesCompleted: 19,
      materialsUploaded: 6,
      sessionsAttended: 14,
      weeklyGrowth: 18,
      badges: ['Fast Learner']
    },
    {
      id: '5',
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 5,
      studyHours: 28.7,
      streak: 6,
      points: 1950,
      quizzesCompleted: 16,
      materialsUploaded: 9,
      sessionsAttended: 11,
      weeklyGrowth: 5,
      badges: ['Dedicated Student']
    },
    {
      id: '6',
      name: 'Lisa Zhang',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rank: 6,
      studyHours: 25.3,
      streak: 4,
      points: 1720,
      quizzesCompleted: 14,
      materialsUploaded: 7,
      sessionsAttended: 9,
      weeklyGrowth: 22,
      badges: ['Newcomer']
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-purple-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
    }
  };

  const getMetricValue = (student: Student, metric: SortBy) => {
    switch (metric) {
      case 'points':
        return student.points;
      case 'studyHours':
        return student.studyHours;
      case 'streak':
        return student.streak;
      case 'quizzes':
        return student.quizzesCompleted;
      default:
        return student.points;
    }
  };

  const getMetricLabel = (metric: SortBy) => {
    switch (metric) {
      case 'points':
        return 'Points';
      case 'studyHours':
        return 'Study Hours';
      case 'streak':
        return 'Day Streak';
      case 'quizzes':
        return 'Quizzes';
      default:
        return 'Points';
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = getMetricValue(a, sortBy);
    const bValue = getMetricValue(b, sortBy);
    return bValue - aValue;
  });

  const currentUser = students.find(s => s.isCurrentUser);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-300">See how you rank among your study group</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                >
                  <div className="p-3">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="points">Points</option>
                        <option value="studyHours">Study Hours</option>
                        <option value="streak">Streak</option>
                        <option value="quizzes">Quizzes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Time Period</label>
                      <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="allTime">All Time</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Current User Stats */}
      {currentUser && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
                  {getRankIcon(currentUser.rank)}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Rank: #{currentUser.rank}</h2>
                <p className="text-purple-100">Keep up the great work!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{getMetricValue(currentUser, sortBy)}</div>
              <div className="text-purple-100">{getMetricLabel(sortBy)}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentUser.studyHours}h</div>
              <div className="text-purple-100 text-sm">Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentUser.streak}</div>
              <div className="text-purple-100 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentUser.quizzesCompleted}</div>
              <div className="text-purple-100 text-sm">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+{currentUser.weeklyGrowth}%</div>
              <div className="text-purple-100 text-sm">Growth</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Top Performers</h2>
        
        <div className="flex items-end justify-center space-x-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="relative mb-4">
              <img
                src={sortedStudents[1]?.avatar}
                alt={sortedStudents[1]?.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 mx-auto"
              />
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2">
                <Medal className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 h-24 w-20 rounded-t-lg mx-auto flex items-end justify-center pb-2">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-gray-900 dark:text-white">{sortedStudents[1]?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getMetricValue(sortedStudents[1], sortBy)} {getMetricLabel(sortBy)}</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="relative mb-4">
              <img
                src={sortedStudents[0]?.avatar}
                alt={sortedStudents[0]?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 mx-auto"
              />
              <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2">
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-gradient-to-t from-yellow-400 to-yellow-300 h-32 w-24 rounded-t-lg mx-auto flex items-end justify-center pb-2">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <div className="mt-2">
              <p className="font-bold text-gray-900 dark:text-white text-lg">{sortedStudents[0]?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getMetricValue(sortedStudents[0], sortBy)} {getMetricLabel(sortBy)}</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="relative mb-4">
              <img
                src={sortedStudents[2]?.avatar}
                alt={sortedStudents[2]?.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 mx-auto"
              />
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2">
                <Medal className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="bg-gradient-to-t from-amber-400 to-amber-300 h-20 w-20 rounded-t-lg mx-auto flex items-end justify-center pb-2">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div className="mt-2">
              <p className="font-semibold text-gray-900 dark:text-white">{sortedStudents[2]?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getMetricValue(sortedStudents[2], sortBy)} {getMetricLabel(sortBy)}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Full Rankings</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                x: 4,
                transition: { duration: 0.1, ease: "easeOut" }
              }}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-100 ${
                student.isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(student.rank)}`}>
                      {student.rank}
                    </div>
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                      {student.rank <= 3 && (
                        <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                          {getRankIcon(student.rank)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                      {student.isCurrentUser && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{student.studyHours}h</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                        <Zap className="w-4 h-4" />
                        <span>{student.streak}d</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                        <Brain className="w-4 h-4" />
                        <span>{student.quizzesCompleted}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getMetricValue(student, sortBy)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {getMetricLabel(sortBy)}
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      +{student.weeklyGrowth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              {student.badges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.badges.map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-800"
                    >
                      <Award className="w-3 h-3 inline mr-1" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}