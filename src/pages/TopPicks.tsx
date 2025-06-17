import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Star, Award, TrendingUp, Filter, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

// 3D Outfit Component
const OutfitModel: React.FC<{ position: [number, number, number]; color: string; name: string }> = ({ 
  position, 
  color, 
  name 
}) => {
  return (
    <group position={position}>
      <Box args={[1, 2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

const TopPicks: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Award className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Top Stylist Picks
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated outfits by our top-rated stylists, featuring mood-matched pieces and sustainable choices
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === '3d' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* 3D View */}
        {viewMode === '3d' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3D Outfit Showcase</h2>
            <div className="h-96  w-full">
              <Canvas camera={{ position: [0, 0, 8] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <OutfitModel position={[-3, 0, 0]} color="#8B5CF6" name="Elegant" />
                  <OutfitModel position={[-1, 0, 0]} color="#EC4899" name="Boho" />
                  <OutfitModel position={[1, 0, 0]} color="#3B82F6" name="Professional" />
                  <OutfitModel position={[3, 0, 0]} color="#10B981" name="Street" />
                </Suspense>
                <OrbitControls enableZoom={true} />
              </Canvas>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              Click and drag to rotate • Scroll to zoom
            </p>
          </div>
        )}

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPicks.map((pick, index) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={pick.image}
                  alt={pick.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-900">
                    {pick.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-900">{pick.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pick.name}</h3>
                  <span className="text-2xl font-bold text-purple-600">${pick.price}</span>
                </div>

                <p className="text-sm text-gray-600 mb-2">by {pick.stylist}</p>
                <p className="text-gray-600 mb-4">{pick.description}</p>

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
                  <p className="text-sm font-medium text-gray-900 mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {pick.items.map((item, index) => (
                      <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{pick.likes} likes</span>
                  </div>
                  <span>{pick.climate} climate</span>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
                  Shop This Look
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Stylists Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Top Stylists This Month</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topStylists.map((stylist, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                  {stylist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{stylist.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{stylist.specialization}</p>
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{stylist.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{stylist.clients} clients</p>
                {index === 0 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      👑 #1 This Month
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPicks;