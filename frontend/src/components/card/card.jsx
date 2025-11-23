import React, { useState, useCallback } from 'react';
import styles from './card.module.css';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, Check, Star, Clock } from 'lucide-react';

const ProductCard = React.memo(({ 
  title, 
  price, 
  description, 
  size, 
  image, 
  productId,
  productData
}) => {
  const { addToCart, isInCart, getProductQuantity } = useCart();
  const [imgSrc, setImgSrc] = useState(image);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isProductInCart = isInCart(productId);
  const productQuantity = getProductQuantity(productId);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    // Cambiar a imagen por defecto solo si no es ya la default
    if (!imgSrc.includes('default-product.jpg')) {
      setImgSrc('/assets/img/default-product.jpg');
      setImageLoaded(true);
    }
  }, [imgSrc]);

  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData);
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'empanada':
        return { background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)' };
      case 'bebida':
        return { background: 'linear-gradient(135deg, #4ecdc4, #44a08d)' };
      case 'postre':
        return { background: 'linear-gradient(135deg, #ffd93d, #ff9a3d)' };
      default:
        return { background: 'linear-gradient(135deg, #667eea, #764ba2)' };
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* Skeleton mientras carga */}
        {!imageLoaded && (
          <div className={styles.imageSkeleton}></div>
        )}
        
        <img 
          src={imgSrc} 
          alt={`Producto: ${title}`} 
          className={`${styles.productImg} ${
            imageLoaded ? styles.imageLoaded : styles.imageLoading
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        
        <div className={styles.imageOverlay}>
          <div className={styles.overlayContent}>
            <Clock size={20} color="white" />
            <span>Preparación rápida</span>
          </div>
        </div>
      </div>

      <div className={styles.productInfo}>
        <h2 className={styles.productTitle}>{title}</h2>

        <div className={styles.productMeta}>
          <span 
            className={styles.typeBadge}
            style={getTypeColor(size)}
          >
            {size}
          </span>
          
          {isProductInCart && (
            <span className={styles.cartBadge}>
              <Check size={12} />
              {productQuantity} en carrito
            </span>
          )}
        </div>

        <p className={styles.productDescription}>
          {description || 'Delicioso producto preparado con los mejores ingredientes.'}
        </p>

        <div className={styles.productDetails}>
          <div className={styles.rating}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <Star size={14} fill="#e5e7eb" color="#e5e7eb" />
            <span className={styles.ratingText}>(4.2)</span>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.priceTag}>
            <span className={styles.priceLabel}>Precio</span>
            <p className={styles.productPrice}>{price}</p>
          </div>
          
          <button 
            className={`${styles.addButton} ${isProductInCart ? styles.inCart : ''}`}
            onClick={handleAddToCart}
          >
            {isProductInCart ? (
              <>
                <Check size={16} />
                Agregar otro
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export const ProductCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.productInfo}>
        <div className={`${styles.skeletonText} ${styles.short}`}></div>
        <div className={`${styles.skeletonText} ${styles.medium}`}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.priceSection}>
          <div className={styles.skeletonText} style={{width: '40%'}}></div>
          <div className={styles.skeletonText} style={{width: '30%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;