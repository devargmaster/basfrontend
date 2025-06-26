import React, { useEffect, useState } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

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
    setEditName(product.nombre);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await fetch(`${baseUrl}/api/productos/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editName }),
    });
    setEditingId(null);
    setEditName('');
    fetchProducts();
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {editingId === p.id ? (
            <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
            </form>
          ) : (
            <>
              <strong>{p.nombre}</strong> - {p.descripcion} 
              <br />
              Precio: ${p.precio} | Stock: {p.stock}
              <br />
              <button onClick={() => handleEdit(p)}>Editar</button>
              <button onClick={() => handleDelete(p.id)}>Eliminar</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}