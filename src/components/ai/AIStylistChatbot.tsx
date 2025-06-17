import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, User, Bot, ShoppingBag, Leaf, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: any[];
}

const AIStylistChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { items: cartItems, getTotalPrice } = useCartStore();

  const isDarkMode = user?.preferences?.darkMode || false;

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hi ${user?.name?.split(' ')[0] || 'there'}! ✨ I'm your AI stylist assistant. I can help you with:`,
        timestamp: new Date(),
        suggestions: [
          'Style tips for any occasion',
          'Mood-based outfit recommendations',
          'Questions about your cart',
          'Eco-impact explanations',
          'Product styling advice'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user?.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { text: 'Style my cart items', icon: ShoppingBag },
    { text: 'Eco impact of my purchases', icon: Leaf },
    { text: 'Outfit for confident mood', icon: Sparkles },
    { text: 'Date night styling tips', icon: Heart }
  ];

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let products: any[] = [];

    // Cart-related queries
    if (lowerMessage.includes('cart') || lowerMessage.includes('items')) {
      if (cartItems.length === 0) {
        response = "Your cart is currently empty! Would you like me to recommend some pieces based on your mood or a specific occasion?";
        suggestions = ['Show me elegant pieces', 'Casual weekend outfits', 'Professional workwear'];
      } else {
        const cartValue = getTotalPrice();
        const ecoImpact = cartValue * 0.02;
        response = `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart worth $${cartValue.toFixed(2)}. Your eco impact: ~${ecoImpact.toFixed(1)}m² forest restoration! 🌱\n\nHere's how to style these pieces:`;
        
        cartItems.forEach(item => {
          response += `\n\n• **${item.product.name}**: ${item.product.stylingTips?.[0] || 'Perfect for versatile styling'}`;
        });
        
        suggestions = ['Add accessories', 'Complete the look', 'Eco impact details'];
      }
    }
    
    // Eco impact queries
    else if (lowerMessage.includes('eco') || lowerMessage.includes('impact') || lowerMessage.includes('environment')) {
      const totalImpact = user?.ecoStats?.treesPlanted || 0;
      response = `🌍 Your eco journey is amazing! You've helped plant ${totalImpact} trees and saved ${user?.ecoStats?.waterSaved || 0}L of water.\n\nEvery GAIA purchase contributes to:\n• Forest restoration in Meghalaya, India\n• Ocean plastic cleanup\n• Sustainable farming communities\n• Carbon footprint reduction`;
      suggestions = ['How does it work?', 'Gift eco impact', 'See impact map'];
    }
    
    // Mood-based styling
    else if (lowerMessage.includes('confident') || lowerMessage.includes('bold')) {
      response = "For a confident vibe, I recommend:\n\n💪 **Power pieces**: Structured blazers, statement jewelry\n👠 **Bold accessories**: Chunky heels, oversized bags\n🎨 **Colors**: Deep reds, royal blues, classic black\n✨ **Styling tip**: Layer textures and add one statement piece!";
      suggestions = ['Show confident pieces', 'Professional confidence', 'Date night confidence'];
    }
    
    else if (lowerMessage.includes('elegant') || lowerMessage.includes('classy')) {
      response = "Elegant styling is all about refined simplicity:\n\n✨ **Key pieces**: Silk blouses, midi dresses, tailored pants\n💎 **Accessories**: Delicate jewelry, structured handbags\n🎨 **Colors**: Neutrals, soft pastels, timeless black & white\n👗 **Styling tip**: Less is more - choose quality over quantity!";
      suggestions = ['Show elegant pieces', 'Evening elegance', 'Casual elegance'];
    }
    
    else if (lowerMessage.includes('calm') || lowerMessage.includes('zen') || lowerMessage.includes('relaxed')) {
      response = "For a calm, zen vibe:\n\n🧘‍♀️ **Comfort first**: Soft fabrics, loose fits, breathable materials\n🌿 **Natural tones**: Earth colors, soft greens, warm beiges\n☁️ **Textures**: Cotton, linen, bamboo, organic materials\n💆‍♀️ **Styling tip**: Choose pieces that make you feel at peace!";
      suggestions = ['Show calm pieces', 'Yoga outfits', 'Weekend relaxation'];
    }
    
    else if (lowerMessage.includes('romantic') || lowerMessage.includes('date')) {
      response = "Creating romantic vibes:\n\n💕 **Feminine touches**: Flowing fabrics, soft silhouettes\n🌸 **Colors**: Blush pink, soft lavender, cream\n✨ **Details**: Lace accents, delicate prints, subtle sparkle\n👗 **Styling tip**: Add one romantic element to any outfit!";
      suggestions = ['Date night outfits', 'Romantic accessories', 'Dinner date looks'];
    }
    
    // Occasion-based styling
    else if (lowerMessage.includes('work') || lowerMessage.includes('professional') || lowerMessage.includes('office')) {
      response = "Professional styling made easy:\n\n👔 **Foundation**: Well-fitted blazer, quality basics\n📊 **Colors**: Navy, charcoal, cream, burgundy\n💼 **Accessories**: Structured bag, classic watch, minimal jewelry\n👠 **Footwear**: Comfortable heels or polished flats\n💡 **Pro tip**: Invest in versatile pieces you can mix & match!";
      suggestions = ['Show work outfits', 'Meeting looks', 'Business casual'];
    }
    
    else if (lowerMessage.includes('weekend') || lowerMessage.includes('casual')) {
      response = "Weekend casual done right:\n\n👕 **Comfort**: Soft tees, cozy sweaters, relaxed denim\n👟 **Footwear**: Sneakers, comfortable flats, ankle boots\n🎒 **Accessories**: Crossbody bags, baseball caps, sunglasses\n🌈 **Colors**: Whatever makes you happy!\n😊 **Styling tip**: Comfort doesn't mean compromising style!";
      suggestions = ['Casual outfits', 'Weekend activities', 'Brunch looks'];
    }
    
    // General styling advice
    else if (lowerMessage.includes('style') || lowerMessage.includes('outfit') || lowerMessage.includes('wear')) {
      response = "I'd love to help you style the perfect outfit! What's the occasion or mood you're going for?\n\n✨ **Quick styling tips**:\n• Start with one statement piece\n• Balance proportions (fitted + loose)\n• Add texture through accessories\n• Consider the color story\n• Most importantly - wear what makes YOU feel amazing!";
      suggestions = ['Specific occasion help', 'Color coordination', 'Accessory advice', 'Body type styling'];
    }
    
    // Default response
    else {
      response = "I'm here to help with all your styling needs! Whether you need outfit ideas, want to understand your eco impact, or have questions about your cart - just ask! 💫\n\nWhat would you like to explore today?";
      suggestions = ['Style advice', 'Eco impact info', 'Cart styling', 'Mood outfits'];
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions,
      products
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 ${
          isDarkMode 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
        } text-white transition-all`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl shadow-2xl z-50 flex flex-col ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Stylist
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Online • Ready to help 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                                isDarkMode
                                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Quick actions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <action.icon className="h-3 w-3" />
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about styling..."
                  className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIStylistChatbot;