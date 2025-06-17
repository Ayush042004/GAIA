import React, { useState } from 'react';
import { 
  GamepadIcon, 
  Target, 
  Gift, 
  RotateCcw, 
  Star, 
  Crown,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Games: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [moodMatchScore, setMoodMatchScore] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // MoodMatch Game
  const moods = [
    { id: 'confident', name: 'Confident', emoji: '💪', color: 'bg-red-500' },
    { id: 'calm', name: 'Calm', emoji: '🧘‍♀️', color: 'bg-blue-500' },
    { id: 'elegant', name: 'Elegant', emoji: '✨', color: 'bg-purple-500' },
    { id: 'adventurous', name: 'Adventurous', emoji: '🌍', color: 'bg-green-500' }
  ];

  const outfits = [
    { id: 1, name: 'Power Suit', mood: 'confident', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, name: 'Yoga Set', mood: 'calm', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, name: 'Silk Dress', mood: 'elegant', image: 'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 4, name: 'Hiking Gear', mood: 'adventurous', image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  // Spin the Vibe Game
  const vibeWheelItems = [
    { id: 1, label: '20% OFF', color: 'bg-red-500', textColor: 'text-white' },
    { id: 2, label: 'Free Shipping', color: 'bg-blue-500', textColor: 'text-white' },
    { id: 3, label: 'Mood Reading', color: 'bg-purple-500', textColor: 'text-white' },
    { id: 4, label: '15% OFF', color: 'bg-green-500', textColor: 'text-white' },
    { id: 5, label: 'Style Consult', color: 'bg-yellow-500', textColor: 'text-black' },
    { id: 6, label: '10% OFF', color: 'bg-pink-500', textColor: 'text-white' },
    { id: 7, label: 'Eco Tree', color: 'bg-teal-500', textColor: 'text-white' },
    { id: 8, label: 'Try Again', color: 'bg-gray-500', textColor: 'text-white' }
  ];

  const handleMoodMatch = (moodId: string, outfitId: number) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit && outfit.mood === moodId) {
      setMoodMatchScore(prev => prev + 10);
    }
  };

  const spinTheWheel = () => {
    setIsSpinning(true);
    setSpinResult(null);
    
    setTimeout(() => {
      const randomItem = vibeWheelItems[Math.floor(Math.random() * vibeWheelItems.length)];
      setSpinResult(randomItem.label);
      setIsSpinning(false);
    }, 3000);
  };

  const moodBoxes = [
    {
      id: 1,
      name: 'Softgirl Summer Pack',
      description: '5 curated pieces for the perfect soft aesthetic',
      price: 89,
      originalPrice: 125,
      items: ['Linen Top', 'Flowy Skirt', 'Delicate Jewelry', 'Canvas Tote', 'Hair Accessory'],
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Boss Babe Bundle',
      description: 'Command attention with this power collection',
      price: 149,
      originalPrice: 200,
      items: ['Blazer', 'Dress Pants', 'Statement Necklace', 'Leather Bag', 'Heels'],
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Zen Warrior Kit',
      description: 'Find your inner peace with sustainable comfort',
      price: 67,
      originalPrice: 95,
      items: ['Yoga Set', 'Meditation Cushion', 'Herbal Tea', 'Journal', 'Crystals'],
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma Style', score: 2450, badge: '👑' },
    { rank: 2, name: 'Zoe Mood', score: 2280, badge: '🥈' },
    { rank: 3, name: 'Aria Vibe', score: 2150, badge: '🥉' },
    { rank: 4, name: 'You', score: moodMatchScore, badge: '⭐' },
    { rank: 5, name: 'Luna Fashion', score: 1890, badge: '💫' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GamepadIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Games
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Play, discover, and win while exploring your style personality
          </p>
        </div>

        {/* Game Selection */}
        {!currentGame && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-purple-500"
              onClick={() => setCurrentGame('mood-match')}
            >
              <div className="text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">MoodMatch</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop moods to their perfect outfit matches
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
                  <Star className="h-4 w-4" />
                  <span>Score: {moodMatchScore} points</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-pink-500"
              onClick={() => setCurrentGame('spin-vibe')}
            >
              <div className="text-center">
                <RotateCcw className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Spin the Vibe</h3>
                <p className="text-gray-600 mb-4">
                  Spin the wheel for discounts, styling tips, and surprises
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-pink-600">
                  <Sparkles className="h-4 w-4" />
                  <span>Daily spins available</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-teal-500"
              onClick={() => setCurrentGame('mood-box')}
            >
              <div className="text-center">
                <Gift className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">MoodBox</h3>
                <p className="text-gray-600 mb-4">
                  Mystery bundles curated for your vibe at special prices
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-teal-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Up to 40% savings</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MoodMatch Game */}
        {currentGame === 'mood-match' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">MoodMatch Challenge</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900">{moodMatchScore} points</span>
                </div>
                <button
                  onClick={() => setCurrentGame(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back to Games
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Moods */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Moods</h3>
                <div className="space-y-3">
                  {moods.map((mood) => (
                    <div
                      key={mood.id}
                      className={`${mood.color} p-4 rounded-lg text-white cursor-move`}
                      draggable
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="font-medium">{mood.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outfits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Outfits</h3>
                <div className="grid grid-cols-2 gap-4">
                  {outfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors"
                      onDrop={(e) => {
                        e.preventDefault();
                        const moodId = e.dataTransfer.getData('text/plain');
                        handleMoodMatch(moodId, outfit.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium text-gray-900">{outfit.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spin the Vibe Game */}
        {currentGame === 'spin-vibe' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Spin the Vibe</h2>
              <button
                onClick={() => setCurrentGame(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to Games
              </button>
            </div>

            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className={`w-full h-full rounded-full border-8 border-purple-200 ${isSpinning ? 'animate-spin' : ''}`}>
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <RotateCcw className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-bold">SPIN!</p>
                    </div>
                  </div>
                </div>
              </div>

              {spinResult && (
                <div className="mb-6 p-4 bg-green-100 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-2">🎉 You Won!</h3>
                  <p className="text-green-800">{spinResult}</p>
                </div>
              )}

              <button
                onClick={spinTheWheel}
                disabled={isSpinning}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>
            </div>
          </div>
        )}

        {/* MoodBox Game */}
        {currentGame === 'mood-box' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">MoodBox Collection</h2>
              <button
                onClick={() => setCurrentGame(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to Games
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moodBoxes.map((box) => (
                <div key={box.id} className="border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{box.name}</h3>
                    <p className="text-gray-600 mb-4">{box.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">What's inside:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {box.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">${box.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${box.originalPrice}</span>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {Math.round((1 - box.price / box.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                      Get This MoodBox
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {!currentGame && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Crown className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Mood Masters Leaderboard</h2>
            </div>

            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    player.name === 'You' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-500">#{player.rank}</span>
                    <span className="text-2xl">{player.badge}</span>
                    <span className={`font-medium ${player.name === 'You' ? 'text-purple-900' : 'text-gray-900'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className={`font-bold ${player.name === 'You' ? 'text-purple-600' : 'text-gray-600'}`}>
                    {player.score.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;