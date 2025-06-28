import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, User, Bell, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { state, dispatch } = useApp();
  const { state: themeState, dispatch: themeDispatch, triggerTransition } = useTheme();
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleTheme = () => {
    if (themeButtonRef.current && !themeState.isTransitioning) {
      const buttonRect = themeButtonRef.current.getBoundingClientRect();
      triggerTransition(buttonRect);
      themeDispatch({ type: 'TOGGLE_THEME' });
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-purple-100 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudyHub AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Collaborative Learning</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              ref={themeButtonRef}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              disabled={themeState.isTransitioning}
              className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200 relative overflow-hidden disabled:opacity-50"
            >
              <motion.div
                animate={{ 
                  rotate: themeState.isTransitioning ? [0, 180] : 0,
                  scale: themeState.isTransitioning ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  duration: themeState.isTransitioning ? 0.4 : 0.2,
                  ease: "easeInOut"
                }}
              >
                {themeState.theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                )}
              </motion.div>
              
              {/* Enhanced ripple effect on theme toggle */}
              {themeState.isTransitioning && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 bg-purple-400/30 dark:bg-yellow-400/30 rounded-lg"
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0.4 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                    className="absolute inset-0 bg-purple-500/20 dark:bg-yellow-500/20 rounded-lg"
                  />
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200 relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
            </motion.button>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{state.user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{state.user?.email}</p>
              </div>
              {state.user?.avatar ? (
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={state.user.avatar}
                  alt={state.user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-200 dark:border-purple-600 transition-all duration-300"
                />
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-white" />
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600 dark:text-red-400"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}