// src/pages/AdminPanel.js
import React, { useState } from 'react';
import AdminProductsList from '../components/AdminProductsList';
import AdminCategoriesList from '../components/AdminCategoriesList';
import AdminOrdersList from '../components/AdminOrdersList';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('productos');

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-tachometer-alt mr-2"></i> Panel de Administración
      </h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('productos')}
          className={`flex items-center px-4 py-2 rounded ${activeTab === 'productos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <i className="fas fa-box-open mr-2"></i> Productos
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={`flex items-center px-4 py-2 rounded ${activeTab === 'categorias' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <i className="fas fa-tags mr-2"></i> Categorías
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`flex items-center px-4 py-2 rounded ${activeTab === 'pedidos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <i className="fas fa-shopping-cart mr-2"></i> Pedidos
        </button>
      </div>

      {activeTab === 'productos' ? (
        <AdminProductsList />
      ) : activeTab === 'categorias' ? (
        <AdminCategoriesList />
      ) : (
        <AdminOrdersList />
      )}
    </div>
  );
}

export default AdminPanel;