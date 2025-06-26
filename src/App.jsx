import React, { useRef } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

export default function App() {
  const listRef = useRef();

  // Puedes usar un estado o un ref para forzar el refresco del listado tras agregar
  const [refresh, setRefresh] = React.useState(false);

  return (
    <div>
      <h1>Productos</h1>
      <ProductForm onProductAdded={() => setRefresh(r => !r)} />
      <ProductList key={refresh} />
    </div>
  );
}