import React, { useState } from 'react';

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      console.log('Base URL:', baseUrl);
      
      // Validación previa y conversión
      const nombre = form.nombre.trim();
      const descripcion = form.descripcion.trim();
      const precio = parseFloat(form.precio);
      const stock = parseInt(form.stock, 10);
      
      // Validación adicional
      if (!nombre || !descripcion) {
        setError('Nombre y descripción son obligatorios');
        return;
      }
      
      if (isNaN(precio) || isNaN(stock) || precio <= 0 || stock < 0) {
        setError('Precio debe ser un número mayor a 0 y stock un número no negativo');
        return;
      }
      
      const productData = {
        nombre,
        descripcion,
        precio,
        stock
      };
      
      console.log('Datos del producto a crear:', productData);
      console.log('JSON final:', JSON.stringify(productData));
      
      const response = await fetch(`${baseUrl}/api/productos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        setError(`Error del servidor: ${response.status} - ${errorData}`);
        return;
      }
      
      const result = await response.json();
      console.log('Producto creado exitosamente:', result);
      
      setForm({ nombre: '', descripcion: '', precio: '', stock: '' });
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err) {
      console.error('Error al crear producto:', err);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
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
        step="0.01"
        min="0.01"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
        required
      />
      <input
        name="stock"
        type="number"
        min="0"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
      />
      <button type="submit">Agregar Producto</button>
    </form>
  );
}