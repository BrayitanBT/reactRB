import React, { useState } from "react";
import { Pizza, CircleUserRound, ShoppingCart } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import styles from './header.module.css';
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function Header() {
    const { user } = useAuth();
    const { getTotalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();
    
    const totalItems = getTotalItems();

    const handleViewCart = () => {
        setIsCartOpen(false);
        navigate('/cart');
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.logo}>
                <Pizza/>
                <h1>Fastie</h1>
            </div>

            <nav className={styles.nav}>
                <ul className={styles.menu}>
                    <li><NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>Inicio</NavLink></li>
                    <li><NavLink to="/menu" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>Menú</NavLink></li>
                    <li><NavLink to="/sede" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>Sedes</NavLink></li>
                    <li><NavLink to="/nosotros" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link }>Sobre Nosotros</NavLink></li>
                </ul>
            </nav>

            <div className={styles.headerActions}>
                {/* ✅ Carrito Simplificado */}
                {user && (
                    <div className={styles.cartContainer}>
                        <button 
                            className={styles.cartButton}
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            title="Ver carrito"
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className={styles.cartBadge}>
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Dropdown simple */}
                        {isCartOpen && (
                            <div className={styles.cartDropdown}>
                                <div className={styles.cartDropdownContent}>
                                    {totalItems === 0 ? (
                                        <div className={styles.emptyCartMessage}>
                                            <p>Tu carrito está vacío</p>
                                            <small>Agrega productos desde el menú</small>
                                        </div>
                                    ) : (
                                        <div className={styles.emptyCartMessage}>
                                            <p>Tienes {totalItems} producto{totalItems !== 1 ? 's' : ''} en el carrito</p>
                                            <small>Haz clic para ver detalles</small>
                                        </div>
                                    )}
                                    
                                    <button onClick={handleViewCart} className={styles.viewCartBtn}>
                                        <ShoppingCart size={16} />
                                        Ver Carrito
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Botón de Perfil/Ingresar */}
                {user 
                    ? (
                        <NavLink to="/profile">
                            <button className={styles.ingresar}>
                                <CircleUserRound />
                                <span>Perfil</span>
                            </button>
                        </NavLink>
                    ) : (
                        <NavLink to="/log-in">
                            <button className={styles.ingresar}>
                                <CircleUserRound />
                                <span>Ingresar</span>
                            </button>
                        </NavLink>
                    )
                }
            </div>
        </header>
    );
}