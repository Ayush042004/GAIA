import React, { useState } from 'react';
import { Filter, X, Sliders, Award, MapPin, Droplets, Wind, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ESGFilters } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { esgCertifications } from '../../data/mockData';

interface ESGFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ESGFilters;
  onFiltersChange: (filters: ESGFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const ESGFilterPanel: React.FC<ESGFilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const { user } = useAuthStore();
  const isDarkMode = user?.preferences?.darkMode || false;

  const regions = [
    'Karnataka, India',
    'California, USA',
    'Mexico City, Mexico',
    'Oregon, USA',
    'Scotland, UK',
    'Tamil Nadu, India'
  ];

  const handleSliderChange = (key: keyof ESGFilters, value: number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleCertificationToggle = (certId: string) => {
    const updatedCerts = filters.requiredCertifications.includes(certId)
      ? filters.requiredCertifications.filter(id => id !== certId)
      : [...filters.requiredCertifications, certId];
    
    onFiltersChange({
      ...filters,
      requiredCertifications: updatedCerts
    });
  };

  const handleRegionToggle = (region: string) => {
    const updatedRegions = filters.preferredRegions.includes(region)
      ? filters.preferredRegions.filter(r => r !== region)
      : [...filters.preferredRegions, region];
    
    onFiltersChange({
      ...filters,
      preferredRegions: updatedRegions
    });
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.div 
              className={`sticky top-0 flex items-center justify-between p-6 border-b ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Filter className="h-6 w-6 text-green-600" />
                </motion.div>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ESG Filters
                </h2>
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
            </motion.div>

            <motion.div 
              className="p-6 space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Sustainability Score */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Minimum Sustainability Score
                  </label>
                </div>
                <div className="space-y-2">
                  <motion.input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minSustainabilityScore}
                    onChange={(e) => handleSliderChange('minSustainabilityScore', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <motion.span 
                      className="font-medium text-green-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      key={filters.minSustainabilityScore}
                    >
                      {filters.minSustainabilityScore}
                    </motion.span>
                    <span>100</span>
                  </div>
                </div>
              </motion.div>

              {/* Carbon Footprint */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Wind className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Maximum Carbon Footprint (kg CO₂)
                  </label>
                </div>
                <div className="space-y-2">
                  <motion.input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.maxCarbonFootprint}
                    onChange={(e) => handleSliderChange('maxCarbonFootprint', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <motion.span 
                      className="font-medium text-blue-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      key={filters.maxCarbonFootprint}
                    >
                      {filters.maxCarbonFootprint}kg
                    </motion.span>
                    <span>10kg</span>
                  </div>
                </div>
              </motion.div>

              {/* Water Usage */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Droplets className="h-5 w-5 text-cyan-600" />
                  </motion.div>
                  <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Maximum Water Usage (L)
                  </label>
                </div>
                <div className="space-y-2">
                  <motion.input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.maxWaterUsage}
                    onChange={(e) => handleSliderChange('maxWaterUsage', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0L</span>
                    <motion.span 
                      className="font-medium text-cyan-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      key={filters.maxWaterUsage}
                    >
                      {filters.maxWaterUsage}L
                    </motion.span>
                    <span>200L</span>
                  </div>
                </div>
              </motion.div>

              {/* Ethics Rating */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <Shield className="h-5 w-5 text-purple-600" />
                  </motion.div>
                  <label className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Minimum Ethics Rating
                  </label>
                </div>
                <div className="space-y-2">
                  <motion.input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={filters.ethicsRating}
                    onChange={(e) => handleSliderChange('ethicsRating', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1</span>
                    <motion.span 
                      className="font-medium text-purple-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      key={filters.ethicsRating}
                    >
                      {filters.ethicsRating}/10
                    </motion.span>
                    <span>10</span>
                  </div>
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div variants={itemVariants}>
                <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Required Certifications
                </h3>
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                >
                  {esgCertifications.map((cert, index) => (
                    <motion.label
                      key={cert.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        filters.requiredCertifications.includes(cert.id)
                          ? 'border-green-500 bg-green-50'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.input
                        type="checkbox"
                        checked={filters.requiredCertifications.includes(cert.id)}
                        onChange={() => handleCertificationToggle(cert.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <div className={`font-medium ${
                          filters.requiredCertifications.includes(cert.id)
                            ? 'text-green-900'
                            : isDarkMode
                              ? 'text-white'
                              : 'text-gray-900'
                        }`}>
                          {cert.name}
                        </div>
                        <div className={`text-xs ${
                          filters.requiredCertifications.includes(cert.id)
                            ? 'text-green-700'
                            : isDarkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                        }`}>
                          {cert.description}
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              </motion.div>

              {/* Preferred Regions */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </motion.div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Preferred Regions
                  </h3>
                </div>
                <motion.div 
                  className="space-y-2"
                  variants={containerVariants}
                >
                  {regions.map((region, index) => (
                    <motion.label
                      key={region}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        filters.preferredRegions.includes(region)
                          ? 'border-orange-500 bg-orange-50'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.input
                        type="checkbox"
                        checked={filters.preferredRegions.includes(region)}
                        onChange={() => handleRegionToggle(region)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className={`${
                        filters.preferredRegions.includes(region)
                          ? 'text-orange-900 font-medium'
                          : isDarkMode
                            ? 'text-white'
                            : 'text-gray-900'
                      }`}>
                        {region}
                      </span>
                    </motion.label>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className={`sticky bottom-0 flex space-x-3 p-6 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={onResetFilters}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset Filters
              </motion.button>
              <motion.button
                onClick={() => {
                  onApplyFilters();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ESGFilterPanel;