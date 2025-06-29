import React, { useState } from 'react';
import { Sparkles, TrendingUp, Users, Leaf, Heart, Star, Filter, SlidersHorizontal, Zap, Award, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSearchBar from '../components/storefront/MoodSearchBar';
import ProductCard from '../components/storefront/ProductCard';
import ESGFilterPanel from '../components/esg/ESGFilterPanel';
import { mockProducts } from '../data/mockData';
import { Product, ESGFilters } from '../types';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [showESGFilters, setShowESGFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const { user } = useAuthStore();

  const defaultFilters: ESGFilters = {
    minSustainabilityScore: 0,
    maxCarbonFootprint: 10,
    maxWaterUsage: 200,
    requiredCertifications: [],
    preferredRegions: [],
    ethicsRating: 1
  };

  const [esgFilters, setESGFilters] = useState<ESGFilters>(
    user?.preferences?.esgFilters || defaultFilters
  );

  const isDarkMode = user?.preferences?.darkMode || false;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, esgFilters, sortBy);
  };

  const applyFilters = (query: string = searchQuery, filters: ESGFilters = esgFilters, sort: string = sortBy) => {
    let filtered = mockProducts;

    // Text search
    if (query.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.mood.some(mood => mood.toLowerCase().includes(query.toLowerCase())) ||
        query.toLowerCase().includes(product.mood.join(' ').toLowerCase())
      );
    }

    // ESG Filters
    filtered = filtered.filter(product => {
      const esg = product.esgMetadata;
      const transparency = product.transparencyIndex;

      // Sustainability score
      if (esg.sustainabilityScore < filters.minSustainabilityScore / 10) return false;

      // Carbon footprint
      if (esg.carbonFootprint > filters.maxCarbonFootprint) return false;

      // Water usage
      if (esg.waterUsage > filters.maxWaterUsage) return false;

      // Ethics rating
      if (esg.supplyChain.ethicsRating < filters.ethicsRating) return false;

      // Required certifications
      if (filters.requiredCertifications.length > 0) {
        const hasRequiredCerts = filters.requiredCertifications.every(cert =>
          esg.certifications.some(productCert => 
            productCert.toLowerCase().includes(cert.toLowerCase())
          )
        );
        if (!hasRequiredCerts) return false;
      }

      // Preferred regions
      if (filters.preferredRegions.length > 0) {
        if (!filters.preferredRegions.includes(esg.region)) return false;
      }

      return true;
    });

    // Sorting
    switch (sort) {
      case 'esg-score':
        filtered.sort((a, b) => b.transparencyIndex.overall - a.transparencyIndex.overall);
        break;
      case 'sustainability':
        filtered.sort((a, b) => b.esgMetadata.sustainabilityScore - a.esgMetadata.sustainabilityScore);
        break;
      case 'carbon-low':
        filtered.sort((a, b) => a.esgMetadata.carbonFootprint - b.esgMetadata.carbonFootprint);
        break;
      case 'water-low':
        filtered.sort((a, b) => a.esgMetadata.waterUsage - b.esgMetadata.waterUsage);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFiltersChange = (newFilters: ESGFilters) => {
    setESGFilters(newFilters);
  };

  const handleApplyFilters = () => {
    applyFilters(searchQuery, esgFilters, sortBy);
  };

  const handleResetFilters = () => {
    const resetFilters = defaultFilters;
    setESGFilters(resetFilters);
    applyFilters(searchQuery, resetFilters, sortBy);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    applyFilters(searchQuery, esgFilters, newSort);
  };

  const stats = [
    { icon: TrendingUp, label: 'Mood Matches', value: '94%', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { icon: Users, label: 'Happy Customers', value: '50K+', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { icon: Leaf, label: 'Trees Planted', value: '25K+', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { icon: Heart, label: 'Love Rate', value: '98%', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
  ];

  const moodVibes = [
    { name: 'Confident Boss', emoji: '💪', color: 'from-red-500 to-pink-500', description: 'Power moves only' },
    { name: 'Chill Luxe', emoji: '🧘‍♀️', color: 'from-blue-500 to-cyan-500', description: 'Elevated comfort' },
    { name: 'Romantic Dreamer', emoji: '💕', color: 'from-pink-500 to-rose-500', description: 'Soft & feminine' },
    { name: 'Adventure Ready', emoji: '🌍', color: 'from-green-500 to-emerald-500', description: 'Explore in style' },
    { name: 'Elegant Minimalist', emoji: '✨', color: 'from-purple-500 to-indigo-500', description: 'Less is more' },
    { name: 'Bold Statement', emoji: '🔥', color: 'from-orange-500 to-red-500', description: 'Turn heads' }
  ];

  const activeFiltersCount = 
    (esgFilters.minSustainabilityScore > 0 ? 1 : 0) +
    (esgFilters.maxCarbonFootprint < 10 ? 1 : 0) +
    (esgFilters.maxWaterUsage < 200 ? 1 : 0) +
    (esgFilters.ethicsRating > 1 ? 1 : 0) +
    esgFilters.requiredCertifications.length +
    esgFilters.preferredRegions.length;

  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-green-50'
    }`}>
            {/* Built on Bolt Badge - Fixed Position */}
      <motion.div
        className="fixed top-20 right-4 z-40"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
          >
            <Zap className="h-3 w-3 text-purple-600" />
          </motion.div>
          <span className="text-sm font-semibold">Built on Bolt</span>
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.a>
      </motion.div>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative max-w-7xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Shop Your
              </motion.span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Mood
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              variants={itemVariants}
            >
              Experience emotion-driven commerce with full ESG transparency. Shop sustainably, style consciously, and impact positively.
            </motion.p>
          </motion.div>

          {/* Mood Vibes Grid */}
          <motion.div variants={itemVariants} className="mb-12">
            <motion.h3 
              className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              variants={itemVariants}
            >
              What's your vibe today?
            </motion.h3>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-8"
              variants={containerVariants}
            >
              {moodVibes.map((vibe, index) => (
                <motion.div
                  key={vibe.name}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(vibe.name.toLowerCase())}
                  className={`cursor-pointer p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-gray-800/80 border-gray-700 hover:border-gray-600' 
                      : 'bg-white/80 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <motion.div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${vibe.color} flex items-center justify-center text-2xl`}
                    variants={pulseVariants}
                    animate="animate"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {vibe.emoji}
                  </motion.div>
                  <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {vibe.name}
                  </h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {vibe.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Mood Search Bar */}
          <motion.div variants={itemVariants} className="mb-12">
            <MoodSearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className={`p-6 text-center rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700' 
                    : `${stat.bgColor} ${stat.borderColor} border`
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                </motion.div>
                <motion.div 
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Filters and Sorting */}
      <motion.section 
        className="py-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="flex items-center space-x-4" variants={itemVariants}>
              <motion.button
                onClick={() => setShowESGFilters(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  activeFiltersCount > 0
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <motion.div
                  animate={activeFiltersCount > 0 ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </motion.div>
                <span>ESG Filters</span>
                <AnimatePresence>
                  {activeFiltersCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="relevance">Most Relevant</option>
                <option value="esg-score">Highest ESG Score</option>
                <option value="sustainability">Most Sustainable</option>
                <option value="carbon-low">Lowest Carbon Footprint</option>
                <option value="water-low">Lowest Water Usage</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </motion.select>
            </motion.div>

            <motion.div 
              className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              variants={itemVariants}
            >
              <motion.span
                key={filteredProducts.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Results Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-purple-600" />
              </motion.div>
              <motion.h2 
                className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {searchQuery ? `Results for "${searchQuery}"` : 'Sustainable Fashion Collection'}
              </motion.h2>
            </motion.div>
            <motion.p 
              className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {searchQuery 
                ? `Found ${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} matching your vibe and ESG preferences`
                : 'Discover sustainable fashion with full transparency on environmental and social impact'
              }
            </motion.p>
          </motion.div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="h-16 w-16 mx-auto" />
                </motion.div>
                <motion.h3 
                  className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  No matches found
                </motion.h3>
                <motion.p 
                  className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Try adjusting your search or ESG filters
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => handleSearch('')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Show All Products
                  </motion.button>
                  <motion.button
                    onClick={handleResetFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 border rounded-lg transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                key={filteredProducts.length}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-purple-600 to-green-600 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
              'linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
              'linear-gradient(45deg, rgba(147, 51, 234, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={itemVariants}
          >
            Ready to Transform Your Style Journey?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            variants={itemVariants}
          >
            Join GAIA and start shopping with purpose, style with intention, and impact with every purchase.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            <motion.button 
              className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
            <motion.button 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ESG Filter Panel */}
      <ESGFilterPanel
        isOpen={showESGFilters}
        onClose={() => setShowESGFilters(false)}
        filters={esgFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default Home;