import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Cart from './Cart';
import AIStylistChatbot from '../ai/AIStylistChatbot';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {
  const { user } = useAuthStore();
  const isDarkMode = user?.preferences?.darkMode || false;

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header />
      <main>
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
          },
        }}
      />
    </div>
  );
};

export default Layout;