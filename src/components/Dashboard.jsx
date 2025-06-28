import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api.js';

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    valorTotalInventario: 0,
    productosStockBajo: 0,
    movimientosRecientes: [],
    topCategorias: []
  });
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await apiGet('/api/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async () => {
    setUpdatingUser(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const updatedUser = await apiPost('/api/auth/validate', { token: token });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Recargar la página para aplicar los cambios
      window.location.reload();
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error al actualizar información del usuario');
    } finally {
      setUpdatingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Bienvenido al sistema de inventario, {user.nombre}
            {user.rol && (
              <span className="ml-2 text-blue-600">({user.rol.nombre})</span>
            )}
          </p>
        </div>
        
        {/* Botón para actualizar información del usuario si no tiene rol */}
        {!user.rol && (
          <button
            onClick={updateUserInfo}
            disabled={updatingUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {updatingUser ? 'Actualizando...' : 'Actualizar Permisos'}
          </button>
        )}
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Productos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.totalProductos}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valor Total Inventario
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : `$${stats.valorTotalInventario?.toLocaleString() || 0}`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">⚠️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Stock Bajo
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.productosStockBajo}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Usuarios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.totalUsuarios}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Movimientos Recientes
          </h3>
          <div className="mt-5">
            {loading ? (
              <div className="text-sm text-gray-500">Cargando...</div>
            ) : stats.movimientosRecientes && stats.movimientosRecientes.length > 0 ? (
              <div className="space-y-3">
                {stats.movimientosRecientes.map((movimiento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        movimiento.tipoMovimiento === 'Entrada' ? 'bg-green-500' : 
                        movimiento.tipoMovimiento === 'Salida' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{movimiento.producto}</p>
                        <p className="text-sm text-gray-500">
                          {movimiento.tipoMovimiento}: {movimiento.cantidad} unidades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{movimiento.usuario}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(movimiento.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>No hay movimientos recientes para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Categorías */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Categorías Principales
          </h3>
          <div className="mt-5">
            {loading ? (
              <div className="text-sm text-gray-500">Cargando...</div>
            ) : stats.topCategorias && stats.topCategorias.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.topCategorias.map((categoria) => (
                  <div key={categoria.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: categoria.color }}
                      >
                        {categoria.icono}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{categoria.nombre}</h4>
                        <p className="text-sm text-gray-500">{categoria.totalProductos} productos</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-lg font-semibold text-gray-900">
                        ${categoria.valorInventario?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500">Valor de inventario</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>No hay categorías para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
