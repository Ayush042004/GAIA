import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Plus, X, Sparkles, Shirt, Eye, Trash2, Tag, Search, Filter, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useWardrobeStore } from '../../store/wardrobeStore';
import { WardrobeItem, WardrobeCategory } from '../../types';
import toast from 'react-hot-toast';

interface PreviewItem {
  id: string;
  file: File;
  imageUrl: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  brand: string;
  style: string;
  season: string;
  tags: string[];
  mood: string[];
  price?: number;
  notes?: string;
}

const VirtualWardrobe: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    items, 
    addItem, 
    removeItem, 
    getItemsByCategory, 
    getItemsByMood,
    generateOutfitRecommendations 
  } = useWardrobeStore();
  
  const [selectedCategory, setSelectedCategory] = useState<WardrobeCategory | 'all'>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'photo' | 'brand'>('photo');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [newTag, setNewTag] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isDarkMode = user?.preferences?.darkMode || false;

  const categories: { id: WardrobeCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'All Items', icon: '👗' },
    { id: 'tops', name: 'Tops', icon: '👕' },
    { id: 'bottoms', name: 'Bottoms', icon: '👖' },
    { id: 'dresses', name: 'Dresses', icon: '👗' },
    { id: 'outerwear', name: 'Outerwear', icon: '🧥' },
    { id: 'shoes', name: 'Shoes', icon: '👠' },
    { id: 'accessories', name: 'Accessories', icon: '👜' }
  ];

  const moods = ['all', 'casual', 'professional', 'elegant', 'sporty', 'party', 'romantic'];
  const colors = ['black', 'white', 'blue', 'red', 'green', 'gray', 'brown', 'pink', 'purple', 'yellow', 'orange'];
  const styles = ['casual', 'formal', 'sporty', 'bohemian', 'vintage', 'modern', 'classic', 'trendy'];
  const seasons = ['spring', 'summer', 'fall', 'winter', 'all-season'];

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('wardrobeItems');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        parsedItems.forEach((item: WardrobeItem) => {
          if (!items.find(existingItem => existingItem.id === item.id)) {
            addItem(item);
          }
        });
      } catch (error) {
        console.error('Error loading wardrobe items:', error);
      }
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('wardrobeItems', JSON.stringify(items));
    }
  }, [items]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    const newPreviewItems: PreviewItem[] = [];
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalysis = {
        category: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'][Math.floor(Math.random() * 6)] as WardrobeCategory,
        color: colors[Math.floor(Math.random() * colors.length)],
        style: styles[Math.floor(Math.random() * styles.length)],
        brand: 'Unknown',
        season: seasons[Math.floor(Math.random() * seasons.length)]
      };

      const previewItem: PreviewItem = {
        id: Date.now().toString() + i,
        file,
        imageUrl,
        name: `${mockAnalysis.style} ${mockAnalysis.category}`,
        category: mockAnalysis.category,
        color: mockAnalysis.color,
        brand: mockAnalysis.brand,
        style: mockAnalysis.style,
        season: mockAnalysis.season,
        tags: [mockAnalysis.style, mockAnalysis.color],
        mood: [mockAnalysis.style === 'formal' ? 'professional' : 'casual']
      };

      newPreviewItems.push(previewItem);
    }

    setPreviewItems(newPreviewItems);
    setCurrentPreviewIndex(0);
    setIsAnalyzing(false);
    setShowUploadModal(false);
    setShowPreviewModal(true);
  };

  const handleSaveCurrentItem = () => {
    const currentItem = previewItems[currentPreviewIndex];
    if (!currentItem) return;

    const wardrobeItem: WardrobeItem = {
      id: currentItem.id,
      name: currentItem.name,
      category: currentItem.category,
      color: currentItem.color,
      brand: currentItem.brand,
      style: currentItem.style,
      season: currentItem.season,
      image: currentItem.imageUrl,
      dateAdded: new Date().toISOString(),
      wearCount: 0,
      lastWorn: null,
      tags: currentItem.tags,
      mood: currentItem.mood,
      price: currentItem.price,
      notes: currentItem.notes
    };

    addItem(wardrobeItem);
    toast.success(`${currentItem.name} added to wardrobe!`);

    // Move to next item or close modal
    if (currentPreviewIndex < previewItems.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    } else {
      setShowPreviewModal(false);
      setPreviewItems([]);
      setCurrentPreviewIndex(0);
    }
  };

  const handleSkipItem = () => {
    if (currentPreviewIndex < previewItems.length - 1) {
      setCurrentPreviewIndex(currentPreviewIndex + 1);
    } else {
      setShowPreviewModal(false);
      setPreviewItems([]);
      setCurrentPreviewIndex(0);
    }
  };

  const updatePreviewItem = (field: keyof PreviewItem, value: any) => {
    setPreviewItems(prev => prev.map((item, index) => 
      index === currentPreviewIndex ? { ...item, [field]: value } : item
    ));
  };

  const addTag = () => {
    if (newTag.trim() && previewItems[currentPreviewIndex]) {
      const currentTags = previewItems[currentPreviewIndex].tags;
      if (!currentTags.includes(newTag.trim())) {
        updatePreviewItem('tags', [...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = previewItems[currentPreviewIndex].tags;
    updatePreviewItem('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const moodMatch = selectedMood === 'all' || item.mood.includes(selectedMood);
    const searchMatch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && moodMatch && searchMatch;
  });

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
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Shirt className="h-8 w-8 text-purple-600" />
                </motion.div>
                <h1 className="text-3xl font-bold">Virtual Wardrobe</h1>
              </div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-powered closet sync with smart styling recommendations
              </p>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                onClick={() => setShowRecommendations(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>Get Outfit Ideas</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Items</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Total Items', value: items.length, icon: '👗' },
            { label: 'Most Worn', value: items.reduce((max, item) => Math.max(max, item.wearCount), 0), icon: '⭐' },
            { label: 'Categories', value: new Set(items.map(item => item.category)).size, icon: '📂' },
            { label: 'Brands', value: new Set(items.map(item => item.brand)).size, icon: '🏷️' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className={`p-6 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your wardrobe..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as WardrobeCategory | 'all')}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* Mood Filter */}
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood === 'all' ? 'All Moods' : mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </motion.div>

        {/* Wardrobe Items */}
        {filteredItems.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {items.length === 0 ? 'Your wardrobe is empty' : 'No items match your filters'}
            </h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {items.length === 0 
                ? 'Start by uploading photos of your clothes or syncing with your favorite brands'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            <motion.button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Items
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' 
              : 'space-y-4'
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ${viewMode === 'list' ? 'flex' : ''}`}
                whileHover={{ scale: 1.02, y: -5 }}
                custom={index}
              >
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => removeItem(item.id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </motion.button>
                    </div>
                    
                    {viewMode === 'grid' && (
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <motion.button
                            className="flex-1 bg-white/90 text-gray-900 py-1 px-2 rounded text-xs font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-3 w-3 inline mr-1" />
                            View
                          </motion.button>
                          <motion.button
                            className="flex-1 bg-purple-600 text-white py-1 px-2 rounded text-xs font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Sparkles className="h-3 w-3 inline mr-1" />
                            Style
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wear Count Badge */}
                  {item.wearCount > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.wearCount}x worn
                    </div>
                  )}
                </div>

                <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className={`font-medium text-sm mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.brand} • {item.color}
                  </p>
                  
                  {viewMode === 'list' && (
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.category} • {item.style}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.season}
                      </span>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, viewMode === 'list' ? 4 : 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > (viewMode === 'list' ? 4 : 2) && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        +{item.tags.length - (viewMode === 'list' ? 4 : 2)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`w-full max-w-md rounded-2xl shadow-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Add to Wardrobe
                    </h3>
                    <motion.button
                      onClick={() => setShowUploadModal(false)}
                      className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Upload Method Toggle */}
                  <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setUploadMethod('photo')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        uploadMethod === 'photo'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Upload Photos
                    </button>
                    <button
                      onClick={() => setUploadMethod('brand')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        uploadMethod === 'brand'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Sync Brands
                    </button>
                  </div>

                  {uploadMethod === 'photo' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">Upload Files</span>
                          <span className="text-xs text-gray-500">JPG, PNG up to 10MB</span>
                        </motion.button>

                        <motion.button
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Camera className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">Take Photo</span>
                          <span className="text-xs text-gray-500">Use camera</span>
                        </motion.button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />

                      {isAnalyzing && (
                        <motion.div 
                          className="text-center py-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                          >
                            <Sparkles className="h-6 w-6 text-purple-600" />
                          </motion.div>
                          <p className="mt-2 text-sm text-gray-600">AI analyzing your items...</p>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Connect your favorite brands to automatically sync your purchases:
                      </p>
                      
                      <div className="space-y-3">
                        {['Zara', 'H&M', 'Nike', 'Adidas', 'Uniqlo'].map((brand) => (
                          <motion.button
                            key={brand}
                            className={`w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="font-medium">{brand}</span>
                            <span className="text-sm text-gray-500">Connect</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && previewItems.length > 0 && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Preview & Edit Item
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Item {currentPreviewIndex + 1} of {previewItems.length}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        setShowPreviewModal(false);
                        setPreviewItems([]);
                        setCurrentPreviewIndex(0);
                      }}
                      className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {previewItems[currentPreviewIndex] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Image Preview */}
                      <div>
                        <img
                          src={previewItems[currentPreviewIndex].imageUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>

                      {/* Edit Form */}
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={previewItems[currentPreviewIndex].name}
                            onChange={(e) => updatePreviewItem('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Category
                            </label>
                            <select
                              value={previewItems[currentPreviewIndex].category}
                              onChange={(e) => updatePreviewItem('category', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {categories.slice(1).map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Color
                            </label>
                            <select
                              value={previewItems[currentPreviewIndex].color}
                              onChange={(e) => updatePreviewItem('color', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {colors.map(color => (
                                <option key={color} value={color}>
                                  {color.charAt(0).toUpperCase() + color.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Brand
                            </label>
                            <input
                              type="text"
                              value={previewItems[currentPreviewIndex].brand}
                              onChange={(e) => updatePreviewItem('brand', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Style
                            </label>
                            <select
                              value={previewItems[currentPreviewIndex].style}
                              onChange={(e) => updatePreviewItem('style', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {styles.map(style => (
                                <option key={style} value={style}>
                                  {style.charAt(0).toUpperCase() + style.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Season
                          </label>
                          <select
                            value={previewItems[currentPreviewIndex].season}
                            onChange={(e) => updatePreviewItem('season', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                          >
                            {seasons.map(season => (
                              <option key={season} value={season}>
                                {season.charAt(0).toUpperCase() + season.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {previewItems[currentPreviewIndex].tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
                                  className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addTag()}
                              placeholder="Add tag..."
                              className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-700 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
                              }`}
                            />
                            <button
                              onClick={addTag}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Price (optional)
                          </label>
                          <input
                            type="number"
                            value={previewItems[currentPreviewIndex].price || ''}
                            onChange={(e) => updatePreviewItem('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSkipItem}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleSaveCurrentItem}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Item</span>
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {currentPreviewIndex + 1} of {previewItems.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VirtualWardrobe;