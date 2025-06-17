import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, ShoppingBag, Sparkles, Plus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WardrobeItem, Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { mockProducts } from '../../data/mockData';
import toast from 'react-hot-toast';

interface CompleteTheLookModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItems: WardrobeItem[];
  occasion?: string;
  mood?: string;
}

const CompleteTheLookModal: React.FC<CompleteTheLookModalProps> = ({
  isOpen,
  onClose,
  wardrobeItems,
  occasion,
  mood
}) => {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'missing'>('recommendations');

  const isDarkMode = user?.preferences?.darkMode || false;

  // Generate AI recommendations based on wardrobe items
  const generateRecommendations = (): Product[] => {
    // Mock AI logic - in real implementation, this would use ML models
    const categories = wardrobeItems.map(item => item.category);
    const colors = wardrobeItems.map(item => item.color);
    const styles = wardrobeItems.map(item => item.style);

    // Filter products that complement the wardrobe items
    return mockProducts.filter(product => {
      // Complement missing categories
      const hasCategory = categories.includes(product.category as any);
      
      // Match mood if specified
      const moodMatch = !mood || product.mood.includes(mood);
      
      // Color coordination (simplified)
      const colorMatch = colors.some(color => 
        ['black', 'white', 'gray', 'navy'].includes(color.toLowerCase()) ||
        ['black', 'white', 'gray', 'navy'].includes(product.esgMetadata.materials.join(' ').toLowerCase())
      );

      return !hasCategory && moodMatch && (colorMatch || Math.random() > 0.5);
    }).slice(0, 6);
  };

  const recommendations = generateRecommendations();

  const missingCategories = [
    { category: 'accessories', items: ['Statement Necklace', 'Silk Scarf', 'Leather Belt'] },
    { category: 'shoes', items: ['Ankle Boots', 'Classic Pumps', 'White Sneakers'] },
    { category: 'outerwear', items: ['Blazer', 'Denim Jacket', 'Trench Coat'] }
  ].filter(cat => !wardrobeItems.some(item => item.category === cat.category));

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success('Added to cart!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className={`w-full max-w-6xl rounded-2xl shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div>
                <Dialog.Title className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Complete the Look
                </Dialog.Title>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  AI-powered recommendations based on your wardrobe
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Current Outfit */}
            <div className="p-6 border-b border-gray-200">
              <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Current Outfit
              </h3>
              <div className="flex space-x-4 overflow-x-auto">
                {wardrobeItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedTab('recommendations')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === 'recommendations'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Recommendations ({recommendations.length})
              </button>
              <button
                onClick={() => setSelectedTab('missing')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === 'missing'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Missing Pieces ({missingCategories.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {selectedTab === 'recommendations' ? (
                  <motion.div
                    key="recommendations"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {recommendations.length === 0 ? (
                      <div className="text-center py-12">
                        <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          No recommendations available
                        </h3>
                        <p className={`text-gray-500`}>
                          Add more items to your wardrobe to get better recommendations
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((product, index) => (
                          <motion.div
                            key={product.id}
                            variants={itemVariants}
                            className={`group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                            whileHover={{ scale: 1.02, y: -5 }}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                                  <Sparkles className="h-3 w-3" />
                                  <span>AI Pick</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {product.name}
                              </h4>
                              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                ${product.price}
                              </p>
                              <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Complements your {wardrobeItems[0]?.name.toLowerCase()}
                              </p>
                              
                              <div className="flex space-x-2">
                                <motion.button
                                  onClick={() => handleAddToCart(product)}
                                  className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ShoppingBag className="h-3 w-3" />
                                  <span>Add to Cart</span>
                                </motion.button>
                                <motion.button
                                  className={`p-2 border rounded-lg transition-colors ${
                                    isDarkMode 
                                      ? 'border-gray-600 hover:bg-gray-600' 
                                      : 'border-gray-300 hover:bg-gray-100'
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Heart className="h-3 w-3" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="missing"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {missingCategories.length === 0 ? (
                      <div className="text-center py-12">
                        <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Your outfit is complete!
                        </h3>
                        <p className="text-gray-500">
                          You have all the essential pieces for this look
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {missingCategories.map((category, index) => (
                          <motion.div
                            key={category.category}
                            variants={itemVariants}
                            className={`p-4 rounded-xl ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <h4 className={`font-medium mb-3 capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Missing: {category.category}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {category.items.map((item, itemIndex) => (
                                <motion.div
                                  key={item}
                                  className={`p-3 rounded-lg border border-dashed transition-colors hover:border-purple-500 cursor-pointer ${
                                    isDarkMode 
                                      ? 'border-gray-600 hover:bg-gray-600' 
                                      : 'border-gray-300 hover:bg-white'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIndex * 0.1 }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {item}
                                    </span>
                                    <Plus className="h-4 w-4 text-purple-500" />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default CompleteTheLookModal;