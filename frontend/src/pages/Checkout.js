// src/pages/Checkout.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.precio * item.cantidad), 0
  ).toFixed(2);

  // Verificar carrito vacío
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('El carrito está vacío');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!direccion.trim()) {
        throw new Error('La dirección es requerida');
      }

      const res = await fetch('http://localhost:5000/api/pedidos/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          direccionEnvio: direccion,
          metodoPago
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      await clearCart();
      toast.success('Pedido realizado exitosamente');
      navigate('/orders');

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <Navigate to="/cart" />;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Finalizar Compra</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario de Checkout */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Información de Envío</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Dirección de Envío</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu dirección completa"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="tarjeta">Tarjeta de Crédito</option>
                <option value="paypal">PayPal</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img
                    src={`http://localhost:5000/${item.product.imagenes[0]}`}
                    alt={item.product.nombre}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-medium">{item.product.nombre}</p>
                    <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.product.precio * item.cantidad).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;