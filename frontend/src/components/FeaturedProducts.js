// src/components/FeaturedProducts.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { CartContext } from '../context/CartContext';

// frontend/src/components/FeaturedProducts.js

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products?featured=true`);
      const data = await res.json();
      if (res.ok) {
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error('Error al cargar productos destacados:', data.error);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error al cargar productos destacados:', err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <Link to={`/producto/${product.id}`} className="flex-1">
                <LazyLoad height={200} offset={100} once>
                  <img src={`${process.env.REACT_APP_API_URL}/${product.imagenes[0]}`} alt={product.nombre} className="w-full h-48 object-cover mb-2 rounded" loading="lazy" />
                </LazyLoad>
                <h3 className="text-lg font-medium">{product.nombre}</h3>
                <p className="text-gray-700">${product.precio}</p>
              </Link>
              <div className="mt-2 flex justify-between items-center">
                <Link to={`/producto/${product.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                  Ver Producto
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos destacados disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default FeaturedProducts;