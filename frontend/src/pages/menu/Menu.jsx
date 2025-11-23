import React, { useState } from 'react';
import styles from "./menu.module.css";
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import CardContainer from '../../components/card/cardContainer';

const Menu = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const categorias = [
    { id: 'Todos', nombre: 'Todos' },
    { id: 'Pizza', nombre: 'Pizzas' },
    { id: 'Hamburguesa', nombre: 'Hamburguesas' },
    { id: 'Empanada', nombre: 'Empanadas' },
    { id: 'Bebida', nombre: 'Bebidas' },
    { id: 'Postre', nombre: 'Postres' }
  ];

  return (
    <div>
      <Header/>

      <div className={styles.buttonsContainer}>
        {categorias.map((categoria) => (
          <button 
            key={categoria.id}
            className={`${styles.buttons} ${
              categoriaActiva === categoria.id ? styles.buttonActive : ''
            }`}
            onClick={() => setCategoriaActiva(categoria.id)}
          >
            <span>{categoria.nombre}</span>
          </button>
        ))}
      </div>

      <div className={styles.targetsContainer}>
        <CardContainer categoriaFiltro={categoriaActiva} />
      </div>
      
      <Footer/>
    </div>
  );
};

export default Menu;