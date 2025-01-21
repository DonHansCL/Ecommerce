// src/components/Banner.js
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Banner() {
  return (
    <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      interval={5000}
      showStatus={false}
      swipeable
      dynamicHeight={false}
      className="mb-8"
    >
      <div>
        <img src="/images/banner1.jpg" alt="Banner 1" className="object-cover w-full h-64 md:h-96" loading="lazy" />
        <p className="legend">¡Bienvenido a Nuestra Tienda!</p>
      </div>
      <div>
        <img src="/images/banner2.jpg" alt="Banner 2" className="object-cover w-full h-64 md:h-96" loading="lazy" />
        <p className="legend">Descubre las Mejores Ofertas</p>
      </div>
      <div>
        <img src="/images/banner3.jpg" alt="Banner 3" className="object-cover w-full h-64 md:h-96" loading="lazy" />
        <p className="legend">Calidad Garantizada</p>
      </div>
    </Carousel>
  );
}

export default Banner;