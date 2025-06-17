import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Heart, Sparkles, Calendar, MapPin } from 'lucide-react';

interface EmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (emotion: string, occasion: string) => void;
  totalAmount: number;
}

const EmotionModal: React.FC<EmotionModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  totalAmount 
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [occasion, setOccasion] = useState('');

  const emotions = [
    { id: 'excited', label: 'Excited', emoji: '🎉', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'confident', label: 'Confident', emoji: '💪', color: 'bg-red-100 text-red-800' },
    { id: 'peaceful', label: 'Peaceful', emoji: '🧘‍♀️', color: 'bg-green-100 text-green-800' },
    { id: 'romantic', label: 'Romantic', emoji: '💕', color: 'bg-pink-100 text-pink-800' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🌍', color: 'bg-blue-100 text-blue-800' },
    { id: 'elegant', label: 'Elegant', emoji: '✨', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleComplete = () => {
    if (selectedEmotion) {
      onComplete(selectedEmotion, occasion);
    }
  };

  const ecoImpact = (totalAmount * 0.02).toFixed(1);
  const treesPlanted = Math.floor(totalAmount / 50);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                How are you feeling about this purchase?
              </Dialog.Title>
              <p className="mt-2 text-sm text-gray-600">
                Help us personalize your experience and create your emotional memory
              </p>
            </div>

            <div className="space-y-6">
              {/* Emotion Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose your vibe:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.id}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedEmotion === emotion.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{emotion.emoji}</span>
                        <span className="font-medium">{emotion.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  What's the occasion? (optional)
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g., Date night, Work presentation, Weekend getaway..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Eco Impact Preview */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Your Eco Impact</span>
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Restoring {ecoImpact}m² forest in Meghalaya, India</span>
                  </div>
                  {treesPlanted > 0 && (
                    <p>🌳 Planting {treesPlanted} tree{treesPlanted > 1 ? 's' : ''}</p>
                  )}
                  <p>💧 Saving ~{Math.floor(totalAmount * 0.5)} liters of water</p>
                  <p>⚡ Reducing {Math.floor(totalAmount * 0.1)}kg CO₂</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!selectedEmotion}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Complete Order
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EmotionModal;