import React, { useEffect, useState } from 'react';
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
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
    setEditName(product.nombre);
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      // Guardamos todos los campos necesarios para el PUT
      fullProduct: product
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    try {
      console.log('Datos a enviar para edición:', editForm);
      
      // Crear el objeto completo manteniendo todos los campos originales
      // pero actualizando solo los que se editaron
      const updatedProduct = {
        ...editForm.fullProduct,
        nombre: editForm.nombre,
        descripcion: editForm.descripcion,
        precio: Number(editForm.precio),
        stock: Number(editForm.stock),
        modificado: new Date().toISOString()
      };
      
      console.log('Producto completo a enviar:', updatedProduct);
      
      const response = await fetch(`${baseUrl}/api/productos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en edición:', errorData);
        alert(`Error al editar: ${response.status} - ${errorData}`);
        return;
      }
      
      console.log('Producto editado exitosamente');
      setEditingId(null);
      setEditName('');
      setEditForm({ nombre: '', descripcion: '', precio: '', stock: '', fullProduct: null });
      fetchProducts();
    } catch (err) {
      console.error('Error al editar producto:', err);
      alert('Error de conexión al editar el producto');
    }
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
                type="text"
                name="descripcion"
                value={editForm.descripcion}
                onChange={handleEditChange}
                placeholder="Descripción"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="precio"
                step="0.01"
                value={editForm.precio}
                onChange={handleEditChange}
                placeholder="Precio"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="stock"
                value={editForm.stock}
                onChange={handleEditChange}
                placeholder="Stock"
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
              <div className="font-bold">{p.nombre}</div>
              <div>{p.descripcion}</div>
              <div className="text-sm">Precio: ${p.precio} | Stock: {p.stock}</div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(p)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}