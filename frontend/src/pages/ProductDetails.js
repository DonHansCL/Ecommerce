import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      if (res.status === 404) {
        setError('Producto no encontrado.');
        return;
      }
      if (!res.ok) throw new Error('Error al obtener el producto.');
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (cantidad < 1) {
      setError('La cantidad debe ser al menos 1.');
      return;
    }

    try {
      await addToCart(product, cantidad);
      navigate('/cart');
    } catch (err) {
      setError('Error al agregar el producto al carrito.');
    }
  };

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto p-4">Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {product.imagenes && product.imagenes.length > 0 ? (
          <img src={`http://localhost:5000/${product.imagenes[0]}`} alt={product.nombre} className="w-1/2 h-auto object-cover" />
        ) : (
          <div className="w-1/2 h-auto bg-gray-200 flex items-center justify-center">No hay imágenes disponibles</div>
        )}
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold">{product.nombre}</h2>
          <p className="text-gray-700 mt-2">{product.descripcion}</p>
          <p className="text-xl font-semibold mt-2">${product.precio}</p>
          <p className="mt-2">Stock Disponible: {product.cantidadEnStock}</p>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="mt-4 flex items-center">
            <input
              type="number"
              min="1"
              max={product.cantidadEnStock}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="border p-1 w-20"
            />
            <button onClick={handleAddToCart} className="ml-4 bg-blue-500 text-white px-4 py-2">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;