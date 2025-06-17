import React, { useState } from 'react';
import { Sparkles, Wand2, Palette, TrendingUp } from 'lucide-react';
import { Product } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface StylingAssistantProps {
  product: Product;
  onStylingTip: (tip: string) => void;
}

const StylingAssistant: React.FC<StylingAssistantProps> = ({ product, onStylingTip }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTips, setGeneratedTips] = useState<string[]>([]);
  const { user } = useAuthStore();

  const generateStylingTips = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const tips = [
        `For ${product.name}, try pairing with neutral accessories to let the piece shine`,
        `This ${product.category} works beautifully with layered jewelry for an elevated look`,
        `Consider adding a structured blazer to transition this piece from day to night`,
        `The ${product.mood.join(' and ')} vibe pairs perfectly with minimalist footwear`,
        `For a sustainable styling approach, mix this with pieces you already own`
      ];
      
      setGeneratedTips(tips);
      setIsGenerating(false);
    }, 2000);
  };

  const moodStylingAdvice = {
    elegant: "Focus on clean lines and sophisticated accessories",
    confident: "Add bold statement pieces and structured silhouettes",
    calm: "Choose soft textures and comfortable, flowing fabrics",
    romantic: "Incorporate delicate details and feminine touches",
    adventurous: "Mix unexpected patterns and textures",
    bold: "Don't be afraid to make a statement with color and accessories"
  };

  const isDarkMode = user?.preferences?.darkMode || false;

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Wand2 className="h-5 w-5 text-purple-600" />
        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
          AI Styling Assistant
        </h4>
      </div>

      {/* Mood-based advice */}
      <div className="mb-4">
        <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          For your {product.mood[0]} mood:
        </h5>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {moodStylingAdvice[product.mood[0] as keyof typeof moodStylingAdvice] || 
           "Style this piece to match your current vibe"}
        </p>
      </div>

      {/* Generate AI tips */}
      <button
        onClick={generateStylingTips}
        disabled={isGenerating}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors mb-3"
      >
        <Sparkles className="h-4 w-4" />
        <span>{isGenerating ? 'Generating...' : 'Get AI Styling Tips'}</span>
      </button>

      {/* Generated tips */}
      {generatedTips.length > 0 && (
        <div className="space-y-2">
          <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            AI Recommendations:
          </h5>
          {generatedTips.map((tip, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => onStylingTip(tip)}
            >
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick styling categories */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-white hover:bg-gray-50 text-gray-700'
        }`}>
          <Palette className="h-3 w-3" />
          <span>Color Match</span>
        </button>
        <button className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-white hover:bg-gray-50 text-gray-700'
        }`}>
          <TrendingUp className="h-3 w-3" />
          <span>Trend Alert</span>
        </button>
      </div>
    </div>
  );
};

export default StylingAssistant;