import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';

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
              <TextField
                label="Nombre"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                fullWidth
                required
              />
              <div className="flex space-x-2">
                <Button variant="contained" type="submit">Guardar</Button>
                <Button variant="outlined" type="button" onClick={() => setEditingId(null)}>Cancelar</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-1">
              <div className="font-bold">{u.nombre}</div>
              <div>{u.email}</div>
              <div className="space-x-2">
                <Button size="small" variant="outlined" onClick={() => handleEdit(u)}>Editar</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(u.id)}>Eliminar</Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
