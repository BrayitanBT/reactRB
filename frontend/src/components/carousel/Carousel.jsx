import React, { useState, useEffect } from "react";
import promo3 from '../../assets/img/promo3.jpg';
import promo2 from '../../assets/img/promo2.jpg';
import salchi from '../../assets/img/salchi.jpg';
import "./Carousel.css";

const images = [
  {
    src: salchi,
    title: "NOCHES Fastie",
    subtitle: "12 PRESAS + 6 PAPAS PQ",
    price: "$65.900",
  },
  {
    src: promo2,
    title: "COMBOS FAMILIARES",
    subtitle: "¡Disfruta con los tuyos!",
    price: "$79.900",
  },
  {
    src: promo3,
    title: "NUEVOS SABORES",
    subtitle: "Descubre nuestras nuevas recetas",
    price: "$59.900",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  // Transición automática cada 5 segundos
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="carousel">
      <button className="arrow left" onClick={prevSlide}>❮</button>

      {images.map((item, index) => (
        <div
          className={index === current ? "slide active" : "slide"}
          key={index}
        >
          {index === current && (
            <>
              <img src={item.src} alt={item.title} className="image" />
              <div className="caption">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
                <span>{item.price}</span>
              </div>
            </>
          )}
        </div>
      ))}

      <button className="arrow right" onClick={nextSlide}>❯</button>

      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}
