import React, { useState } from 'react';
import { Heart, Filter, Grid, List, Trash2, ShoppingBag, Calendar } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { moodColors } from '../data/mockData';
import toast from 'react-hot-toast';

const Wishlist: React.FC = () => {
  const { user } = useAuthStore();
  const { items, removeFromWishlist, getItemsByMood } = useWishlistStore();
  const { addItem } = useCartStore();
  const [selectedMood, setSelectedMood] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const moods = ['all', 'elegant', 'confident', 'calm', 'romantic', 'adventurous', 'bold', 'casual'];
  
  const filteredItems = selectedMood === 'all' 
    ? items 
    : getItemsByMood(selectedMood);

  const groupedByMood = items.reduce((acc, item) => {
    if (!acc[item.mood]) {
      acc[item.mood] = [];
    }
    acc[item.mood].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleAddToCart = (item: any) => {
    addItem(item.product);
    toast.success('Added to cart!');
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    toast.success('Removed from wishlist');
  };

  const isDarkMode = user?.preferences?.darkMode || false;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h2>
          <p className="text-gray-600">Save your favorite items and organize them by mood</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {items.length} items saved across {Object.keys(groupedByMood).length} moods
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mood Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood === 'all' ? 'All Moods' : mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mood Summary */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(groupedByMood).map(([mood, moodItems]) => (
              <span
                key={mood}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: (moodColors[mood as keyof typeof moodColors] || '#6B7280') + '20',
                  color: moodColors[mood as keyof typeof moodColors] || '#6B7280'
                }}
              >
                {mood} ({moodItems.length})
              </span>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">
              Start adding items you love and organize them by mood
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        )}

        {/* Filtered Empty State */}
        {items.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found for "{selectedMood}" mood
            </h3>
            <p className="text-gray-600">Try selecting a different mood or browse all items</p>
          </div>
        )}

        {/* Wishlist Items */}
        {filteredItems.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  <div className="absolute top-2 left-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: (moodColors[item.mood as keyof typeof moodColors] || '#6B7280') + '20',
                        color: moodColors[item.mood as keyof typeof moodColors] || '#6B7280'
                      }}
                    >
                      {item.mood}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.product.name}
                  </h3>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.product.description}
                  </p>
                  
                  {item.occasion && (
                    <div className={`flex items-center space-x-1 text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{item.occasion}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className={`text-sm italic mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      "{item.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${item.product.price}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mood-based Recommendations */}
        {selectedMood !== 'all' && filteredItems.length > 0 && (
          <div className={`mt-12 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
              More {selectedMood} vibes you might love
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-purple-700'}`}>
              Based on your {selectedMood} wishlist items, we think you'd love these similar pieces.
            </p>
            <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Discover More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;