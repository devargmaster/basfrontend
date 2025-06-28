import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import StockManagement from './StockManagement';
import InventoryMovements from './InventoryMovements';
import UserForm from './UserForm';
import UserList from './UserList';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';

export default function MainContent({ user, currentView }) {
  const [refresh, setRefresh] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleProductAdded = () => {
    setRefresh(!refresh);
    setShowProductForm(false); // Cerrar formulario después de crear
  };

  const handleUserAdded = () => {
    setRefresh(!refresh);
    setShowUserForm(false);
  };

  const handleCategoryAdded = () => {
    setRefresh(!refresh);
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setShowCategoryForm(false);
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
      
      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <p className="mt-1 text-sm text-gray-600">
                Administra las categorías de productos del sistema
              </p>
            </div>
            
            {/* Botón para mostrar/ocultar formulario */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lista de Categorías</h3>
              <button
                onClick={() => {
                  setShowCategoryForm(!showCategoryForm);
                  if (editingCategory) {
                    setEditingCategory(null);
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showCategoryForm
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {showCategoryForm ? 'Cancelar' : '+ Nueva Categoría'}
              </button>
            </div>

            {/* Formulario colapsable */}
            {showCategoryForm && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                  </h3>
                  <CategoryForm 
                    onCategoryAdded={handleCategoryAdded}
                    editingCategory={editingCategory}
                    onEditCancel={handleCancelEdit}
                  />
                </div>
              </div>
            )}
            
            {/* Lista de categorías */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <CategoryList 
                  refresh={refresh} 
                  onEdit={handleEditCategory}
                />
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
        return <StockManagement />;

      case 'movements':
        return <InventoryMovements />;
      
      case 'users':
        // Si el usuario no tiene información de rol, mostrar mensaje de carga
        if (!user?.rol) {
          return (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando permisos...</h3>
              <p className="text-gray-600">Verificando tus permisos de usuario.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Refrescar página
              </button>
            </div>
          );
        }
        
        // Verificar si el usuario tiene permisos para gestionar usuarios
        const canManageUsers = user?.rol?.puedeGestionarUsuarios || user?.rol?.esAdministrador;
        
        if (!canManageUsers) {
          return (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833-.228 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
              <p className="text-gray-600">No tienes permisos para gestionar usuarios.</p>
              <p className="text-sm text-gray-500 mt-2">
                Contacta al administrador si necesitas acceso a esta funcionalidad.
              </p>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <p className="mt-1 text-sm text-gray-600">
                Administra los usuarios del sistema y sus permisos
              </p>
            </div>
            
            {/* Botón para mostrar/ocultar formulario */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showUserForm
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {showUserForm ? 'Cancelar' : '+ Nuevo Usuario'}
              </button>
            </div>

            {/* Formulario colapsable */}
            {showUserForm && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Crear Nuevo Usuario
                  </h3>
                  <UserForm 
                    onUserAdded={handleUserAdded} 
                    onCancel={() => setShowUserForm(false)}
                  />
                </div>
              </div>
            )}
            
            {/* Lista de usuarios */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <UserList key={refresh} currentUser={user} />
              </div>
            </div>
          </div>
        );
      
      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <p className="mt-1 text-sm text-gray-600">
                Administra las categorías de productos del sistema
              </p>
            </div>
            
            {/* Botón para mostrar/ocultar formulario */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lista de Categorías</h3>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showCategoryForm
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {showCategoryForm ? 'Cancelar' : '+ Nueva Categoría'}
              </button>
            </div>

            {/* Formulario colapsable */}
            {showCategoryForm && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                  <CategoryForm
                    onCategoryAdded={handleCategoryAdded}
                    onCancel={handleCancelEdit}
                    editingCategory={editingCategory}
                  />
                </div>
              </div>
            )}
            
            {/* Lista de categorías */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <CategoryList
                  key={refresh}
                  onEditCategory={handleEditCategory}
                  refresh={refresh}
                />
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
