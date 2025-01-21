// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Usando react-icons para el ícono del carrito

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Calcula la cantidad total de items en el carrito
  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  // Decodificar el token para obtener el rol
  let payload;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      payload = null;
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="mr-6 font-bold text-xl">Inicio</Link>
        <Link to="/catalog" className="mr-6">Catálogo</Link>
        {token && <Link to="/orders" className="mr-6">Mis Pedidos</Link>}
        {payload && payload.rol === 'administrador' && (
          <Link to="/admin" className="mr-6">Admin</Link>
        )}
        {/* Ícono del Carrito Siempre Visible */}
        <Link to="/cart" className="relative">
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
      <div>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Cerrar Sesión
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4">Iniciar Sesión</Link>
            <Link to="/register" className="bg-blue-500 px-3 py-1 rounded">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;