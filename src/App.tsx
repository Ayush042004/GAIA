import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import FileUpload from './components/FileUpload/FileUpload';
import StudySessions from './components/StudySessions/StudySessions';
import Whiteboard from './components/Whiteboard/Whiteboard';
import Analytics from './components/Analytics/Analytics';
import Quiz from './components/Quiz/Quiz';
import Leaderboard from './components/Leaderboard/Leaderboard';
import AuthForm from './components/Auth/AuthForm';

function AppContent() {
  const { state } = useApp();

  // Show auth form if user is not authenticated
  if (!state.auth.isAuthenticated) {
    return <AuthForm />;
  }

  const renderActiveView = () => {
    switch (state.activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <FileUpload />;
      case 'sessions':
        return <StudySessions />;
      case 'quiz':
        return <Quiz />;
      case 'whiteboard':
        return <Whiteboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-800/50 transition-all duration-300">
          <div className="p-8 h-full">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;