import React, { useState } from 'react';

export default function InventoryForm() {
  const [form, setForm] = useState({ productoId: '', cantidad: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/inventario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productoId: Number(form.productoId),
        cantidad: Number(form.cantidad),
        fechaIngreso: new Date().toISOString(),
      }),
    })
      .then(() => setForm({ productoId: '', cantidad: 0 }))
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="productoId"
        placeholder="ID Producto"
        value={form.productoId}
        onChange={handleChange}
      />
      <input
        name="cantidad"
        type="number"
        placeholder="Cantidad"
        value={form.cantidad}
        onChange={handleChange}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}