import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function RelatedProducts({ categoriaId, currentProductId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchRelated();
  }, [categoriaId]);

  const fetchRelated = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoriaId}/products?limit=4`);
      if (!res.ok) throw new Error('Error al cargar productos relacionados.');
      const data = await res.json();
      // Excluir el producto actual
      const filtered = data.filter(p => p.id !== currentProductId);
      setRelated(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Productos Relacionados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((producto) => (
          <div key={producto.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <Link to={`/product/${producto.id}`}>
              <img
                src={`http://localhost:5000/${producto.imagenes[0]}`}
                alt={producto.nombre}
                className="w-full h-48 object-cover cursor-pointer"
              />
            </Link>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800">{producto.nombre}</h4>
              <p className="text-gray-600 mb-2">${producto.precio}</p>
              <Link to={`/product/${producto.id}`} className="text-indigo-600 hover:underline">
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;