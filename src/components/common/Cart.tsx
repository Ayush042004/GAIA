import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Minus, ShoppingBag, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import EmotionModal from './EmotionModal';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    clearCart 
  } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [showEmotionModal, setShowEmotionModal] = useState(false);

  const isDarkMode = user?.preferences?.darkMode || false;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setShowEmotionModal(true);
  };

  const handleOrderComplete = (emotion: string, occasion: string) => {
    // Calculate eco impact
    const totalCarbonReduced = items.reduce((total, item) => 
      total + (item.product.esgMetadata.carbonFootprint * item.quantity), 0
    );
    const forestArea = totalCarbonReduced * 0.3; // Mock calculation
    
    toast.success(
      `Order placed! You helped restore ${forestArea.toFixed(1)}m² forest in Meghalaya 🌱`,
      { duration: 5000 }
    );
    
    clearCart();
    toggleCart();
    setShowEmotionModal(false);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const panelVariants = {
    hidden: { 
      x: '100%',
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.5
      }
    },
    exit: { 
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        duration: 0.3
      }
    }
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
    hidden: { 
      opacity: 0, 
      x: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const emptyStateVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 200,
        delay: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const quantityVariants = {
    scale: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    }
  };

  const priceVariants = {
    scale: {
      scale: [1, 1.1, 1],
      color: ['#059669', '#10B981', '#059669'],
      transition: { duration: 0.4 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog 
            open={isOpen} 
            onClose={toggleCart} 
            className="relative z-50"
            static
          >
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/30"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <motion.div
                    className="pointer-events-auto w-screen max-w-md"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Dialog.Panel className={`flex h-full flex-col shadow-xl ${
                      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Shopping Cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <motion.button
                              type="button"
                              className={`relative -m-2 p-2 transition-colors ${
                                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'
                              }`}
                              onClick={toggleCart}
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <motion.div
                                animate={{ rotate: 0 }}
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.2 }}
                              >
                                <X className="h-6 w-6" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <AnimatePresence mode="wait">
                              {items.length === 0 ? (
                                <motion.div 
                                  className="text-center py-12"
                                  variants={emptyStateVariants}
                                  initial="hidden"
                                  animate="visible"
                                  key="empty"
                                >
                                  <motion.div
                                    animate={{ 
                                      y: [0, -10, 0],
                                      rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    <ShoppingBag className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                  </motion.div>
                                  <motion.h3 
                                    className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    Your cart is empty
                                  </motion.h3>
                                  <motion.p 
                                    className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    Start shopping to add items to your cart.
                                  </motion.p>
                                </motion.div>
                              ) : (
                                <motion.ul 
                                  className={`-my-6 divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}
                                  variants={containerVariants}
                                  initial="hidden"
                                  animate="visible"
                                  key="items"
                                >
                                  <AnimatePresence>
                                    {items.map((item) => (
                                      <motion.li 
                                        key={item.product.id} 
                                        className="flex py-6"
                                        variants={itemVariants}
                                        layout
                                        exit="exit"
                                      >
                                        <motion.div 
                                          className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border ${
                                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </motion.div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                          <div>
                                            <div className={`flex justify-between text-base font-medium ${
                                              isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                              <h3>{item.product.name}</h3>
                                              <motion.p 
                                                className="ml-4"
                                                key={item.product.price}
                                                variants={priceVariants}
                                                animate="scale"
                                              >
                                                ${item.product.price}
                                              </motion.p>
                                            </div>
                                            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                              {item.product.mood.join(', ')}
                                            </p>
                                          </div>
                                          <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center space-x-2">
                                              <motion.button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className={`p-1 transition-colors ${
                                                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                              >
                                                <Minus className="h-4 w-4" />
                                              </motion.button>
                                              <motion.span 
                                                className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                                key={item.quantity}
                                                variants={quantityVariants}
                                                animate="scale"
                                              >
                                                {item.quantity}
                                              </motion.span>
                                              <motion.button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className={`p-1 transition-colors ${
                                                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                              >
                                                <Plus className="h-4 w-4" />
                                              </motion.button>
                                            </div>

                                            <div className="flex">
                                              <motion.button
                                                type="button"
                                                onClick={() => removeItem(item.product.id)}
                                                className="font-medium text-red-600 hover:text-red-500"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                              >
                                                Remove
                                              </motion.button>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.li>
                                    ))}
                                  </AnimatePresence>
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {items.length > 0 && (
                          <motion.div 
                            className={`border-t px-4 py-6 sm:px-6 ${
                              isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className={`flex justify-between text-base font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              <p>Subtotal</p>
                              <motion.p
                                key={getTotalPrice()}
                                variants={priceVariants}
                                animate="scale"
                              >
                                ${getTotalPrice().toFixed(2)}
                              </motion.p>
                            </div>
                            <div className={`flex items-center justify-between text-sm mt-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <div className="flex items-center space-x-1">
                                <motion.div
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                  <Leaf className="h-4 w-4 text-green-600" />
                                </motion.div>
                                <span>Eco Impact: ~{(getTotalPrice() * 0.02).toFixed(1)}m² forest</span>
                              </div>
                            </div>
                            <p className={`mt-0.5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Shipping and taxes calculated at checkout.
                            </p>
                            <div className="mt-6">
                              <motion.button
                                onClick={handleCheckout}
                                className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <motion.div
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  Checkout
                                </motion.div>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Dialog.Panel>
                  </motion.div>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <EmotionModal
        isOpen={showEmotionModal}
        onClose={() => setShowEmotionModal(false)}
        onComplete={handleOrderComplete}
        totalAmount={getTotalPrice()}
      />
    </>
  );
};

export default Cart;