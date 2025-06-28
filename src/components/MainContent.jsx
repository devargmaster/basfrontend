import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import StockManagement from './StockManagement';
import InventoryMovements from './InventoryMovements';
import UserForm from './UserForm';
import UserList from './UserList';

export default function MainContent({ user, currentView }) {
  const [refresh, setRefresh] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const handleProductAdded = () => {
    setRefresh(!refresh);
    setShowProductForm(false); // Cerrar formulario después de crear
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
                Administra el catálogo de productos del sistema
              </p>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  💡 <strong>Nota:</strong> Para gestionar el stock de los productos, ve al módulo de{' '}
                  <strong>"Gestión de Stock"</strong> donde podrás ver inventario actual y crear movimientos.
                </p>
              </div>
            </div>
            
            {/* Botón para mostrar/ocultar formulario */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lista de Productos</h3>
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showProductForm
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {showProductForm ? 'Cancelar' : '+ Nuevo Producto'}
              </button>
            </div>

            {/* Formulario colapsable */}
            {showProductForm && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Crear Nuevo Producto
                  </h3>
                  <ProductForm onProductAdded={handleProductAdded} />
                </div>
              </div>
            )}
            
            {/* Lista de productos */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <ProductList refresh={refresh} />
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
        return <Dashboard user={user} />;
    }
  };

  return renderContent();
}
