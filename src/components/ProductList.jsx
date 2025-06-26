import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  const fetchProducts = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    fetch(`${baseUrl}/api/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error consultando productos', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/productos/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/productos/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        precio: Number(editForm.precio),
        stock: Number(editForm.stock),
      }),
    });
    setEditingId(null);
    setEditForm({ nombre: '', descripcion: '', precio: '', stock: '' });
    fetchProducts();
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <ul className="space-y-4">
      {products.map((p) => (
        <li key={p.id} className="border p-4 rounded-md">
          {editingId === p.id ? (
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
                label="Descripción"
                name="descripcion"
                value={editForm.descripcion}
                onChange={handleEditChange}
                fullWidth
                required
              />
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={editForm.precio}
                onChange={handleEditChange}
                fullWidth
                required
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={editForm.stock}
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
              <div className="font-bold">{p.nombre}</div>
              <div>{p.descripcion}</div>
              <div className="text-sm">Precio: ${p.precio} | Stock: {p.stock}</div>
              <div className="space-x-2">
                <Button size="small" variant="outlined" onClick={() => handleEdit(p)}>Editar</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(p.id)}>Eliminar</Button>
              </div>
            </div>
          )
        </li>
        ))}
    </ul>
  );
}