import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function AdminProductsList({ products, onEdit, onDelete }) {
  const renderSpecifications = (specs) => {
    if (!specs || Object.keys(specs).length === 0) return 'N/A';
    
    return (
      <div className="space-y-1">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex items-center text-sm">
            <span className="font-medium text-gray-600 min-w-[100px]">{key}:</span>
            <span className="text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especificaciones
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={`http://localhost:5000/${product.imagenes?.[0] || 'default.jpg'}`}
                        alt={product.nombre}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div>Precio: ${product.precio}</div>
                    <div>Stock: {product.cantidadEnStock}</div>
                    <div className="text-sm text-gray-500">
                      Categoría: {product.Category?.nombre || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs overflow-hidden">
                    {renderSpecifications(product.especificaciones)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <FiEdit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductsList;