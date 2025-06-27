import React, { useRef, useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import InventoryForm from './components/InventoryForm';
import LoginForm from './components/LoginForm';

export default function App() {
  const listRef = useRef();
  const [refresh, setRefresh] = useState(false);
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
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header con info del usuario */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Inventario BAS</h1>
          <p className="text-sm text-gray-600">Bienvenido, {user.nombre} {user.apellido}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Gestión de Productos */}
      <section>
        <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
        <ProductForm onProductAdded={() => setRefresh(r => !r)} />
        <ProductList key={refresh} />
      </section>

      {/* Movimientos de Inventario */}
      <section>
        <h2 className="text-xl font-bold mb-4">Movimientos de Inventario</h2>
        <InventoryForm />
      </section>
    </div>
  );
}