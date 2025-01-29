// src/components/FeaturedProducts.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { CartContext } from '../context/CartContext';
import { FaHeart } from 'react-icons/fa';


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
            <div
              key={product.id}
              className="relative max-w-xs mx-auto rounded-lg border border-gray-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <Link to={`/producto/${product.id}`} className="relative">
                <LazyLoad height={200} offset={100} once>
                  <img
                    src={`http://localhost:5000/${product.imagenes[0]}`}
                    alt={product.nombre}
                    className="w-full h-60 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </LazyLoad>
                {/* Badge de Descuento */}
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {product.discount}% OFF
                  </span>
                )}
                {/* Icono de Me Gusta */}
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100 transition"
                  onClick={() => {/* Funcionalidad para me gusta */}}
                >
                  <FaHeart className="h-5 w-5 text-red-500" />
                </button>
              </Link>
              <div className="mt-4 px-5 pb-5 flex-1 flex flex-col">
                <Link to={`/producto/${product.id}`}>
                  <h5 className="text-xl tracking-tight text-slate-900">{product.nombre}</h5>
                </Link>
                <p className="mt-2 text-gray-600 text-sm flex-1">
                  {product.descripcion
                    ? product.descripcion.length > 100
                      ? `${product.descripcion.substring(0, 100)}...`
                      : product.descripcion
                    : 'Descripción breve del producto.'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">${product.precio}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-900 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">No hay productos destacados disponibles.</div>
        )}
      </div>
    </div>
  );
}

export default FeaturedProducts;