import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Sparkles, ShoppingBag, Heart, MapPin, Leaf } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { moodColors } from '../../data/mockData';
import StylingAssistant from '../ai/StylingAssistant';
import toast from 'react-hot-toast';

interface StylingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const StylingModal: React.FC<StylingModalProps> = ({ isOpen, onClose, product }) => {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart!');
    onClose();
  };

  const handleStylingTip = (tip: string) => {
    toast.success('Styling tip saved!');
  };

  const pairWithItems = [
    { name: 'Silk Scarf', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', price: 45 },
    { name: 'Denim Jacket', image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400', price: 89 },
    { name: 'Ankle Boots', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', price: 125 },
    { name: 'Minimalist Necklace', image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400', price: 65 }
  ];

  const isDarkMode = user?.preferences?.darkMode || false;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className={`w-full max-w-6xl rounded-2xl shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex flex-col lg:flex-row">
              {/* Product Image */}
              <div className="lg:w-1/2 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover rounded-l-2xl"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Product Details */}
              <div className="lg:w-1/2 p-6 overflow-y-auto max-h-[600px]">
                <div className="mb-4">
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.name}
                  </h2>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.description}
                  </p>
                  
                  {/* Mood badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.mood.map((mood, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{ 
                          backgroundColor: (moodColors[mood as keyof typeof moodColors] || '#6B7280') + '20',
                          color: moodColors[mood as keyof typeof moodColors] || '#6B7280'
                        }}
                      >
                        {mood}
                      </span>
                    ))}
                  </div>

                  <div className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${product.price}
                  </div>
                </div>

                {/* AI Styling Assistant */}
                <div className="mb-6">
                  <StylingAssistant product={product} onStylingTip={handleStylingTip} />
                </div>

                {/* ESG Information */}
                <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
                      Eco Impact
                    </span>
                  </div>
                  <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-green-700'}`}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{product.esgMetadata.region}</span>
                    </div>
                    <p>💧 Saves {product.esgMetadata.waterUsage}L water</p>
                    <p>⚡ Reduces {product.esgMetadata.carbonFootprint}kg CO₂</p>
                    <p>🌿 Sustainability Score: {product.esgMetadata.sustainabilityScore}/10</p>
                    {product.esgMetadata.materials && (
                      <p>🧵 Materials: {product.esgMetadata.materials.join(', ')}</p>
                    )}
                  </div>
                </div>

                {/* Styling Tips */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Styling Tips
                    </span>
                  </div>
                  <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.stylingTips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                    {product.aiGeneratedTips && product.aiGeneratedTips.map((tip, index) => (
                      <li key={`ai-${index}`} className="flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>• {tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pair With Section */}
                <div className="mb-6">
                  <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Complete the look...
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {pairWithItems.slice(0, 4).map((item, index) => (
                      <div key={index} className={`border rounded-lg p-2 hover:bg-gray-50 transition-colors ${
                        isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200'
                      }`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-16 object-cover rounded mb-2"
                        />
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ${item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className={`flex-1 border py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}>
                    <Heart className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default StylingModal;