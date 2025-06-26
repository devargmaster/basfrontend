import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

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
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <TextField
        label="ID Producto"
        name="productoId"
        value={form.productoId}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Cantidad"
        name="cantidad"
        type="number"
        value={form.cantidad}
        onChange={handleChange}
        fullWidth
      />
      <Button variant="contained" type="submit">Agregar</Button>
    </form>
  );
}