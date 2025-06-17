import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Heart, Calendar, MessageSquare } from 'lucide-react';
import { Product } from '../../types';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { moodColors } from '../../data/mockData';
import toast from 'react-hot-toast';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, product }) => {
  const { addToWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const [selectedMood, setSelectedMood] = useState(product.mood[0] || 'elegant');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');

  const moods = ['elegant', 'confident', 'calm', 'romantic', 'adventurous', 'bold', 'casual', 'professional'];

  const handleSaveToWishlist = () => {
    addToWishlist(product, selectedMood, occasion || undefined, notes || undefined);
    toast.success(`Added to ${selectedMood} wishlist!`);
    onClose();
    
    // Reset form
    setSelectedMood(product.mood[0] || 'elegant');
    setOccasion('');
    setNotes('');
  };

  const isDarkMode = user?.preferences?.darkMode || false;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`w-full max-w-md rounded-2xl shadow-xl ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-pink-600" />
                <Dialog.Title className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Save to Wishlist
                </Dialog.Title>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Preview */}
            <div className={`flex items-center space-x-3 p-3 rounded-lg mb-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ${product.price}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Mood Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Save under mood:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedMood === mood
                          ? 'border-pink-500 bg-pink-50'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: moodColors[mood as keyof typeof moodColors] || '#6B7280' }}
                        />
                        <span className={`font-medium capitalize ${
                          selectedMood === mood 
                            ? 'text-pink-900' 
                            : isDarkMode 
                              ? 'text-white' 
                              : 'text-gray-900'
                        }`}>
                          {mood}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Occasion (optional)
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g., Date night, Work presentation, Weekend getaway..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Why do you love this piece? Any styling ideas?"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveToWishlist}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Save to Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default WishlistModal;