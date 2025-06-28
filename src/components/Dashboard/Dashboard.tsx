import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  FileText,
  Brain,
  Zap
} from 'lucide-react';
import StatsCard from './StatsCard';
import { useApp } from '../../contexts/AppContext';

export default function Dashboard() {
  const { state } = useApp();

  const recentActivities = [
    { id: 1, action: 'Uploaded "Calculus Notes.pdf"', time: '2 hours ago', type: 'upload' },
    { id: 2, action: 'Completed AI Quiz on Physics', time: '4 hours ago', type: 'quiz' },
    { id: 3, action: 'Joined Study Room "Advanced Math"', time: '1 day ago', type: 'join' },
    { id: 4, action: 'Generated summary for Biology Chapter 3', time: '2 days ago', type: 'ai' }
  ];

  const upcomingSessions = [
    { id: 1, title: 'Chemistry Lab Review', time: 'Today, 3:00 PM', participants: 4 },
    { id: 2, title: 'Math Problem Solving', time: 'Tomorrow, 10:00 AM', participants: 6 },
    { id: 3, title: 'History Discussion', time: 'Wednesday, 2:00 PM', participants: 3 }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {state.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your study progress</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Study Materials"
          value={state.studyMaterials.length}
          subtitle="Documents uploaded"
          icon={FileText}
          color="purple"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="AI Summaries"
          value="24"
          subtitle="Generated this week"
          icon={Brain}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Study Sessions"
          value={state.studySessions.length}
          subtitle="Completed this month"
          icon={Clock}
          color="emerald"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Study Score"
          value="94%"
          subtitle="Performance rating"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  x: 4, 
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-all duration-100 cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'upload' ? 'bg-blue-500' :
                  activity.type === 'quiz' ? 'bg-green-500' :
                  activity.type === 'join' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h2>
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  y: -2, 
                  scale: 1.01,
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-100 dark:border-purple-800/50 hover:shadow-md transition-all duration-100 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{session.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{session.time}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400">
                    <Users className="w-4 h-4" />
                    <span>{session.participants}</span>
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
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-100"
          >
            Schedule New Session
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}