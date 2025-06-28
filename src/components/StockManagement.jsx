import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api.js';

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementForm, setMovementForm] = useState({
    tipoMovimiento: 'Entrada',
    cantidad: '',
    motivo: '',
    numeroDocumento: ''
  });

  const fetchProductsWithStock = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/api/inventario/productos-con-stock');
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos con stock:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsWithStock();
  }, []);

  const handleOpenMovementModal = (product) => {
    setSelectedProduct(product);
    setMovementForm({
      tipoMovimiento: 'Entrada',
      cantidad: '',
      motivo: '',
      numeroDocumento: ''
    });
    setShowMovementModal(true);
  };

  const handleCloseMovementModal = () => {
    setShowMovementModal(false);
    setSelectedProduct(null);
  };

  const handleMovementFormChange = (e) => {
    const { name, value } = e.target;
    setMovementForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateMovement = async (e) => {
    e.preventDefault();
    
    try {
      const userId = 1; 
      
      const requestData = {
        productoId: selectedProduct.id,
        tipoMovimiento: movementForm.tipoMovimiento,
        cantidad: parseInt(movementForm.cantidad),
        motivo: movementForm.motivo || 'Movimiento manual',
        usuarioId: userId,
        numeroDocumento: movementForm.numeroDocumento || null
      };

      console.log('Enviando movimiento:', requestData);

      await apiPost('/api/inventario/movimientos', requestData);

      alert('Movimiento creado exitosamente');
      handleCloseMovementModal();
      fetchProductsWithStock(); 
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      alert('Error de conexión al crear movimiento');
    }
  };

  const getStockStatusColor = (product) => {
    if (product.alertaStockBajo) return 'text-red-600 bg-red-50';
    if (product.stockActual > product.stockMaximo * 0.8) return 'text-green-600 bg-green-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStockStatusText = (product) => {
    if (product.alertaStockBajo) return 'Stock Bajo';
    if (product.stockActual > product.stockMaximo * 0.8) return 'Stock Normal';
    return 'Stock Medio';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Stock</h2>
        <p className="mt-1 text-sm text-gray-600">
          Visualiza y gestiona el inventario de productos
        </p>
      </div>

      {/* Tabla de productos con stock */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Min/Max
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.descripcion}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {product.id} | {product.codigoBarras}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categoriaNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.stockActual} {product.unidadMedida}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stockMinimo} / {product.stockMaximo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(product)}`}>
                      {getStockStatusText(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ubicacionFisica || 'No asignada'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenMovementModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md transition-colors"
                    >
                      Crear Movimiento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear movimiento */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Crear Movimiento de Inventario
              </h3>
              
              {selectedProduct && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedProduct.nombre}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock actual: {selectedProduct.stockActual} {selectedProduct.unidadMedida}
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateMovement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Movimiento
                  </label>
                  <select
                    name="tipoMovimiento"
                    value={movementForm.tipoMovimiento}
                    onChange={handleMovementFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Entrada">Entrada (Agregar stock)</option>
                    <option value="Salida">Salida (Reducir stock)</option>
                    <option value="Ajuste">Ajuste de inventario</option>
                    <option value="Merma">Merma</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={movementForm.cantidad}
                    onChange={handleMovementFormChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Motivo
                  </label>
                  <input
                    type="text"
                    name="motivo"
                    value={movementForm.motivo}
                    onChange={handleMovementFormChange}
                    placeholder="Ej: Compra, Venta, Ajuste por inventario físico"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número de Documento (Opcional)
                  </label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={movementForm.numeroDocumento}
                    onChange={handleMovementFormChange}
                    placeholder="Ej: FACT-001, COMP-002"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Crear Movimiento
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseMovementModal}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
