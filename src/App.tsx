import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import TopPicks from './pages/TopPicks';
import Gift from './pages/Gift';
import Vendor from './pages/Vendor';
import Wishlist from './pages/Wishlist';
import VirtualWardrobe from './components/wardrobe/VirtualWardrobe';
import { useAuthStore } from './store/authStore';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="games" element={<Games />} />
          <Route path="top-picks" element={<TopPicks />} />
          <Route path="gift" element={<Gift />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="wardrobe" element={<VirtualWardrobe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;