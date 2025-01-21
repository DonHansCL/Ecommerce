// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información de la Empresa */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sobre Nosotros</h3>
          <p className="text-gray-400">
            Somos una tienda en línea dedicada a ofrecer productos de alta calidad a precios competitivos. Nuestro compromiso es la satisfacción de nuestros clientes.
          </p>
        </div>
        {/* Enlaces de Navegación */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Enlaces Útiles</h3>
          <ul>
            <li className="mb-2">
              <Link to="/" className="text-gray-400 hover:text-white">Inicio</Link>
            </li>
            <li className="mb-2">
              <Link to="/categorias" className="text-gray-400 hover:text-white">Categorías</Link>
            </li>
            <li className="mb-2">
              <Link to="/contacto" className="text-gray-400 hover:text-white">Contacto</Link>
            </li>
            <li className="mb-2">
              <Link to="/terminos" className="text-gray-400 hover:text-white">Términos y Condiciones</Link>
            </li>
          </ul>
        </div>
        {/* Redes Sociales */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
          </div>
        </div>
      </div>
      {/* Derechos de Autor */}
      <div className="mt-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;