import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment, ContactShadows } from '@react-three/drei';
import { Star, Award, TrendingUp, Filter, Grid, List, Eye, ShoppingBag, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar3D, Lighting } from '../components/3d/Avatar3D';
import OutfitViewer3D from '../components/3d/OutfitViewer3D';
import { useAuthStore } from '../store/authStore';

const TopPicks: React.FC = () => {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null);
  const [show3DViewer, setShow3DViewer] = useState(false);

  const isDarkMode = user?.preferences?.darkMode || false;

  const stylistPicks = [
    {
      id: 1,
      name: 'Midnight Elegance',
      stylist: 'Elena Rodriguez',
      rating: 4.9,
      likes: 1247,
      price: 285,
      category: 'evening',
      mood: ['elegant', 'confident'],
      climate: 'cool',
      image: 'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'A sophisticated ensemble perfect for evening events',
      items: ['Silk Dress', 'Statement Necklace', 'Heels', 'Clutch']
    },
    {
      id: 2,
      name: 'Boho Sunset',
      stylist: 'Maya Chen',
      rating: 4.8,
      likes: 892,
      price: 198,
      category: 'casual',
      mood: ['adventurous', 'calm'],
      climate: 'warm',
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Free-spirited look for festival season',
      items: ['Flowy Top', 'Wide Leg Pants', 'Sandals', 'Layered Jewelry']
    },
    {
      id: 3,
      name: 'Power Executive',
      stylist: 'James Thompson',
      rating: 4.9,
      likes: 1156,
      price: 345,
      category: 'professional',
      mood: ['confident', 'professional'],
      climate: 'cool',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Command the boardroom with authority',
      items: ['Tailored Blazer', 'Dress Pants', 'Oxford Shoes', 'Watch']
    },
    {
      id: 4,
      name: 'Urban Explorer',
      stylist: 'Zoe Williams',
      rating: 4.7,
      likes: 634,
      price: 167,
      category: 'street',
      mood: ['bold', 'adventurous'],
      climate: 'mild',
      image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Street style meets sustainability',
      items: ['Denim Jacket', 'Graphic Tee', 'Cargo Pants', 'Sneakers']
    },
    {
      id: 5,
      name: 'Garden Party',
      stylist: 'Luna Martinez',
      rating: 4.8,
      likes: 978,
      price: 223,
      category: 'daytime',
      mood: ['romantic', 'elegant'],
      climate: 'warm',
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Feminine florals for outdoor occasions',
      items: ['Floral Dress', 'Cardigan', 'Flats', 'Sun Hat']
    },
    {
      id: 6,
      name: 'Minimalist Zen',
      stylist: 'Kai Nakamura',
      rating: 4.9,
      likes: 1089,
      price: 189,
      category: 'casual',
      mood: ['calm', 'elegant'],
      climate: 'mild',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Less is more philosophy in fashion',
      items: ['Linen Shirt', 'Wide Pants', 'Slides', 'Minimal Accessories']
    }
  ];

  const topStylists = [
    { name: 'Elena Rodriguez', specialization: 'Evening Wear', rating: 4.9, clients: 234 },
    { name: 'Maya Chen', specialization: 'Boho Chic', rating: 4.8, clients: 189 },
    { name: 'James Thompson', specialization: 'Professional', rating: 4.9, clients: 312 },
    { name: 'Zoe Williams', specialization: 'Street Style', rating: 4.7, clients: 156 },
    { name: 'Luna Martinez', specialization: 'Romantic', rating: 4.8, clients: 198 }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'evening', name: 'Evening' },
    { id: 'casual', name: 'Casual' },
    { id: 'professional', name: 'Professional' },
    { id: 'street', name: 'Street Style' },
    { id: 'daytime', name: 'Daytime' }
  ];

  const filteredPicks = stylistPicks.filter(pick => 
    selectedCategory === 'all' || pick.category === selectedCategory
  ).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.likes - a.likes;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleOutfitClick = (outfit: any) => {
    setSelectedOutfit(outfit);
    setShow3DViewer(true);
  };

  const handleAvatarClick = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Award className="h-8 w-8 text-purple-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Top Stylist Picks
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Curated outfits by our top-rated stylists, featuring mood-matched pieces and sustainable choices
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-wrap items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <motion.button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === '3d' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                3D Models
              </motion.button>
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Gender Toggle for 3D View */}
            {viewMode === '3d' && (
              <div className={`flex rounded-lg p-1 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <motion.button
                  onClick={() => setSelectedGender('female')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedGender === 'female'
                      ? 'bg-pink-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-4 w-4" />
                  <span>Female</span>
                </motion.button>
                <motion.button
                  onClick={() => setSelectedGender('male')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedGender === 'male'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-4 w-4" />
                  <span>Male</span>
                </motion.button>
              </div>
            )}

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300'
            }`}
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </motion.div>

        {/* 3D View */}
        {viewMode === '3d' && (
          <motion.div 
            className={`rounded-2xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                3D Outfit Showcase
              </h2>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Click on outfits below to try them on the model
              </div>
            </div>
            
            <div className="h-96 w-full rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 2, 8], fov: 50 }} shadows>
                <Suspense fallback={null}>
                  <Lighting />
                  <Environment preset="studio" />
                  <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                  />
                  
                  <Avatar3D
                    gender={selectedGender}
                    outfit={selectedOutfit ? {
                      top: selectedOutfit.mood[0],
                      bottom: selectedOutfit.mood[0],
                      shoes: selectedOutfit.mood[0]
                    } : undefined}
                    position={[0, 0, 0]}
                    isSelected={true}
                    onClick={() => handleAvatarClick(selectedGender)}
                  />
                  
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={1}
                    minDistance={3}
                    maxDistance={12}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                  />
                </Suspense>
              </Canvas>
            </div>
            
            <div className="mt-4 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Click and drag to rotate • Scroll to zoom • Select outfits below to try them on
              </p>
              {selectedOutfit && (
                <motion.div 
                  className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Now showing: {selectedOutfit.name}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Outfit Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredPicks.map((pick, index) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className={`group rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } ${selectedOutfit?.id === pick.id ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => handleOutfitClick(pick)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <img
                  src={pick.image}
                  alt={pick.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'
                  }`}>
                    {pick.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-900">{pick.rating}</span>
                </div>
                
                {/* Try On Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-medium flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Try On 3D Model</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {pick.name}
                  </h3>
                  <span className="text-2xl font-bold text-purple-600">${pick.price}</span>
                </div>

                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  by {pick.stylist}
                </p>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pick.description}
                </p>

                {/* Mood Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pick.mood.map((mood, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                    >
                      {mood}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {pick.climate}
                  </span>
                </div>

                {/* Items List */}
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Includes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pick.items.map((item, index) => (
                      <span 
                        key={index} 
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className={`flex items-center justify-between text-sm mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{pick.likes} likes</span>
                  </div>
                  <span>{pick.climate} climate</span>
                </div>

                <div className="flex space-x-2">
                  <motion.button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Shop This Look
                  </motion.button>
                  <motion.button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="View in 3D"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top Stylists Leaderboard */}
        <motion.div 
          className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-6 w-6 text-yellow-600" />
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Stylists This Month
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topStylists.map((stylist, index) => (
              <motion.div
                key={index}
                className={`text-center p-4 rounded-lg transition-colors ${
                  index === 0 
                    ? 'bg-yellow-50 border-2 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700' 
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                  {stylist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stylist.name}
                </h3>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stylist.specialization}
                </p>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{stylist.rating}</span>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stylist.clients} clients
                </p>
                {index === 0 && (
                  <motion.div 
                    className="mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                  >
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      👑 #1 This Month
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3D Outfit Viewer Modal */}
      <AnimatePresence>
        {show3DViewer && selectedOutfit && (
          <OutfitViewer3D
            selectedOutfit={selectedOutfit}
            onClose={() => setShow3DViewer(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopPicks;