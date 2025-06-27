import React, { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', email: '' });

  const fetchUsers = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/api/usuarios`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error consultando usuarios', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/usuarios/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ nombre: user.nombre, email: user.email });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/usuarios/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm({ nombre: '', email: '' });
    fetchUsers();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <ul className="space-y-4">
      {users.map(u => (
        <li key={u.id} className="border p-4 rounded-md">
          {editingId === u.id ? (
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <input
                type="text"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
                placeholder="Nombre"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Guardar</button>
                <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</button>
              </div>
            </form>
          ) : (
            <div className="space-y-1">
              <div className="font-bold">{u.nombre}</div>
              <div>{u.email}</div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(u)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => handleDelete(u.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}