import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del producto"
        required
      />
      <input
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        required
      />
      <input
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
        required
      />
      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
      />
      <button type="submit">Agregar Producto</button>
    </form>
  );
}