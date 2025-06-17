import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, User, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome to GAIA!');
      } else {
        await signup(formData.email, formData.password, formData.name, role);
        toast.success('Account created successfully!');
      }
      onClose();
      // Reset form
      setFormData({ email: '', password: '', name: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form when closing
      setFormData({ email: '', password: '', name: '' });
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    if (!isSubmitting) {
      setIsLogin(!isLogin);
      // Reset form when switching modes
      setFormData({ email: '', password: '', name: '' });
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleModalClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Join GAIA'}
            </Dialog.Title>
            <button
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Role Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                    role === 'customer'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                    role === 'vendor'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">Vendor</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                  placeholder={role === 'customer' ? 'customer@gaia.com' : 'vendor@gaia.com'}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  role === 'customer'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleToggleMode}
                disabled={isSubmitting}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Demo credentials:</p>
              <p className="text-xs text-gray-500">Customer: customer@gaia.com</p>
              <p className="text-xs text-gray-500">Vendor: vendor@gaia.com</p>
              <p className="text-xs text-gray-500">Password: any</p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;