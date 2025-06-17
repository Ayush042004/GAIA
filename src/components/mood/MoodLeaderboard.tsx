import React from 'react';
import { TrendingUp, Crown, Trophy, Medal } from 'lucide-react';
import { useMoodStore } from '../../store/moodStore';
import { motion } from 'framer-motion';

const MoodLeaderboard: React.FC = () => {
  const { moodLeaderboard } = useMoodStore();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Mood Leaderboard</h2>
        <span className="text-sm text-gray-500">This Week</span>
      </div>

      <div className="space-y-4">
        {moodLeaderboard.map((mood, index) => (
          <motion.div
            key={mood.mood}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10">
                {getRankIcon(index)}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{mood.emoji}</span>
                <div>
                  <h3 className={`font-semibold ${index === 0 ? 'text-yellow-900' : 'text-gray-900'}`}>
                    {mood.mood}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {mood.totalOrders.toLocaleString()} orders
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-bold ${index === 0 ? 'text-yellow-900' : 'text-gray-900'}`}>
                ${mood.totalSpent.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-sm font-medium text-green-600">{mood.growth}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800 text-center">
          <span className="font-medium">Trending:</span> "Chill Luxe" is this week's most shopped mood! 
          Join the vibe and discover sustainable luxury pieces.
        </p>
      </div>
    </div>
  );
};

export default MoodLeaderboard;