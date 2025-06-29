import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Cart from './Cart';
import AIStylistChatbot from '../ai/AIStylistChatbot';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {
  const { user } = useAuthStore();
  const isDarkMode = user?.preferences?.darkMode || false;

  // Apply theme class to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="transition-all duration-300">
        <Outlet />
      </main>
      <Cart />
      <AIStylistChatbot />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#1F2937' : '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;