import React, { useEffect, useState, useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Catalog() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState({});

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchCategorias();
  }, []);

  
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


  useEffect(() => {
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
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [categoriaSeleccionada]);


  const handleAgregarAlCarrito = (producto) => {
    console.log(`Adding product ID: ${producto.id}`); // Debugging
    const cantidadSeleccionada = cantidad[producto.id] || 1;
    if (cantidadSeleccionada > producto.cantidadEnStock) {
      toast.error(
        `No puedes agregar más de ${producto.cantidadEnStock} unidades de ${producto.nombre}.`,
        { toastId: `stock-${producto.id}` }
      );
      return;
    }
    addToCart(producto, cantidadSeleccionada);
    setCantidad({ ...cantidad, [producto.id]: 1 });
    toast.success('Producto agregado al carrito', { toastId: `add-${producto.id}` });
  };

  const incrementarCantidad = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    setCantidad((prevCantidad) => {
      const currentCantidad = prevCantidad[productoId] || 1;
      if (currentCantidad < producto.cantidadEnStock) {
        return {
          ...prevCantidad,
          [productoId]: currentCantidad + 1
        };
      } else {
        return {
          ...prevCantidad,
          [productoId]: producto.cantidadEnStock
        };
      }
    });
  };

  const decrementarCantidad = (productoId) => {
    setCantidad((prevCantidad) => ({
      ...prevCantidad,
      [productoId]: prevCantidad[productoId] > 1 ? prevCantidad[productoId] - 1 : 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Descubre Nuestros Productos</h1>
        <p className="mt-4 text-lg text-gray-600">La mejor calidad al mejor precio</p>
      </header>

      {/* Filtro por Categoría Mejorado */}
      <div className="flex justify-center mb-12 flex-wrap gap-4">
        <button
          onClick={() => setCategoriaSeleccionada('')}
          className={`px-4 py-2 rounded-full ${
            categoriaSeleccionada === '' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
          } hover:bg-indigo-500 hover:text-white transition-colors`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
            className={`px-4 py-2 rounded-full ${
              categoriaSeleccionada === categoria.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-indigo-500 hover:text-white transition-colors`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg mx-auto mb-8" role="alert">
          {error}
        </div>
      )}

      {/* Spinner de Carga */}
      {loading ? (
        <div className="flex justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-400 h-20 w-20"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              {/* Imagen del Producto con Link al Detalle */}
              <Link to={`/product/${producto.id}`}>
                {producto.imagenes && producto.imagenes.length > 0 ? (
                  <img
                    src={`http://localhost:5000/${producto.imagenes[0]}`}
                    alt={producto.nombre}
                    className="w-full h-64 object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">No hay imágenes disponibles</div>
                )}
              </Link>

              {/* Información del Producto */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{producto.nombre}</h2>
                <p className="text-gray-500 mb-4">{producto.descripcion.substring(0, 100)}...</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gray-800">${producto.precio}</span>
                  <span className="text-sm text-gray-500">Stock: {producto.cantidadEnStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleAgregarAlCarrito(producto)}
                    className="flex items-center bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors duration-300"
                  >
                    <FaShoppingCart className="mr-2" />
                    Añadir
                  </button>

                  {/* Selector de Cantidad Mejorado */}
                  <div className="flex items-center">
                    <button
                      onClick={() => decrementarCantidad(producto.id)}
                      className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
                    >
                      <FiMinus />
                    </button>
                    <span className="mx-3 px-4 py-2 border border-gray-300 rounded-md text-center w-12 bg-gray-50">
                      {cantidad[producto.id] || 1}
                    </span>
                    <button
                      onClick={() => incrementarCantidad(producto.id)}
                      className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
                      disabled={(cantidad[producto.id] || 1) >= producto.cantidadEnStock}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estilos para el Spinner */}
      <style jsx>{`
        .loader {
          border-top-color: #4a5568;
          animation: spinner 1.5s linear infinite;
        }

        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Catalog;