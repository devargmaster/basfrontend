import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api.js';

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    marca: '',
    codigoBarras: '',
    unidadMedida: 'Unidades',
    stockMinimo: '',
    stockMaximo: '',
    ubicacionFisica: '',
    fechaVencimiento: '',
    proveedor: '',
    notas: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiGet('/api/categorias');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId),
        marca: form.marca,
        codigoBarras: form.codigoBarras,
        unidadMedida: form.unidadMedida,
        stockMinimo: parseInt(form.stockMinimo) || 0,
        stockMaximo: parseInt(form.stockMaximo) || 100,
        ubicacionFisica: form.ubicacionFisica,
        fechaVencimiento: form.fechaVencimiento || null,
        proveedor: form.proveedor,
        notas: form.notas,
        activo: true
      };

      await apiPost('/api/productos', productData);

      // Resetear formulario
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        categoriaId: '',
        marca: '',
        codigoBarras: '',
        unidadMedida: 'Unidades',
        stockMinimo: '',
        stockMaximo: '',
        ubicacionFisica: '',
        fechaVencimiento: '',
        proveedor: '',
        notas: ''
      });
      
      if (onProductAdded) {
        onProductAdded();
      }
      
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Laptop Dell Inspiron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Descripción detallada del producto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Dell, HP, Apple"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando Producto...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}