import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function EditProduct({ product, onSuccess, onCancel }) {
  const [nombre, setNombre] = useState(product.nombre);
  const [precio, setPrecio] = useState(product.precio);
  const [cantidadEnStock, setCantidadEnStock] = useState(product.cantidadEnStock);
  const [categoriaId, setCategoriaId] = useState(product.categoriaId);
  const [categorias, setCategorias] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [error, setError] = useState('');
  const [imagenesExistentes, setImagenesExistentes] = useState(product.imagenes || []);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [descripcion, setDescripcion] = useState(product.descripcion);

  // Obtener las categorías disponibles
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      if (!res.ok) {
        throw new Error('No se pudieron cargar las categorías.');
      }
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleImageChange = (e) => {
    setNuevasImagenes(e.target.files);
  };

  const handleEliminarImagen = (imagenPath) => {
    setImagenesAEliminar([...imagenesAEliminar, imagenPath]);
    setImagenesExistentes(imagenesExistentes.filter(img => img !== imagenPath));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!nombre || !precio || !cantidadEnStock || !categoriaId) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (isNaN(precio) || parseFloat(precio) <= 0) {
      setError('El precio debe ser un número positivo.');
      return;
    }

    if (!Number.isInteger(parseFloat(cantidadEnStock)) || parseInt(cantidadEnStock) < 0) {
      setError('La cantidad en stock debe ser un número entero no negativo.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', parseFloat(precio));
    formData.append('cantidadEnStock', parseInt(cantidadEnStock));
    formData.append('categoriaId', parseInt(categoriaId));

    // Agregar nuevas imágenes
    for (let i = 0; i < nuevasImagenes.length; i++) {
      formData.append('imagenes', nuevasImagenes[i]);
    }

    // Agregar imágenes a eliminar
    imagenesAEliminar.forEach(imgPath => {
      formData.append('imagenesAEliminar', imgPath);
    });


    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Producto actualizado exitosamente.');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al actualizar el producto.');
      }
    } catch (err) {
      setError('Error al actualizar el producto.');
    }
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">Editar Producto</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Precio:</label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Cantidad en Stock:</label>
          <input
            type="number"
            value={cantidadEnStock}
            onChange={(e) => setCantidadEnStock(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Categoría:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="w-full border p-2"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Imagenes Existentes:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {imagenesExistentes.length > 0 ? (
              imagenesExistentes.map((imgPath, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${imgPath}`}
                    alt={`Imagen ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleEliminarImagen(imgPath)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>No hay imágenes existentes.</p>
            )}
          </div>
        </div>
        <div>
          <label className="block">Nuevas Imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2"
          />
        </div>
        {/* Opcional: Previsualización de Nuevas Imágenes */}
        {nuevasImagenes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(nuevasImagenes).map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Nueva Imagen ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
            Actualizar Producto
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;