import React, { useState, useEffect } from 'react';
import { apiPost, apiPut } from '../utils/api.js';

export default function CategoryForm({ onCategoryAdded, editingCategory, onEditCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    color: '#3B82F6',
    icono: '📦',
    orden: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Iconos predefinidos
  const iconos = ['📦', '💻', '📁', '🔧', '⚡', '🎯', '📊', '🏷️', '📱', '🎨', '🔒', '⚙️'];
  
  // Colores predefinidos
  const colores = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  useEffect(() => {
    if (editingCategory) {
      setForm({
        nombre: editingCategory.nombre || '',
        descripcion: editingCategory.descripcion || '',
        codigo: editingCategory.codigo || '',
        color: editingCategory.color || '#3B82F6',
        icono: editingCategory.icono || '📦',
        orden: editingCategory.orden || 1
      });
    } else {
      setForm({
        nombre: '',
        descripcion: '',
        codigo: '',
        color: '#3B82F6',
        icono: '📦',
        orden: 1
      });
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const categoryData = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        codigo: form.codigo ? form.codigo.toUpperCase() : null,
        color: form.color,
        icono: form.icono,
        orden: parseInt(form.orden),
        activo: true
      };

      if (editingCategory) {
        categoryData.id = editingCategory.id;
        await apiPut(`/api/categorias/${editingCategory.id}`, categoryData);
      } else {
        await apiPost('/api/categorias', categoryData);
      }

      // Reset form
      setForm({
        nombre: '',
        descripcion: '',
        codigo: '',
        color: '#3B82F6',
        icono: '📦',
        orden: 1
      });

      if (onCategoryAdded) {
        onCategoryAdded();
      }
      
      if (editingCategory && onEditCancel) {
        onEditCancel();
      }

      alert(editingCategory ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');

    } catch (err) {
      console.error('Error guardando categoría:', err);
      setError(err.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código *
          </label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 uppercase"
            required
            maxLength={10}
            placeholder="ej: ELEC, OFIC"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Icono
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {iconos.map(icono => (
              <button
                key={icono}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, icono }))}
                className={`p-2 text-xl border rounded ${
                  form.icono === icono 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {icono}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {colores.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, color }))}
                className={`w-8 h-8 rounded border-2 ${
                  form.color === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Orden
          </label>
          <input
            type="number"
            name="orden"
            value={form.orden}
            onChange={handleChange}
            min={1}
            max={999}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
        
        {editingCategory && onEditCancel && (
          <button
            type="button"
            onClick={onEditCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
