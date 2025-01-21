// src/components/AdminProductsList.js
import React, { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { toast } from 'react-toastify';

function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) {
        throw new Error('No se pudieron cargar los productos.');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Producto eliminado exitosamente.');
        fetchProducts();
      } else {
        toast.error(data.error || 'Error al eliminar el producto.');
      }
    } catch (err) {
      toast.error('Error al eliminar el producto.');
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Añadir Nuevo Producto
      </button>
      {isAdding && (
        <AddProduct
          onSuccess={() => { setIsAdding(false); fetchProducts(); }}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          onSuccess={() => { setEditingProduct(null); fetchProducts(); }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      {loading ? (
        <div>Cargando productos...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Categoría</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="text-center border-t">
                  <td className="py-2">{product.id}</td>
                  <td className="py-2">{product.nombre}</td>
                  <td className="py-2">${product.precio}</td>
                  <td className="py-2">{product.cantidadEnStock}</td>
                  <td className="py-2">{product.Categoria ? product.Categoria.nombre : 'N/A'}</td>
                  <td className="py-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4">No hay productos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductsList;