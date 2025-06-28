import React, { useEffect, useState } from 'react';

export default function InventoryMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/inventario/movimientos`);
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const getMovementTypeColor = (tipo) => {
    switch (tipo) {
      case 'Entrada':
        return 'bg-green-100 text-green-800';
      case 'Salida':
        return 'bg-red-100 text-red-800';
      case 'Ajuste':
        return 'bg-blue-100 text-blue-800';
      case 'Merma':
        return 'bg-orange-100 text-orange-800';
      case 'Transferencia':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementIcon = (tipo) => {
    switch (tipo) {
      case 'Entrada':
        return '⬆️';
      case 'Salida':
        return '⬇️';
      case 'Ajuste':
        return '🔧';
      case 'Merma':
        return '🗑️';
      case 'Transferencia':
        return '🔄';
      default:
        return '📝';
    }
  };

  const filteredMovements = movements.filter(movement => {
    if (filter === 'all') return true;
    return movement.tipoMovimiento === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando movimientos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Movimientos de Inventario</h2>
          <p className="mt-1 text-sm text-gray-600">
            Historial de todas las transacciones de inventario
          </p>
        </div>
        
        {/* Filtros */}
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos los movimientos</option>
            <option value="Entrada">Solo Entradas</option>
            <option value="Salida">Solo Salidas</option>
            <option value="Ajuste">Solo Ajustes</option>
            <option value="Merma">Solo Mermas</option>
            <option value="Transferencia">Solo Transferencias</option>
          </select>
          
          <button
            onClick={fetchMovements}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3">⬆️</div>
            <div>
              <div className="text-sm font-medium text-green-800">Entradas</div>
              <div className="text-lg font-bold text-green-900">
                {movements.filter(m => m.tipoMovimiento === 'Entrada').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-2xl mr-3">⬇️</div>
            <div>
              <div className="text-sm font-medium text-red-800">Salidas</div>
              <div className="text-lg font-bold text-red-900">
                {movements.filter(m => m.tipoMovimiento === 'Salida').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-600 text-2xl mr-3">🔧</div>
            <div>
              <div className="text-sm font-medium text-blue-800">Ajustes</div>
              <div className="text-lg font-bold text-blue-900">
                {movements.filter(m => m.tipoMovimiento === 'Ajuste').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-gray-600 text-2xl mr-3">📝</div>
            <div>
              <div className="text-sm font-medium text-gray-800">Total</div>
              <div className="text-lg font-bold text-gray-900">
                {movements.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de movimientos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No hay movimientos para mostrar</div>
            <div className="text-gray-400 text-sm">Los movimientos aparecerán aquí una vez que se realicen</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(movement.fechaMovimiento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {movement.productoNombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {movement.productoId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementTypeColor(movement.tipoMovimiento)}`}>
                        <span className="mr-1">{getMovementIcon(movement.tipoMovimiento)}</span>
                        {movement.tipoMovimiento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={movement.cantidadMovimiento > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {movement.cantidadMovimiento > 0 ? '+' : ''}{movement.cantidadMovimiento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-xs">
                        <div>Anterior: {movement.cantidadAnterior}</div>
                        <div className="font-medium">Final: {movement.cantidadFinal}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.usuarioNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.numeroDocumento || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.motivo || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
