// src/components/AdminCategoriesList.js
import React, { useEffect, useState } from 'react';
import EditCategory from './EditCategory';
import AddCategory from './AddCategory';
import { toast } from 'react-toastify';

function AdminCategoriesList({ onCategoryUpdated }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [addingCategory, setAddingCategory] = useState(false); // Nuevo estado para añadir categoría
  
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al obtener las categorías');
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const handleDelete = async (id) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
  
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || 'Categoría eliminada exitosamente.');
          fetchCategories();
        } else {
          toast.error(data.error || 'Error al eliminar la categoría.');
        }
      } catch (err) {
        toast.error('Error al eliminar la categoría.');
        console.error('Error al eliminar la categoría:', err);
      }
    };
  
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Listado de Categorías</h3>
        <button
          onClick={() => setAddingCategory(true)}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
        >
          Añadir Nueva Categoría
        </button>
        {loading ? (
          <div>Cargando categorías...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Nombre</th>
                <th className="py-2">Descripción</th>
                <th className="py-2">Imagen</th> {/* Nueva columna para la imagen */}
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.id} className="text-center border-t">
                    <td className="py-2">{category.id}</td>
                    <td className="py-2">{category.nombre}</td>
                    <td className="py-2">{category.descripcion}</td>
                    <td className="py-2">
                      {category.imagen ? (
                        <img 
                          src={`${process.env.REACT_APP_API_URL}/uploads/categories/${category.imagen}`} 
                          alt={category.nombre} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="mr-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                      >
                        <i className="fas fa-trash-alt"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4">No hay categorías disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {editingCategory && (
          <EditCategory
            category={editingCategory}
            onSuccess={() => { setEditingCategory(null); fetchCategories(); }}
            onCancel={() => setEditingCategory(null)}
          />
        )}
        {addingCategory && (
          <AddCategory
            onSuccess={() => { setAddingCategory(false); fetchCategories(); }}
            onCancel={() => setAddingCategory(false)}
          />
        )}
      </div>
    );
  }
  
  export default AdminCategoriesList;