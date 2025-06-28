import React, { useEffect, useState } from 'react';

export default function ProductList({ refresh }) {
  const [products, setProducts] = useState([]);
  const [productsWithStock, setProductsWithStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', precio: '' });
  const [showStock, setShowStock] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = () => {
    fetch(`${baseUrl}/api/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error consultando productos', err);
        setLoading(false);
      });
  };

  const fetchProductsWithStock = () => {
    fetch(`${baseUrl}/api/inventario/productos-con-stock`)
      .then((res) => res.json())
      .then((data) => {
        setProductsWithStock(data);
      })
      .catch((err) => {
        console.error('Error consultando productos con stock', err);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchProductsWithStock();
  }, []);

  // Efecto para refrescar cuando cambie el prop refresh
  useEffect(() => {
    if (refresh !== undefined) {
      fetchProducts();
      fetchProductsWithStock();
    }
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/api/productos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts();
        fetchProductsWithStock();
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error de conexión al eliminar el producto');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      fullProduct: product
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedProduct = {
        ...editForm.fullProduct,
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        precio: Number(editForm.precio),
        modificado: new Date().toISOString()
      };
      
      const response = await fetch(`${baseUrl}/api/productos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en edición:', errorData);
        alert(`Error al editar: ${response.status} - ${errorData}`);
        return;
      }
      
      setEditingId(null);
      setEditForm({ nombre: '', descripcion: '', precio: '', fullProduct: null });
      fetchProducts();
      fetchProductsWithStock();
    } catch (err) {
      console.error('Error al editar producto:', err);
      alert('Error de conexión al editar el producto');
    }
  };

  const getStockInfo = (productId) => {
    const stockProduct = productsWithStock.find(p => p.id === productId);
    return stockProduct || null;
  };

  const getStockStatusColor = (stockInfo) => {
    if (!stockInfo) return 'bg-gray-100 text-gray-800';
    if (stockInfo.alertaStockBajo) return 'bg-red-100 text-red-800';
    if (stockInfo.stockActual > stockInfo.stockMaximo * 0.8) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStockStatusText = (stockInfo) => {
    if (!stockInfo) return 'Sin stock registrado';
    if (stockInfo.alertaStockBajo) return 'Stock Bajo';
    if (stockInfo.stockActual > stockInfo.stockMaximo * 0.8) return 'Stock Normal';
    return 'Stock Medio';
  };

  if (loading) {
    return <p className="text-center py-4">Cargando productos...</p>;
  }

  const displayProducts = showStock ? productsWithStock : products;

  return (
    <div className="space-y-4">
      {/* Toggle entre vista normal y vista con stock */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {displayProducts.length} producto{displayProducts.length !== 1 ? 's' : ''}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowStock(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !showStock 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vista Catálogo
          </button>
          <button
            onClick={() => setShowStock(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showStock 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vista con Stock
          </button>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayProducts.map((p) => {
          const stockInfo = showStock ? p : getStockInfo(p.id);
          
          return (
            <div key={p.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              {editingId === p.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="nombre"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                    placeholder="Nombre"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <textarea
                    name="descripcion"
                    value={editForm.descripcion}
                    onChange={handleEditChange}
                    placeholder="Descripción"
                    rows="2"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="number"
                      name="precio"
                      step="0.01"
                      value={editForm.precio}
                      onChange={handleEditChange}
                      placeholder="Precio"
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Guardar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingId(null)} 
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900">{p.nombre}</div>
                      <div className="text-gray-600 text-sm">{p.descripcion}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="inline-block mr-4">ID: {p.id}</span>
                        {p.codigoBarras && <span className="inline-block mr-4">Código: {p.codigoBarras}</span>}
                        {p.marca && <span className="inline-block">Marca: {p.marca}</span>}
                      </div>
                    </div>
                    
                    {showStock && stockInfo && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Stock</div>
                        <div className="text-lg font-bold text-gray-900">
                          {stockInfo.stockActual} {stockInfo.unidadMedida}
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(stockInfo)}`}>
                          {getStockStatusText(stockInfo)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-green-600">
                        ${p.precio?.toLocaleString()}
                      </div>
                      {showStock && stockInfo && (
                        <div className="text-xs text-gray-500">
                          Min: {stockInfo.stockMinimo} | Max: {stockInfo.stockMaximo}
                          {stockInfo.ubicacionFisica && <br />}
                          {stockInfo.ubicacionFisica && `Ubicación: ${stockInfo.ubicacionFisica}`}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {displayProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg">No hay productos para mostrar</div>
          <div className="text-sm">Los productos aparecerán aquí una vez que se agreguen</div>
        </div>
      )}
    </div>
  );
}