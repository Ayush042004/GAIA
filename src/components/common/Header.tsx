import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Leaf, Moon, Sun, Heart, Shirt, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import AuthModal from '../auth/AuthModal';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, toggleDarkMode } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTogglingTheme, setIsTogglingTheme] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Top Picks', href: '/top-picks' },
    { name: 'Games', href: '/games' },
    { name: 'Gift Nature', href: '/gift' },
    ...(isAuthenticated && user?.role === 'customer' ? [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Wardrobe', href: '/wardrobe' },
      { name: 'Wishlist', href: '/wishlist' }
    ] : []),
    ...(isAuthenticated && user?.role === 'vendor' ? [{ name: 'Vendor', href: '/vendor' }] : [])
  ];

  const isDarkMode = user?.preferences?.darkMode || false;

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const scrollToSearchBar = () => {
    // Wait a moment for navigation to complete if needed
    setTimeout(() => {
      const searchInput = document.querySelector('[data-search-bar]') as HTMLInputElement;
      if (searchInput) {
        searchInput.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Focus the input after scrolling
        setTimeout(() => {
          searchInput.focus();
        }, 500);
      }
    }, 100);
  };

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      // Navigate to home page first, then scroll to search bar
      navigate('/');
      setTimeout(scrollToSearchBar, 300);
    } else {
      // Already on home page, just scroll to search bar
      scrollToSearchBar();
    }
  };

  const handleDarkModeToggle = async () => {
    if (isTogglingTheme) return;
    
    setIsTogglingTheme(true);
    
    try {
      await toggleDarkMode();
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    } finally {
      // Reset the animation state after a delay
      setTimeout(() => {
        setIsTogglingTheme(false);
      }, 600);
    }
  };

  const logoVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const badgeVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const themeToggleVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.9,
      transition: { duration: 0.1 }
    },
    switching: {
      rotate: 360,
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.header 
      className={`shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white border-b border-gray-800' : 'bg-white text-gray-900 border-b border-gray-200'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div variants={logoVariants} animate="animate">
                <Leaf className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                GAIA
              </motion.span>
            </Link>
          </motion.div>

          {/* Current Mood Indicator */}
          <AnimatePresence>
            {user?.preferences?.currentMood && (
              <motion.div 
                className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-purple-600">Current vibe:</span>
                <motion.span 
                  className="font-medium capitalize"
                  animate={{ color: ['#8B5CF6', '#EC4899', '#10B981', '#8B5CF6'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {user.preferences.currentMood}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative ${
                    location.pathname === item.href
                      ? 'text-green-600'
                      : isDarkMode 
                        ? 'text-gray-300 hover:text-green-400' 
                        : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            {isAuthenticated && (
              <motion.button
                onClick={handleDarkModeToggle}
                disabled={isTogglingTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-800 hover:text-yellow-300' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                } disabled:opacity-50`}
                variants={themeToggleVariants}
                initial="initial"
                whileHover={!isTogglingTheme ? "hover" : undefined}
                whileTap={!isTogglingTheme ? "tap" : undefined}
                animate={isTogglingTheme ? "switching" : "initial"}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Search Icon */}
            <motion.button 
              onClick={handleSearchClick}
              title="Search products"
              className={`p-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-green-400' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Wardrobe */}
            {isAuthenticated && user?.role === 'customer' && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to="/wardrobe"
                  className={`relative p-2 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-green-400' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Shirt className="h-5 w-5" />
                </Link>
              </motion.div>
            )}

            {/* Wishlist */}
            {isAuthenticated && user?.role === 'customer' && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to="/wishlist"
                  className={`relative p-2 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-green-400' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span
                        className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        variants={badgeVariants}
                        animate="animate"
                        initial={{ scale: 0 }}
                        exit={{ scale: 0 }}
                      >
                        {wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            )}

            {/* Cart */}
            <motion.button
              onClick={toggleCart}
              className={`relative p-2 transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-green-400' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {getTotalItems() > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    variants={badgeVariants}
                    animate="animate"
                    initial={{ scale: 0 }}
                    exit={{ scale: 0 }}
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="py-1">
                        <div className={`px-4 py-2 text-sm border-b transition-colors duration-300 ${
                          isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
                        }`}>
                          {user?.email}
                        </div>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 flex items-center space-x-2 ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => setIsAuthModalOpen(true)}
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-green-400' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Sign In</span>
              </motion.button>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`md:hidden pb-4 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex flex-col space-y-2 pt-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                        location.pathname === item.href
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {isAuthenticated && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 flex items-center space-x-2 ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.header>
  );
};

export default Header;