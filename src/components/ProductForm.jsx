import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      }),
    });
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
    onProductAdded();
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
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Precio"
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        fullWidth
        required
      />
      <Button variant="contained" type="submit">Agregar Producto</Button>
    </form>
  );
}