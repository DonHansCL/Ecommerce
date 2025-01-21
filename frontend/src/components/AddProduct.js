import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AddProduct({ onSuccess, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState(''); // Nuevo estado para descripción
  const [precio, setPrecio] = useState('');
  const [cantidadEnStock, setCantidadEnStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  // Obtener las categorías disponibles
  const fetchCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
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
    const files = Array.from(e.target.files);
    setImagenes(files);

    // Crear URLs de previsualización
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !cantidadEnStock || !categoriaId) {
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
    formData.append('descripcion', descripcion); // Usar el estado de descripción
    formData.append('precio', parseFloat(precio));
    formData.append('cantidadEnStock', parseInt(cantidadEnStock));
    formData.append('categoriaId', parseInt(categoriaId));
    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Producto añadido exitosamente.');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al añadir el producto.');
      }
    } catch (err) {
      setError('Error al añadir el producto.');
    }
    previewImages.forEach(url => URL.revokeObjectURL(url));
  };




  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">Añadir Nuevo Producto</h3>
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
            value={descripcion} // Usar el estado de descripción
            onChange={(e) => setDescripcion(e.target.value)} // Manejador de cambio
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
          <label className="block">Imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2"
          />
        </div>
        {/* Previsualización de Imágenes */}
      <div className="flex flex-wrap gap-2 mt-2">
        {previewImages.map((src, index) => (
          <img key={index} src={src} alt={`Preview ${index}`} className="w-16 h-16 object-cover" />
        ))}
      </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Añadir Producto
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;