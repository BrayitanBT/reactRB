import React, { useEffect, useState, useMemo } from 'react';
import ProductCard, { ProductCardSkeleton } from './card';
import { apiService } from '../../services/api';
import styles from './card.module.css';

function CardContainer({ categoriaFiltro = 'Todos' }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiService.getProducts();
        
        if (response.products && Array.isArray(response.products)) {
          setProductos(response.products);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
        
      } catch (error) {
        console.error('Error cargando productos:', error);
        setError('Error al cargar los productos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  // Función corregida para URLs de imagen
  const getImageUrl = (imagePath) => {
    // Si no hay imagen válida, usar default inmediatamente
    if (!imagePath || 
        imagePath === 'null' || 
        imagePath === 'undefined' ||
        imagePath === 'NULL' ||
        imagePath === '' ||
        imagePath.length < 5) {
      return '/assets/img/default-product.jpg';
    }
    
    // Si ya es una URL completa, usarla directamente
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Limpiar la ruta
    let rutaLimpia = imagePath.toString().trim().replace(/^\/+/, '');
    
    // Construir la URL completa para uploads/productos/
    const baseUrl = 'http://localhost/reactRB/backend';
    const fullUrl = `${baseUrl}/${rutaLimpia}`;
    
    return fullUrl;
  };

  const productosFiltrados = useMemo(() => {
    if (categoriaFiltro === 'Todos') return productos;
    return productos.filter(producto =>
      producto.Tipo_producto?.toLowerCase().includes(categoriaFiltro.toLowerCase())
    );
  }, [productos, categoriaFiltro]);

  if (loading) {
    return (
      <div className={styles.cardContainer}>
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <h3>😕 No pudimos cargar los productos</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  if (productosFiltrados.length === 0) {
    return (
      <div className={styles.noProducts}>
        <h3>🍽️ No hay productos disponibles</h3>
        <p>
          {categoriaFiltro === 'Todos' 
            ? 'Pronto tendremos nuevos productos para ti.' 
            : `No encontramos productos en la categoría "${categoriaFiltro}"`}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      {productosFiltrados.map((producto) => (
        <ProductCard
          key={producto.Id_producto}
          title={producto.Nombre_producto}
          price={`$${producto.Precio_producto?.toLocaleString()}`}
          description={producto.Descripcion}
          size={producto.Tipo_producto}
          image={getImageUrl(producto.Imagen)}
          productId={producto.Id_producto}
          productData={producto}
        />
      ))}
    </div>
  );
}

export default CardContainer;