import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);


  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoriaSeleccionada]);

  const fetchCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (!res.ok) throw new Error('No se pudieron cargar las categorías.');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:5000/api/products';
      if (categoriaSeleccionada) {
        url += `?categoria=${encodeURIComponent(categoriaSeleccionada)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudieron cargar los productos.');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Catálogo de Productos</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label htmlFor="categoria" className="mr-2">Filtrar por Categoría:</label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="border p-2"
        >
          <option value="">Todas</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="border p-4 flex flex-col">
                {product.imagenes && product.imagenes.length > 0 ? (
                  <img src={`http://localhost:5000/${product.imagenes[0]}`} alt={product.nombre} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
                )}
                <h3 className="text-lg font-semibold mt-2">{product.nombre}</h3>
                <p className="text-gray-700">${product.precio}</p>
                <div className="mt-auto">
                  <Link to={`/product/${product.id}`} className="text-blue-500">Ver Detalles</Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No hay productos disponibles en esta categoría.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Catalog;