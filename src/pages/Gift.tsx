import React, { useState } from 'react';
import { 
  Gift as GiftIcon, 
  TreePine, 
  Waves, 
  Mountain, 
  Heart, 
  Send,
  MapPin,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Gift: React.FC = () => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [giftForm, setGiftForm] = useState({
    recipientName: '',
    recipientEmail: '',
    message: '',
    quantity: 1
  });

  const giftOptions = [
    {
      id: 'trees',
      name: 'Plant Trees',
      icon: TreePine,
      description: 'Gift the future with native tree planting',
      impact: 'Each tree absorbs 48lbs of CO₂ annually',
      location: 'Meghalaya, India',
      price: 15,
      image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'mangroves',
      name: 'Restore Mangroves',
      icon: Waves,
      description: 'Protect coastlines and marine ecosystems',
      impact: 'Mangroves store 4x more carbon than rainforests',
      location: 'Sundarbans, Bangladesh',
      price: 25,
      image: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'coral',
      name: 'Coral Restoration',
      icon: Waves,
      description: 'Rebuild vibrant coral reef ecosystems',
      impact: 'Supports 25% of all marine species',
      location: 'Great Barrier Reef, Australia',
      price: 35,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'ocean',
      name: 'Ocean Cleanup',
      icon: Waves,
      description: 'Remove plastic waste from our oceans',
      impact: 'Every $30 removes 1kg of ocean plastic',
      location: 'Pacific Ocean',
      price: 30,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      id: 'wildlife',
      name: 'Wildlife Protection',
      icon: Mountain,
      description: 'Protect endangered species habitats',
      impact: 'Safeguards critical wildlife corridors',
      location: 'Amazon Rainforest, Brazil',
      price: 40,
      image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'renewable',
      name: 'Renewable Energy',
      icon: Sparkles,
      description: 'Fund solar panels for rural communities',
      impact: 'Powers 10 homes with clean energy for 1 year',
      location: 'Rural Kenya',
      price: 50,
      image: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const recentGifts = [
    {
      giver: 'Emma Thompson',
      recipient: 'Sarah Chen',
      gift: '5 Trees',
      location: 'Meghalaya, India',
      date: '2 hours ago',
      message: 'Happy Birthday! Let\'s grow together 🌱'
    },
    {
      giver: 'Alex Rivera',
      recipient: 'Mom',
      gift: '3 Mangroves',
      location: 'Sundarbans, Bangladesh',
      date: '5 hours ago',
      message: 'Thank you for teaching me to care for our planet'
    },
    {
      giver: 'Maya Patel',
      recipient: 'Best Friend',
      gift: '2 Coral Beds',
      location: 'Great Barrier Reef',
      date: '1 day ago',
      message: 'For all the beautiful memories we\'ve shared'
    }
  ];

  const handleGiftSelect = (giftId: string) => {
    setSelectedGift(giftId);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGiftForm({
      ...giftForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSendGift = () => {
    if (!selectedGift || !giftForm.recipientName || !giftForm.recipientEmail) {
      return;
    }

    // Mock gift sending
    alert(`Gift sent! ${giftForm.recipientName} will receive your nature gift via email.`);
    
    // Reset form
    setGiftForm({
      recipientName: '',
      recipientEmail: '',
      message: '',
      quantity: 1
    });
    setSelectedGift(null);
  };

  const selectedGiftData = giftOptions.find(gift => gift.id === selectedGift);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GiftIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Art of Nature Gifts
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Give the gift of environmental impact. Plant trees, restore coral reefs, and protect wildlife in someone's name.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gift Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Nature Gift</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {giftOptions.map((gift) => (
                <motion.div
                  key={gift.id}
                  whileHover={{ scale: 1.02 }}
                  className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all ${
                    selectedGift === gift.id 
                      ? `${gift.bgColor} ${gift.borderColor} border-2` 
                      : 'bg-white hover:shadow-xl'
                  }`}
                  onClick={() => handleGiftSelect(gift.id)}
                >
                  <div className="relative">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gift.color} opacity-20`} />
                    <div className="absolute top-4 left-4">
                      <gift.icon className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="font-bold text-gray-900">${gift.price}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{gift.name}</h3>
                    <p className="text-gray-600 mb-3">{gift.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{gift.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-600">
                        <Sparkles className="h-4 w-4" />
                        <span>{gift.impact}</span>
                      </div>
                    </div>

                    {selectedGift === gift.id && (
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <p className="text-sm font-medium text-gray-900">Selected!</p>
                        <p className="text-xs text-gray-600">Complete the form to send this gift</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gift Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send Your Gift</h3>
              
              {selectedGiftData && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <selectedGiftData.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{selectedGiftData.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">${selectedGiftData.price} each</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={giftForm.recipientName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter recipient's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    name="recipientEmail"
                    value={giftForm.recipientEmail}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter recipient's email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={giftForm.quantity}
                    onChange={handleFormChange}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={giftForm.message}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a personal message..."
                  />
                </div>

                {selectedGiftData && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${(selectedGiftData.price * giftForm.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Impact: {giftForm.quantity} × {selectedGiftData.name.toLowerCase()}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSendGift}
                  disabled={!selectedGift || !giftForm.recipientName || !giftForm.recipientEmail}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Nature Gift</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Gifts Activity */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Nature Gifts</h2>
          </div>

          <div className="space-y-4">
            {recentGifts.map((gift, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {gift.giver.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{gift.giver}</span> gifted{' '}
                    <span className="font-medium text-green-600">{gift.gift}</span> to{' '}
                    <span className="font-medium">{gift.recipient}</span>
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{gift.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{gift.date}</span>
                    </div>
                  </div>
                  {gift.message && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{gift.message}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12,847</div>
            <div className="text-sm text-gray-600">Trees Gifted</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <Waves className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">3,291</div>
            <div className="text-sm text-gray-600">Coral Beds Restored</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">8,456</div>
            <div className="text-sm text-gray-600">Gifts Sent</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15,623</div>
            <div className="text-sm text-gray-600">People Impacted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gift;