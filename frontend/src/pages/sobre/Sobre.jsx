import React from "react";
import styles from "./sobre.module.css";
// ---- Imágenes
import compromiso from "../../assets/img/compromiso.jpg";
import mision from "../../assets/img/mision.jpg";
import richi from "../../assets/img/richi.png"; // cambia por tu imagen real
//-----Components
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

const Sobre = () => {
  return (
    <div>
        <Header/>
        <section className={styles.aboutSection}>
            
          <div className={styles.imageContainer}>
            <img src={richi} alt="Sobre nosotros" className={styles.image} />
            <div className={styles.overlayStripes}></div>
          </div>

          <div className={styles.textContainer}>
            <h2 className={styles.title}>SOBRE NOSOTROS</h2>
            <div className={styles.separator}></div>
            <p className={styles.text}>
              Hace algunos años, dos jóvenes soñadores <strong>—Ricardo Urrego y Brayan Bocanegra—</strong> pasaban noches enteras frente a sus computadores, programando entre cables, café y grandes ilusiones. Estudiaban Desarrollo de Software, sin imaginar que sus líneas de código algún día alimentarían al mundo... literalmente.

              Un día, mientras esperaban un pedido de comida que jamás llegó, nació la idea que cambiaría sus vidas:

              “¿Y si combinamos la tecnología con la comida rápida perfecta?”

              Así nació <strong>FASTIE</strong>, una revolución gastronómica creada desde un cuarto pequeño y un sueño gigantesco.
              Ricardo diseñó los sistemas inteligentes que controlaban cada pedido con precisión milimétrica, mientras Brayan ideaba menús futuristas y experiencias únicas.
              Lo que comenzó con un solo punto de venta se multiplicó como fuego: primero un barrio, luego una ciudad, después todo un país.

              Hoy, <strong>FASTIE</strong> no es solo una cadena de restaurantes: es un fenómeno global, símbolo de innovación, sabor y pasión.
              Sus locales automatizados, sus drones repartidores y sus menús digitales son prueba de que la visión y la perseverancia pueden transformar cualquier idea en un imperio.

              Ricardo y Brayan pasaron de programar sueños a dirigir una de las empresas más poderosas del planeta, recordándole al mundo que ningún código es tan poderoso como el del esfuerzo y la amistad.
            </p>
            <button className={styles.button}>Conócenos más</button>
          </div>
        </section>
         <div className={styles.container}>
      <h2 className={styles.title}>Sobre Nosotros</h2>

      <div className={styles.cardsContainer}>
        {/* Tarjeta 1 */}
        <div className={styles.card}>
          <img src={compromiso} alt="Compromiso social" className={styles.cardImg} />
          <div className={styles.cardContent}>
            <h3>Compromiso social y desarrollo sustentable</h3>
            <p>
              Visitá nuestra “Receta del futuro” y conocé cómo trabajamos para generar un impacto positivo
              en las comunidades en las que operamos y el medio ambiente.
            </p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className={styles.card}>
          <img src={mision} alt="Misión, Visión y Valores" className={styles.cardImg} />
          <div className={styles.cardContent}>
            <h3>Misión, Visión & Valores</h3>
            <p>
              Nuestra misión es servir comida de calidad generando momentos deliciosos y accesibles para todos.
              Haz click para conocer más sobre nuestra visión y valores.
            </p>
          </div>
        </div>
      </div>
    </div>
        <Footer/>
    </div>

  );
};

export default Sobre;
