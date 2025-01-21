// src/components/Categories.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const data = await res.json();
      if (res.ok) {        
        setCategories(data);
      } else {
        console.error('Error al obtener las categorías:', data.error);
        setError(data.error);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar categorías');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Categorías Destacadas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          categories.map(category => (
            <Link to={`/categoria/${category.id}`} key={category.id} className="transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gray-100 p-4 rounded shadow hover:shadow-lg">
              {category.imagen ? (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}/uploads/categories/${category.imagen}`} 
                    alt={category.nombre} 
                    className="w-full h-32 object-cover mb-2 rounded" 
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-300 mb-2 rounded flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <h3 className="text-lg font-medium text-center">{category.nombre}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Categories;