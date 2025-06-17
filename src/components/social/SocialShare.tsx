import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Instagram, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialShareProps {
  ecoImpact: {
    trees: number;
    carbon: number;
    water: number;
  };
  mood?: string;
  occasion?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ ecoImpact, mood, occasion }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateShareText = () => {
    const moodText = mood ? ` while feeling ${mood}` : '';
    const occasionText = occasion ? ` for ${occasion}` : '';
    
    return `🌱 Just made a positive impact with @GAIA! I helped plant ${ecoImpact.trees} trees, saved ${ecoImpact.water}L water, and reduced ${ecoImpact.carbon}kg CO₂${moodText}${occasionText}. Shopping with purpose feels amazing! #SustainableFashion #EcoImpact #GAIA`;
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);
  const url = encodeURIComponent(window.location.origin);

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: '#', // Instagram doesn't support direct sharing, would need to copy text
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share Impact</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-6 z-50"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Share Your Eco Impact</h3>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
              {shareText}
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${platform.color} text-white p-3 rounded-lg flex items-center justify-center transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  <platform.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SocialShare;