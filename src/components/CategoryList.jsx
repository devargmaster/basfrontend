import React, { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '../utils/api.js';

export default function CategoryList({ refresh, onEdit }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await apiGet('/api/categorias');
      setCategories(data.sort((a, b) => a.orden - b.orden));
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    try {
      await apiDelete(`/api/categorias/${id}`);
      fetchCategories();
      alert('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error de conexión al eliminar categoría');
    }
  };

  const toggleActive = async (category) => {
    try {
      const updatedCategory = {
        ...category,
        activo: !category.activo
      };

      const response = await fetch(`${baseUrl}/api/categorias/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory)
      });

      if (response.ok) {
        fetchCategories();
        alert(`Categoría ${updatedCategory.activo ? 'activada' : 'desactivada'} exitosamente`);
      } else {
        alert('Error al actualizar categoría');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error de conexión al actualizar categoría');
    }
  };

  if (loading) {
    return <p className="text-center py-4">Cargando categorías...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {categories.length} categoría{categories.length !== 1 ? 's' : ''} registrada{categories.length !== 1 ? 's' : ''}
      </div>

      {categories.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No hay categorías registradas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icono}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.nombre}</h3>
                    <p className="text-sm text-gray-500">#{category.codigo}</p>
                  </div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: category.color }}
                  title={`Color: ${category.color}`}
                />
              </div>

              {category.descripcion && (
                <p className="text-sm text-gray-600 mb-3">{category.descripcion}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Orden: {category.orden}</span>
                <span className={`px-2 py-1 rounded-full ${
                  category.activo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="flex-1 text-indigo-600 hover:text-indigo-900 text-sm py-1 px-2 border border-indigo-300 rounded hover:bg-indigo-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(category)}
                  className={`flex-1 text-sm py-1 px-2 border rounded ${
                    category.activo
                      ? 'text-red-600 border-red-300 hover:bg-red-50'
                      : 'text-green-600 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {category.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 text-red-600 hover:text-red-900 text-sm py-1 px-2 border border-red-300 rounded hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
