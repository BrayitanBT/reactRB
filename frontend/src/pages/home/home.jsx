import React from "react";
import styles from './home.module.css';
//----Components
import Footer from "../../components/footer/footer.jsx";
import Card from "../../components/card/card.jsx";
import Header from "../../components/header/header.jsx";
import Carousel from '../../components/carousel/Carousel.jsx';

//----Images
import burguer from '../../assets/img/burguer.jpg';
import pizza from '../../assets/img/pizza.jpg';
import salchi from '../../assets/img/salchi.jpg';

export default function Home (){

    return(
        <div >

            <Header/>
            <div > 
              <Carousel/>
            </div>


            <h3 className={styles.title}>Conoce nuestro deliciosos productos</h3>
            <div className={styles.targetsContainer}>
                <Card 
                  image={burguer}
                  title="Hamburguesa"
                  size="Grande"
                  description="Rica hamburguesa artesanal con ingredientes frescos."
                  price="$23.000"
                />

                <Card 
                  image={pizza}
                  title="Pizza Fit"
                  size="Mediana"
                  description="Pizza saludable con base integral y queso bajo en grasa."
                  price="$18.000"
                />

                <Card 
                  image={salchi}
                  title="Wrap de Pollo"
                  size="Individual"
                  description="Delicioso wrap de pollo con verduras frescas y salsa ligera."
                  price="$15.000"
                />
            </div>
            <Footer/>

        </div>
    );
};