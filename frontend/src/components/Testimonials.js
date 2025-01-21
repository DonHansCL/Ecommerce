// src/components/Testimonials.js
import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Juan Pérez',
      comment: 'Excelente servicio y productos de alta calidad.',
    },
    {
      id: 2,
      name: 'María Gómez',
      comment: 'Me encantaron las compras, volveré pronto.',
    },
    // Agrega más testimonios según sea necesario
  ];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Lo que Dicen Nuestros Clientes</h2>
      <div className="flex flex-col gap-4">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-gray-100 p-4 rounded shadow">
            <p className="italic">"{testimonial.comment}"</p>
            <p className="mt-2 text-right font-semibold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;