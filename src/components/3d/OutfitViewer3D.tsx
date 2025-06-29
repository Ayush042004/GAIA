import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar3D, Lighting } from './Avatar3D';
import { RotateCcw, ZoomIn, ZoomOut, Rotate3D as RotateLeft, Rotate3D as RotateRight, User, Users } from 'lucide-react';

interface OutfitViewer3DProps {
  selectedOutfit?: {
    id: string;
    name: string;
    category: string;
    mood: string[];
    items: string[];
  };
  onClose: () => void;
  isDarkMode?: boolean;
}

const OutfitViewer3D: React.FC<OutfitViewer3DProps> = ({ 
  selectedOutfit, 
  onClose, 
  isDarkMode = false 
}) => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 2, 5]);
  const [autoRotate, setAutoRotate] = useState(true);

  // Convert outfit to 3D outfit data
  const convertToOutfitData = (outfit: any) => {
    if (!outfit) return {};
    
    const moodToStyle = {
      elegant: 'elegant',
      confident: 'confident', 
      casual: 'casual',
      professional: 'professional',
      romantic: 'romantic',
      adventurous: 'adventurous'
    };

    const primaryMood = outfit.mood[0];
    const style = moodToStyle[primaryMood as keyof typeof moodToStyle] || 'casual';

    return {
      top: style,
      bottom: style,
      shoes: style,
      accessories: [style]
    };
  };

  const outfitData = convertToOutfitData(selectedOutfit);

  const handleReset = () => {
    setCameraPosition([0, 2, 5]);
    setAutoRotate(true);
  };

  const handleZoomIn = () => {
    setCameraPosition(prev => [prev[0], prev[1], Math.max(prev[2] - 1, 2)]);
  };

  const handleZoomOut = () => {
    setCameraPosition(prev => [prev[0], prev[1], Math.min(prev[2] + 1, 10)]);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              3D Outfit Preview
            </h2>
            {selectedOutfit && (
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedOutfit.name} - {selectedOutfit.category}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Gender Toggle */}
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <motion.button
                onClick={() => setSelectedGender('female')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedGender === 'female'
                    ? 'bg-pink-500 text-white shadow-lg'
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedGender === 'male'
                    ? 'bg-blue-500 text-white shadow-lg'
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

            <motion.button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex h-full">
          {/* 3D Viewer */}
          <div className="flex-1 relative">
            <Canvas
              camera={{ position: cameraPosition, fov: 50 }}
              shadows
              className="w-full h-full"
            >
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
                  outfit={outfitData}
                  position={[0, 0, 0]}
                  isSelected={true}
                  onClick={() => {}}
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={autoRotate}
                  autoRotateSpeed={2}
                  minDistance={2}
                  maxDistance={10}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI - Math.PI / 6}
                />
              </Suspense>
            </Canvas>

            {/* 3D Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
              <motion.button
                onClick={handleZoomIn}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Zoom In"
              >
                <ZoomIn className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                onClick={handleZoomOut}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Zoom Out"
              >
                <ZoomOut className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  autoRotate
                    ? 'bg-green-500 text-white'
                    : isDarkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={autoRotate ? "Stop Auto Rotate" : "Start Auto Rotate"}
              >
                <RotateRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                onClick={handleReset}
                className={`p-3 rounded-full shadow-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Reset View"
              >
                <RotateCcw className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Loading indicator */}
            <div className="absolute top-4 right-4">
              <motion.div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-gray-800 text-green-400' : 'bg-green-100 text-green-800'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                3D Model Ready
              </motion.div>
            </div>
          </div>

          {/* Outfit Details Sidebar */}
          {selectedOutfit && (
            <motion.div
              className={`w-80 p-6 border-l ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Outfit Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Style Name
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedOutfit.name}
                  </p>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedOutfit.category}
                  </p>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mood
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOutfit.mood.map((mood, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Includes
                  </h4>
                  <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedOutfit.items.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Model
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Currently showing on {selectedGender} model
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <motion.button
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Shop This Look
                </motion.button>
                
                <motion.button
                  className={`w-full border py-3 px-4 rounded-lg transition-colors font-medium ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save to Wishlist
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutfitViewer3D;