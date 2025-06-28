import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api.js';

export default function UserForm({ onUserAdded, onCancel }) {
  const [form, setForm] = useState({ 
    nombre: '', 
    apellido: '', 
    userName: '', 
    password: '', 
    email: '', 
    telefono: '', 
    rolId: '' 
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar roles disponibles
  useEffect(() => {
    apiGet('/api/roles')
      .then(data => setRoles(data))
      .catch(err => console.error('Error cargando roles:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Preparar datos del usuario
      const userData = {
        nombre: form.nombre,
        apellido: form.apellido,
        userName: form.userName,
        password: form.password,
        email: form.email || null,
        telefono: form.telefono || null,
        rolId: form.rolId ? parseInt(form.rolId) : 1, // Default: rol administrador
        activo: true,
        fechaCreacion: new Date().toISOString()
      };

      await apiPost('/api/usuarios', userData);

      // Limpiar formulario y actualizar lista
      setForm({ 
        nombre: '', 
        apellido: '', 
        userName: '', 
        password: '', 
        email: '', 
        telefono: '', 
        rolId: '' 
      });
      
      onUserAdded && onUserAdded();
      alert('Usuario creado exitosamente');
      
    } catch (err) {
      console.error('Error creando usuario:', err);
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido *</label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de Usuario *</label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña *</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol *</label>
        <select
          name="rolId"
          value={form.rolId}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.nombre} - {role.descripcion}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className={`px-4 py-2 text-white rounded-md font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
}