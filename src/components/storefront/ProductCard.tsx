import React, { useState } from 'react';
import { ShoppingBag, Heart, Sparkles, Leaf, MapPin, Plus, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { moodColors } from '../../data/mockData';
import StylingModal from './StylingModal';
import WishlistModal from './WishlistModal';
import ESGRatingCard from '../esg/ESGRatingCard';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showStylingModal, setShowStylingModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showESGDetails, setShowESGDetails] = useState(false);

  const isInWishlist = wishlistItems.some(item => item.product.id === product.id);
  const isDarkMode = user?.preferences?.darkMode || false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success('Added to cart!');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    setShowWishlistModal(true);
  };

  const handleProductClick = () => {
    setShowStylingModal(true);
  };

  const handleESGClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowESGDetails(true);
  };

  const primaryMood = product.mood[0];
  const moodColor = moodColors[primaryMood as keyof typeof moodColors] || '#6B7280';

  const getESGBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-400';
    if (score >= 60) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <>
      <motion.div
        className={`group relative rounded-2xl shadow-md overflow-hidden cursor-pointer transition-all duration-500 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
        whileHover={{ 
          scale: 1.02,
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Overlay with actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute top-4 right-4 space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    onClick={handleWishlistClick}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                      isInWishlist 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isInWishlist ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 px-4 rounded-xl font-medium transition-all hover:bg-white flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mood badges */}
          <motion.div 
            className="absolute top-4 left-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-1">
              {product.mood.slice(0, 2).map((mood, index) => (
                <motion.span
                  key={index}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm"
                  style={{ color: moodColors[mood as keyof typeof moodColors] || '#6B7280' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {mood}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* ESG Score Badge */}
          <motion.div 
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <motion.button
              onClick={handleESGClick}
              className={`px-2 py-1 text-white text-xs font-medium rounded-full flex items-center space-x-1 ${
                getESGBadgeColor(product.transparencyIndex.overall)
              }`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Award className="h-3 w-3" />
              <span>ESG {product.transparencyIndex.overall}</span>
            </motion.button>
          </motion.div>

          {/* AI-Generated Badge */}
          {product.aiGeneratedTips && (
            <motion.div 
              className="absolute bottom-4 left-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.span 
                className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center space-x-1"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(147, 51, 234, 0.7)',
                    '0 0 0 10px rgba(147, 51, 234, 0)',
                    '0 0 0 0 rgba(147, 51, 234, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-3 w-3" />
                <span>AI Styled</span>
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <motion.div 
          className="p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h3 
            className={`font-semibold mb-1 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            whileHover={{ color: moodColor }}
            transition={{ duration: 0.2 }}
          >
            {product.name}
          </motion.h3>
          <p className={`text-sm mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.description}
          </p>
          
          {/* Price and ESG info */}
          <motion.div 
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span 
              className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              whileHover={{ scale: 1.05 }}
            >
              ${product.price}
            </motion.span>
            <motion.div 
              className="flex items-center space-x-1 text-green-600"
              whileHover={{ scale: 1.05 }}
            >
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">
                {product.esgMetadata.sustainabilityScore}/10
              </span>
            </motion.div>
          </motion.div>

          {/* ESG Compact Rating */}
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ESGRatingCard product={product} compact={true} />
          </motion.div>

          {/* ESG Impact */}
          <motion.div 
            className="space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              whileHover={{ x: 2 }}
            >
              <MapPin className="h-3 w-3" />
              <span>{product.esgMetadata.region}</span>
            </motion.div>
            <motion.div 
              className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              whileHover={{ x: 2 }}
            >
              <Sparkles className="h-3 w-3" />
              <span>Saves {product.esgMetadata.waterUsage}L water</span>
            </motion.div>
            {product.esgMetadata.materials && (
              <motion.div 
                className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                whileHover={{ x: 2 }}
              >
                <Leaf className="h-3 w-3" />
                <span>{product.esgMetadata.materials.slice(0, 2).join(', ')}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Certifications */}
          <motion.div 
            className="mt-2 flex flex-wrap gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {product.esgMetadata.certifications.slice(0, 3).map((cert, index) => (
              <motion.span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.8, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                {cert}
              </motion.span>
            ))}
            {product.esgMetadata.certifications.length > 3 && (
              <motion.span 
                className={`px-2 py-1 text-xs font-medium rounded ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
              >
                +{product.esgMetadata.certifications.length - 3} more
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <StylingModal
        isOpen={showStylingModal}
        onClose={() => setShowStylingModal(false)}
        product={product}
      />

      <WishlistModal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        product={product}
      />

      {/* ESG Details Modal */}
      <AnimatePresence>
        {showESGDetails && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex items-center justify-between p-6 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ESG Transparency Report - {product.name}
                </h2>
                <motion.button
                  onClick={() => setShowESGDetails(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </motion.button>
              </div>
              <div className="p-6">
                <ESGRatingCard product={product} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;