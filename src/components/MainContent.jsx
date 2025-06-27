import React, { useRef, useState } from 'react';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import InventoryForm from './InventoryForm';
import UserForm from './UserForm';
import UserList from './UserList';

export default function MainContent({ user, currentView }) {
  const listRef = useRef();
  const [refresh, setRefresh] = useState(false);

  const handleProductAdded = () => {
    setRefresh(!refresh);
    if (listRef.current) {
      listRef.current.refreshList();
    }
  };

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
                Administra el catálogo de productos
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nuevo Producto
                  </h3>
                  <ProductForm onProductAdded={handleProductAdded} />
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Lista de Productos
                  </h3>
                  <ProductList ref={listRef} refresh={refresh} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
              <p className="mt-1 text-sm text-gray-600">
                Controla los movimientos de stock
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Movimiento de Inventario
                </h3>
                <InventoryForm />
              </div>
            </div>
          </div>
        );
      
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
        return <Dashboard user={user} />;
    }
  };

  return renderContent();
}
