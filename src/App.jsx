import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import LoginForm from './components/LoginForm';
import { apiPost } from './utils/api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      console.log('Datos de usuario almacenados:', userData);
      
      // Si el usuario no tiene información de rol, validar token para obtener datos actualizados
      if (!userData.rol) {
        console.log('Usuario sin información de rol, validando token...');
        apiPost('/api/auth/validate', { token: storedToken })
        .then(updatedUser => {
          console.log('Usuario actualizado con rol:', updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        })
        .catch(err => {
          console.error('Error validando token:', err);
          // Si falla la validación, usar los datos existentes sin forzar logout
          console.log('Usando datos de usuario existentes sin rol');
          setUser(userData);
        });
      } else {
        console.log('Usuario con rol encontrado:', userData.rol);
        setUser(userData);
      }
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