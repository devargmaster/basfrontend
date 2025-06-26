import React, { useRef } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import InventoryForm from './components/InventoryForm';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

export default function App() {
  const listRef = useRef();

  // Puedes usar un estado o un ref para forzar el refresco del listado tras agregar
  const [refresh, setRefresh] = React.useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Productos</h1>
      <ProductForm onProductAdded={() => setRefresh(r => !r)} />
      <ProductList key={refresh} />
      <h2 className="text-xl font-bold">Movimiento de Inventario</h2>
      <InventoryForm />
      <h2 className="text-xl font-bold">Usuarios</h2>
      <UserForm onUserAdded={() => setRefresh(r => !r)} />
      <UserList key={`users-${refresh}`} />
    </div>
  );
}