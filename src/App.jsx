import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import LoginForm from './components/LoginForm';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <MainContent user={user} />
    </Layout>
  );
}