import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import LoginForm from './components/LoginForm';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('dashboard'); 
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <Layout 
        user={user} 
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      >
        <MainContent user={user} currentView={currentView} />
      </Layout>
    </div>
  );
}