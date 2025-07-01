import React from 'react';

export default function Layout({ user, onLogout, children, currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Catálogo de Productos', icon: '📦' },
    { id: 'categories', label: 'Categorías', icon: '🏷️' },
    { id: 'inventory', label: 'Gestión de Stock', icon: '📋' },
    { id: 'movements', label: 'Movimientos', icon: '📈' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
  ];

  // Agregar logs solo para administradores
  const adminMenuItems = user?.rol?.esAdministrador 
    ? [...menuItems, { id: 'logs', label: 'Logs de Usuario', icon: '📋' }]
    : menuItems;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Inventario BAS
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.nombre} {user.apellido}</span>
                <span className="text-gray-500 ml-2">({user.userName})</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}