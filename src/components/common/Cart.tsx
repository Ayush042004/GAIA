import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Minus, ShoppingBag, Leaf } from 'lucide-react';
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
  const { isAuthenticated } = useAuthStore();
  const [showEmotionModal, setShowEmotionModal] = useState(false);

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

  return (
    <>
      <Dialog open={isOpen} onClose={toggleCart} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Shopping Cart
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={toggleCart}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {items.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              Your cart is empty
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Start shopping to add items to your cart.
                            </p>
                          </div>
                        ) : (
                          <ul className="-my-6 divide-y divide-gray-200">
                            {items.map((item) => (
                              <li key={item.product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.product.name}</h3>
                                      <p className="ml-4">${item.product.price}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.product.mood.join(', ')}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="text-gray-900 font-medium">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeItem(item.product.id)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${getTotalPrice().toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>Eco Impact: ~{(getTotalPrice() * 0.02).toFixed(1)}m² forest</span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Dialog>

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