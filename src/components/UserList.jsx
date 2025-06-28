import React, { useEffect, useState } from 'react';
import { apiGet, apiDelete, apiPut } from '../utils/api.js';

export default function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    userName: '',
    email: '',
    telefono: '',
    rolId: '',
    activo: true
  });

  const fetchUsers = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        apiGet('/api/usuarios'),
        apiGet('/api/roles')
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setLoading(false);
    } catch (err) {
      console.error('Error consultando datos:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleName = (rolId) => {
    const role = roles.find(r => r.id === rolId);
    return role ? role.nombre : 'Sin rol';
  };

  const getRoleColor = (rolId) => {
    const role = roles.find(r => r.id === rolId);
    if (!role) return 'bg-gray-100 text-gray-800';
    
    switch (role.nombre.toLowerCase()) {
      case 'administrador':
        return 'bg-red-100 text-red-800';
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'empleado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditUser = (user) => {
    // El usuario actual siempre puede editarse a sí mismo (excepto cambiar su rol)
    if (currentUser?.id === user.id) return true;
    
    // Solo administradores pueden editar otros usuarios
    return currentUser?.rol?.esAdministrador || currentUser?.rol?.puedeGestionarUsuarios;
  };

  const canDeleteUser = (user) => {
    // No puede eliminarse a sí mismo
    if (currentUser?.id === user.id) return false;
    
    // Solo administradores pueden eliminar usuarios
    return currentUser?.rol?.esAdministrador;
  };

  const canChangeRole = (user) => {
    // Solo administradores pueden cambiar roles
    return currentUser?.rol?.esAdministrador && currentUser?.id !== user.id;
  };

  const handleDelete = async (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (!canDeleteUser(userToDelete)) {
      alert('No tienes permisos para eliminar este usuario');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }
    
    try {
      await apiDelete(`/api/usuarios/${id}`);
      fetchUsers();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error de conexión al eliminar usuario');
    }
  };

  const handleEdit = (user) => {
    if (!canEditUser(user)) {
      alert('No tienes permisos para editar este usuario');
      return;
    }

    setEditingId(user.id);
    setEditForm({
      nombre: user.nombre,
      apellido: user.apellido,
      userName: user.userName,
      email: user.email || '',
      telefono: user.telefono || '',
      rolId: user.rolId || '',
      activo: user.activo
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = {
        id: editingId,
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        userName: editForm.userName,
        email: editForm.email || null,
        telefono: editForm.telefono || null,
        rolId: editForm.rolId ? parseInt(editForm.rolId) : null,
        activo: editForm.activo,
        fechaModificacion: new Date().toISOString()
      };

      await apiPut(`/api/usuarios/${editingId}`, updatedUser);

      setEditingId(null);
      fetchUsers();
      alert('Usuario actualizado exitosamente');
      
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      alert(err.message || 'Error al actualizar usuario');
    }
  };

  if (loading) {
    return <p className="text-center py-4">Cargando usuarios...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
      </div>
      
      {users.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No hay usuarios registrados</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {editingId === user.id ? (
                    <td colSpan="5" className="px-4 py-4">
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                              type="text"
                              name="nombre"
                              value={editForm.nombre}
                              onChange={handleEditChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                              type="text"
                              name="apellido"
                              value={editForm.apellido}
                              onChange={handleEditChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Usuario</label>
                            <input
                              type="text"
                              name="userName"
                              value={editForm.userName}
                              onChange={handleEditChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                              type="tel"
                              name="telefono"
                              value={editForm.telefono}
                              onChange={handleEditChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Rol</label>
                            <select
                              name="rolId"
                              value={editForm.rolId}
                              onChange={handleEditChange}
                              disabled={!canChangeRole(users.find(u => u.id === editingId))}
                              className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 ${
                                !canChangeRole(users.find(u => u.id === editingId)) 
                                  ? 'bg-gray-100 cursor-not-allowed' 
                                  : ''
                              }`}
                            >
                              <option value="">Sin rol</option>
                              {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                  {role.nombre}
                                </option>
                              ))}
                            </select>
                            {!canChangeRole(users.find(u => u.id === editingId)) && (
                              <p className="text-xs text-gray-500 mt-1">
                                Solo administradores pueden cambiar roles
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="activo"
                            checked={editForm.activo}
                            onChange={handleEditChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label className="ml-2 block text-sm text-gray-900">Usuario activo</label>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            type="submit"
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Guardar
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.nombre} {user.apellido}
                          </div>
                          <div className="text-sm text-gray-500">@{user.userName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{user.email || 'Sin email'}</div>
                          <div className="text-sm text-gray-500">{user.telefono || 'Sin teléfono'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.rolId)}`}>
                          {getRoleName(user.rolId)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          {canEditUser(user) && (
                            <button 
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Editar
                            </button>
                          )}
                          {canDeleteUser(user) && (
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                          {currentUser?.id === user.id && (
                            <span className="text-xs text-gray-500 italic">
                              (Tú)
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}