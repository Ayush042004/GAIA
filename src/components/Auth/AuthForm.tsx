import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Zap
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';

export default function AuthForm() {
  const { dispatch } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get instant summaries and Q&A from your study materials'
    },
    {
      icon: Users,
      title: 'Collaborative Study',
      description: 'Join study rooms and learn together with peers'
    },
    {
      icon: BookOpen,
      title: 'Smart Organization',
      description: 'Keep all your study materials organized and accessible'
    },
    {
      icon: Zap,
      title: 'Real-time Whiteboard',
      description: 'Collaborate on problems with interactive whiteboards'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch({ type: 'SET_AUTH_ERROR', payload: null });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        dispatch({ type: 'SET_AUTH_ERROR', payload: 'Passwords do not match' });
        setIsLoading(false);
        return;
      }
    }

    // Simulate successful authentication
    const user = {
      id: uuidv4(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
    };

    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-600" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">StudyHub AI</h1>
                <p className="text-white/80 text-sm">Collaborative Learning Platform</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transform Your Study Experience with AI
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of students who are revolutionizing their learning with intelligent study tools and collaborative features.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Pro Tip</span>
            </div>
            <p className="text-white/90 text-sm">
              Upload your first study material and watch our AI generate instant summaries and practice questions!
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join the future of collaborative learning' 
                  : 'Sign in to continue your learning journey'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required={isSignUp}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                        placeholder="Confirm your password"
                        required={isSignUp}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}