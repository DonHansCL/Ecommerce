// src/components/Navbar.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle, FaSearch } from 'react-icons/fa';


function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Cierra el menú de perfil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 w-auto" src="/images/logo.png" alt="Ecommerce Logo" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex ml-6 space-x-4">
              <Link
                to="/"
                className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              >
                Inicio
              </Link>
              <Link
                to="/catalog"
                className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              >
                Catálogo
              </Link>
              
              {payload && payload.rol === 'administrador' && (
                <Link
                  to="/admin"
                  className="text-md font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 mt-1 mr-2"
              >
                <FaSearch className="h-4 w-4 text-gray-500" />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <FaUserCircle size={24} />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                  {token ? (
                    <>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Ver Perfil
                      </Link>
                      <Link
                        to="/dashboard/edit-profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Editar Perfil
                      </Link>
                      <Link
                        to="/dashboard/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Mis Pedidos
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
            >
              <FaShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-4 pt-4 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/catalog"
              className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            
            {payload && payload.rol === 'administrador' && (
              <Link
                to="/admin"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Authentication Buttons */}
            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;