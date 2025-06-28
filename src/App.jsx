import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import StockManagement from './components/StockManagement';
import InventoryMovements from './components/InventoryMovements';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
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

  // Función simple para renderizar contenido
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      
      case 'products':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <p className="mt-1 text-sm text-gray-600">
                Administra el catálogo de productos del sistema
              </p>
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Nota:</strong> El formulario de productos está temporalmente deshabilitado por problemas técnicos.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Productos</h3>
                <ProductList />
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return <StockManagement />;

      case 'movements':
        return <InventoryMovements />;
      
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <p className="mt-1 text-sm text-gray-600">
                Administra los usuarios del sistema
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nuevo Usuario
                  </h3>
                  <UserForm />
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Lista de Usuarios
                  </h3>
                  <UserList />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Vista: {currentView}</h2>
              <p className="text-gray-600">
                Módulo {currentView} en construcción...
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <Layout 
        user={user} 
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      >
        {renderContent()}
      </Layout>
    </div>
  );
}