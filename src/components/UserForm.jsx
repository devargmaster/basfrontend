import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

export default function UserForm({ onUserAdded }) {
  const [form, setForm] = useState({ nombre: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: form.nombre, email: form.email }),
    });
    setForm({ nombre: '', email: '' });
    onUserAdded && onUserAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <TextField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        fullWidth
        required
      />
      <Button variant="contained" type="submit">Agregar Usuario</Button>
    </form>
  );
}
