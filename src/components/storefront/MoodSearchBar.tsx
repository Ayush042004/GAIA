import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

interface MoodSearchBarProps {
  onSearch: (query: string) => void;
}

const MoodSearchBar: React.FC<MoodSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuthStore();

  const isDarkMode = user?.preferences?.darkMode || false;

  const suggestions = [
    "I want to slay",
    "Classic beach look",
    "Romantic dinner",
    "Power meeting",
    "Cozy weekend",
    "Festival vibes",
    "Date night energy",
    "Confidence boost"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div 
          className="relative flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute left-4 z-10"
          >
            <Sparkles className="h-5 w-5 text-purple-500" />
          </motion.div>
          
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search by vibe... e.g., 'I want to slay', 'Classic beach look', 'Romantic dinner'"
            data-search-bar
            className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:outline-none shadow-lg transition-all duration-300 hover:shadow-xl ${
              isDarkMode
                ? 'bg-zinc-900 border-zinc-700 text-white placeholder-gray-400 focus:border-purple-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'
            }`}
            whileFocus={{ scale: 1.02 }}
          />
          
          <motion.button
            type="submit"
            className="absolute right-2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Search className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-20 overflow-hidden backdrop-blur-sm ${
              isDarkMode
                ? 'bg-zinc-900/95 border-zinc-700'
                : 'bg-white/95 border-gray-200'
            }`}
          >
            <div className="p-2">
              <motion.p 
                className={`text-xs font-medium px-3 py-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Popular vibes:
              </motion.p>
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MoodSearchBar;