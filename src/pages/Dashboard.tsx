import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Leaf, 
  TrendingUp, 
  MapPin, 
  Award, 
  Camera, 
  Sparkles,
  BarChart3,
  PieChart,
  Zap,
  TreePine,
  Droplets,
  Wind,
  Share2,
  Heart
} from 'lucide-react';
import { ecoAchievements } from '../data/mockData';
import { 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  LineChart, 
  Line,
  ReferenceLine
} from 'recharts';
import LiveMoodDetector from '../components/mood/LiveMoodDetector';
import MoodLeaderboard from '../components/mood/MoodLeaderboard';
import SocialShare from '../components/social/SocialShare';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // Mock data for charts
  const moodData = [
    { name: 'Elegant', value: 40, color: '#8B5CF6' },
    { name: 'Confident', value: 25, color: '#EF4444' },
    { name: 'Calm', value: 20, color: '#10B981' },
    { name: 'Romantic', value: 15, color: '#F59E0B' }
  ];

  const monthlyMoodData = [
    { month: 'Jan', confident: 30, calm: 25, elegant: 35, romantic: 20 },
    { month: 'Feb', confident: 35, calm: 30, elegant: 40, romantic: 25 },
    { month: 'Mar', confident: 25, calm: 35, elegant: 30, romantic: 30 },
    { month: 'Apr', confident: 40, calm: 20, elegant: 45, romantic: 15 },
    { month: 'May', confident: 35, calm: 40, elegant: 50, romantic: 35 },
    { month: 'Jun', confident: 45, calm: 30, elegant: 35, romantic: 20 }
  ];

  const personalityData = [
    { trait: 'Elegance Explorer', A: 90, fullMark: 100 },
    { trait: 'Serotonin Seeker', A: 75, fullMark: 100 },
    { trait: 'Sustainability Champion', A: 85, fullMark: 100 },
    { trait: 'Style Innovator', A: 70, fullMark: 100 },
    { trait: 'Conscious Consumer', A: 95, fullMark: 100 },
    { trait: 'Mood Master', A: 80, fullMark: 100 }
  ];

  const spendingByMoodData = [
    { mood: 'Elegant', amount: 450, orders: 12 },
    { mood: 'Confident', amount: 320, orders: 8 },
    { mood: 'Calm', amount: 180, orders: 6 },
    { mood: 'Romantic', amount: 240, orders: 7 },
    { mood: 'Adventurous', amount: 150, orders: 4 }
  ];

  // Enhanced eco impact data with more data points for smoother curves
  const ecoImpactOverTime = [
    { month: 'Jan', trees: 8, carbon: 45, water: 200, day: 1 },
    { month: 'Jan', trees: 10, carbon: 52, water: 230, day: 15 },
    { month: 'Feb', trees: 12, carbon: 67, water: 350, day: 1 },
    { month: 'Feb', trees: 14, carbon: 72, water: 380, day: 15 },
    { month: 'Mar', trees: 15, carbon: 89, water: 420, day: 1 },
    { month: 'Mar', trees: 16, carbon: 92, water: 440, day: 15 },
    { month: 'Apr', trees: 7, carbon: 79, water: 280, day: 1 },
    { month: 'Apr', trees: 9, carbon: 85, water: 320, day: 15 },
    { month: 'May', trees: 18, carbon: 95, water: 480, day: 1 },
    { month: 'May', trees: 20, carbon: 105, water: 520, day: 15 },
    { month: 'Jun', trees: 22, carbon: 120, water: 560, day: 1 },
    { month: 'Jun', trees: 25, carbon: 135, water: 600, day: 15 }
  ];

  const isDarkMode = user?.preferences?.darkMode || false;

  // Custom tooltip component for smooth hover
  const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
    if (active && payload && payload.length && coordinate) {
      return (
        <div 
          className={`p-3 rounded-lg shadow-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'trees' && ' trees'}
              {entry.dataKey === 'carbon' && 'kg CO₂'}
              {entry.dataKey === 'water' && 'L'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom dot component that's invisible but captures hover
  const CustomDot = (props: any) => {
    return <circle {...props} r={0} fill="transparent" />;
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen py-8 transition-colors ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome back, {user.name?.split(' ')[0]}! ✨
              </h1>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Track your eco impact, explore your mood journey, and discover your style DNA
              </p>
            </div>
            <SocialShare 
              ecoImpact={{
                trees: user.ecoStats?.treesPlanted || 0,
                carbon: user.ecoStats?.carbonReduced || 0,
                water: user.ecoStats?.waterSaved || 0
              }}
              mood={user.preferences?.currentMood}
            />
          </div>
        </div>

        {/* Eco Legacy Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Eco Legacy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className={`p-6 rounded-xl shadow-sm border border-green-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <TreePine className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {user.ecoStats?.treesPlanted || 0}
                </span>
              </div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trees Planted</p>
            </div>
            
            <div className={`p-6 rounded-xl shadow-sm border border-blue-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <Wind className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {user.ecoStats?.carbonReduced || 0}kg
                </span>
              </div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CO₂ Reduced</p>
            </div>
            
            <div className={`p-6 rounded-xl shadow-sm border border-cyan-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <Droplets className="h-8 w-8 text-cyan-600" />
                <span className="text-2xl font-bold text-cyan-600">
                  {user.ecoStats?.waterSaved || 0}L
                </span>
              </div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water Saved</p>
            </div>
            
            <div className={`p-6 rounded-xl shadow-sm border border-purple-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <MapPin className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">
                  {user.ecoStats?.impactZones?.length || 0}
                </span>
              </div>
              <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Impact Zones</p>
            </div>
          </div>

          {/* Enhanced Eco Impact Over Time with Smooth Hover */}
          <div className={`p-6 rounded-xl shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Eco Impact Over Time
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={ecoImpactOverTime}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  
                  {/* Custom Tooltip with smooth positioning */}
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: isDarkMode ? '#6B7280' : '#9CA3AF',
                      strokeWidth: 1,
                      strokeDasharray: '3 3'
                    }}
                    position={{ x: 0, y: 0 }}
                    allowEscapeViewBox={{ x: true, y: true }}
                    animationDuration={0}
                  />
                  
                  {/* Trees Line */}
                  <Line 
                    type="monotone" 
                    dataKey="trees" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Trees"
                    dot={<CustomDot />}
                    activeDot={{ 
                      r: 6, 
                      fill: '#10B981',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                    }}
                    connectNulls={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  
                  {/* Carbon Line */}
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="CO₂ Reduced"
                    dot={<CustomDot />}
                    activeDot={{ 
                      r: 6, 
                      fill: '#3B82F6',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                    }}
                    connectNulls={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    animationBegin={200}
                  />
                  
                  {/* Water Line */}
                  <Line 
                    type="monotone" 
                    dataKey="water" 
                    stroke="#06B6D4" 
                    strokeWidth={3}
                    name="Water Saved"
                    dot={<CustomDot />}
                    activeDot={{ 
                      r: 6, 
                      fill: '#06B6D4',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                    }}
                    connectNulls={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    animationBegin={400}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trees Planted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CO₂ Reduced (kg)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Water Saved (L)</span>
              </div>
            </div>
          </div>

          {/* Impact Map */}
          <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Impact Zones</h3>
            <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Interactive Map</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meghalaya, India - 8.5m² forest restored</p>
                {user.ecoStats?.impactZones?.some(zone => zone.giftedBy) && (
                  <p className="text-sm text-pink-600 mt-1">💕 Some areas gifted by friends</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Mirror */}
          <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="h-6 w-6 text-purple-600" />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mood Mirror</h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={moodData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your dominant mood this month:</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                ✨ Elegant Explorer
              </span>
            </div>
          </div>

          {/* Live Mood Mirror */}
          <LiveMoodDetector />
        </div>

        {/* Spending by Mood Analysis */}
        <div className={`p-6 rounded-xl shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Spending by Mood</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingByMoodData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="mood" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="amount" fill="#8B5CF6" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {spendingByMoodData.map((mood) => (
              <div key={mood.mood} className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mood.mood}</p>
                <p className="text-purple-600 font-bold">${mood.amount}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{mood.orders} orders</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* EmoDNA Personality Engine */}
          <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-yellow-600" />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>EmoDNA™ Profile</h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={personalityData}>
                  <PolarGrid stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <PolarAngleAxis dataKey="trait" tick={{ fontSize: 10, fill: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar
                    name="Personality"
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your personality traits:</p>
              <div className="flex flex-wrap gap-2">
                {user.moodProfile?.personality.map((trait, index) => (
                  <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-6 w-6 text-orange-600" />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Eco Achievements</h3>
            </div>
            
            <div className="space-y-3">
              {ecoAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-green-50 border border-green-200' 
                      : isDarkMode 
                        ? 'bg-gray-700 border border-gray-600' 
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      achievement.unlocked 
                        ? 'text-green-900' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </p>
                    <p className={`text-sm ${
                      achievement.unlocked 
                        ? 'text-green-600' 
                        : isDarkMode 
                          ? 'text-gray-400' 
                          : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mood Leaderboard */}
        <div className="mb-8">
          <MoodLeaderboard />
        </div>

        {/* Restyle Past Purchases */}
        <div className={`p-6 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-pink-600" />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Restyle Your Past Purchases</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200'
            }`}>
              <img
                src="https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Past purchase"
                className="w-full h-32 object-cover rounded mb-3"
              />
              <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ethereal Silk Dress</p>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purchased 2 months ago</p>
              <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Last worn: Elegant mood</p>
              <button className="w-full bg-pink-100 text-pink-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors">
                Get New Styling Ideas
              </button>
            </div>
            
            <div className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200'
            }`}>
              <img
                src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Past purchase"
                className="w-full h-32 object-cover rounded mb-3"
              />
              <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bold Statement Jacket</p>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purchased 1 month ago</p>
              <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Last worn: Confident mood</p>
              <button className="w-full bg-pink-100 text-pink-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors">
                Get New Styling Ideas
              </button>
            </div>
            
            <div className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200'
            }`}>
              <img
                src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Past purchase"
                className="w-full h-32 object-cover rounded mb-3"
              />
              <p className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Professional Blazer</p>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purchased 3 weeks ago</p>
              <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Last worn: Professional mood</p>
              <button className="w-full bg-pink-100 text-pink-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors">
                Get New Styling Ideas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;