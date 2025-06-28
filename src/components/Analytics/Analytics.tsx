import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Users,
  Calendar,
  Target,
  Award,
  Brain
} from 'lucide-react';

export default function Analytics() {
  const studyData = [
    { day: 'Mon', hours: 3.5, sessions: 2 },
    { day: 'Tue', hours: 2.8, sessions: 1 },
    { day: 'Wed', hours: 4.2, sessions: 3 },
    { day: 'Thu', hours: 3.1, sessions: 2 },
    { day: 'Fri', hours: 2.5, sessions: 1 },
    { day: 'Sat', hours: 5.2, sessions: 4 },
    { day: 'Sun', hours: 3.8, sessions: 2 }
  ];

  const maxHours = Math.max(...studyData.map(d => d.hours));

  const achievements = [
    { id: 1, title: 'Study Streak', description: '7 days in a row', icon: Target, color: 'emerald' },
    { id: 2, title: 'AI Master', description: '50 AI summaries generated', icon: Brain, color: 'purple' },
    { id: 3, title: 'Collaborator', description: '10 group sessions', icon: Users, color: 'blue' },
    { id: 4, title: 'Knowledge Seeker', description: '100 hours studied', icon: BookOpen, color: 'orange' }
  ];

  const subjectProgress = [
    { subject: 'Mathematics', progress: 85, color: 'bg-blue-500' },
    { subject: 'Physics', progress: 72, color: 'bg-emerald-500' },
    { subject: 'Chemistry', progress: 68, color: 'bg-purple-500' },
    { subject: 'Biology', progress: 91, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Analytics</h1>
        <p className="text-gray-600">Track your learning progress and insights</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/50 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Study Time</h3>
          <p className="text-3xl font-bold text-blue-900">24.8h</p>
          <p className="text-sm text-blue-600">This week</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/50 rounded-xl">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Study Sessions</h3>
          <p className="text-3xl font-bold text-emerald-900">15</p>
          <p className="text-sm text-emerald-600">This week</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/50 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Materials Studied</h3>
          <p className="text-3xl font-bold text-purple-900">12</p>
          <p className="text-sm text-purple-600">This week</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Average Score</h3>
          <p className="text-3xl font-bold text-orange-900">94%</p>
          <p className="text-sm text-orange-600">This week</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Study Hours</h2>
          <div className="space-y-4">
            {studyData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.hours / maxHours) * 100}%` }}
                    transition={{ delay: 0.1 * index, duration: 0.8 }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full"
                  />
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {day.hours}h
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Progress */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Progress</h2>
          <div className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                  <span className="text-sm font-medium text-gray-900">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ delay: 0.1 * index, duration: 0.8 }}
                    className={`${subject.color} h-2 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            const colorMap = {
              emerald: 'from-emerald-500 to-green-500',
              purple: 'from-purple-500 to-violet-500',
              blue: 'from-blue-500 to-cyan-500',
              orange: 'from-orange-500 to-red-500'
            };
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, type: 'spring' }}
                className="p-4 bg-white rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${colorMap[achievement.color as keyof typeof colorMap]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}