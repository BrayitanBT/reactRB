import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { apiService } from '../../../services/api';
import ModalContainer from '../../../pages/profile/user/modal/ModalContainer';
import Notification from '../../../components/Notification/Notification';
import '../admin.css';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    Nombre_producto: '',
    Precio_producto: '',
    Tipo_producto: 'Empanada',
    Descripcion: '',
    Imagen: '',
    archivo: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const { user } = useAuth();

  useEffect(() => {
    console.log('🔍 User en ProductsManagement:', user);
    console.log('🔍 Tipo_usuario:', user?.Tipo_usuario);
    console.log('🔍 Es admin?:', user?.Tipo_usuario === 'administrador');
    
    loadProducts();
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getProducts();
      
      if (response.products) {
        setProducts(response.products);
        console.log('✅ Productos cargados:', response.products.length);
      } else {
        setError('No se pudieron cargar los productos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar los productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Nombre_producto.trim()) {
      errors.Nombre_producto = 'El nombre del producto es requerido';
    }

    if (!formData.Precio_producto || formData.Precio_producto <= 0) {
      errors.Precio_producto = 'El precio debe ser mayor a 0';
    }

    if (!formData.Tipo_producto) {
      errors.Tipo_producto = 'El tipo de producto es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ CREACIÓN CORREGIDA: Envía archivo si existe
  const handleCreateProduct = async () => {
    if (!validateForm()) {
      showNotification('Por favor corrige los errores del formulario', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        Nombre_producto: formData.Nombre_producto.trim(),
        Precio_producto: parseInt(formData.Precio_producto),
        Tipo_producto: formData.Tipo_producto,
        Descripcion: formData.Descripcion.trim() || '',
        Imagen: formData.Imagen.trim() || ''
      };

      console.log('📤 Enviando datos del producto:', productData);
      console.log('📸 ¿Hay archivo?:', formData.archivo ? 'SÍ' : 'NO');

      // ✅ USAR apiService.createProduct CON ARCHIVO si existe
      const response = await apiService.createProduct(productData, formData.archivo);
      
      console.log('📥 Respuesta del backend:', response);
      
      if (response.success || response.message) {
        await loadProducts();
        setShowCreateModal(false);
        resetForm();
        showNotification('✅ Producto creado exitosamente', 'success');
      } else {
        showNotification(`❌ ${response.message || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error creando producto:', error);
      showNotification('❌ Error al crear el producto: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      Nombre_producto: product.Nombre_producto,
      Precio_producto: product.Precio_producto.toString(),
      Tipo_producto: product.Tipo_producto,
      Descripcion: product.Descripcion || '',
      Imagen: product.Imagen || '',
      archivo: null
    });
    setShowEditModal(true);
  };

  // ✅ ACTUALIZACIÓN CORREGIDA: Envía archivo si existe
  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      showNotification('Por favor corrige los errores del formulario', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        Id_producto: selectedProduct.Id_producto,
        Nombre_producto: formData.Nombre_producto.trim(),
        Precio_producto: parseInt(formData.Precio_producto),
        Tipo_producto: formData.Tipo_producto,
        Descripcion: formData.Descripcion.trim() || '',
        Imagen: formData.Imagen.trim() || ''
      };

      console.log('📤 Actualizando producto:', productData);
      console.log('📸 ¿Hay archivo?:', formData.archivo ? 'SÍ' : 'NO');

      // ✅ USAR apiService.updateProduct CON ARCHIVO si existe
      const response = await apiService.updateProduct(productData, formData.archivo);
      
      console.log('📥 Respuesta de actualización:', response);
      
      if (response.success || response.message) {
        await loadProducts();
        setShowEditModal(false);
        setSelectedProduct(null);
        resetForm();
        showNotification('✅ Producto actualizado exitosamente', 'success');
      } else {
        showNotification(`❌ ${response.message || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
      showNotification('❌ Error al actualizar el producto: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await apiService.deleteProduct(productId);
      console.log('📥 Respuesta de eliminación:', response);
      
      if (response.success || response.message) {
        await loadProducts();
        showNotification('✅ Producto eliminado exitosamente', 'success');
      } else {
        showNotification(`❌ ${response.message || 'Error desconocido'}`, 'error');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      showNotification('❌ Error al eliminar el producto: ' + error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      Nombre_producto: '',
      Precio_producto: '',
      Tipo_producto: 'Empanada',
      Descripcion: '',
      Imagen: '',
      archivo: null
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ✅ Manejo de archivos
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('❌ Formato de archivo no permitido. Use JPG, PNG, GIF o WEBP', 'error');
        e.target.value = '';
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('❌ La imagen debe ser menor a 5MB', 'error');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        archivo: file,
        Imagen: '' // Limpiar URL si se sube archivo
      }));

      showNotification('✅ Archivo seleccionado correctamente', 'success');
    }
  };

  // ✅ Limpiar archivo seleccionado
  const handleClearFile = () => {
    setFormData(prev => ({
      ...prev,
      archivo: null
    }));
    // Resetear el input file
    const fileInput = document.getElementById(showEditModal ? 'edit_archivo' : 'archivo');
    if (fileInput) fileInput.value = '';
  };

  const getTypeBadge = (type) => {
    const typeClass = type === 'Empanada' ? 'type-empanada' : 
                     type === 'Bebida' ? 'type-bebida' : 'type-postre';
    return <span className={`type-badge ${typeClass}`}>{type}</span>;
  };

  // ✅ Vista previa de imagen
  const renderImagePreview = (isEdit = false) => {
    if (formData.archivo) {
      return (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(formData.archivo)} 
            alt="Vista previa" 
            className="preview-image"
          />
          <div className="preview-info">
            <small>Vista previa: {formData.archivo.name}</small>
            <button 
              type="button" 
              className="btn-clear"
              onClick={handleClearFile}
            >
              ✕
            </button>
          </div>
        </div>
      );
    } else if (formData.Imagen && selectedProduct && isEdit) {
      return (
        <div className="image-preview">
          <img 
            src={formData.Imagen.startsWith('http') ? formData.Imagen : `http://localhost/reactRB/backend/${formData.Imagen}`}
            alt="Imagen actual" 
            className="preview-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <small style={{display: 'none'}}>Imagen no disponible</small>
          <div className="preview-info">
            <small>Imagen actual del producto</small>
          </div>
        </div>
      );
    }
    return null;
  };

  // ✅ Renderizar campo de imagen (reutilizable)
  const renderImageField = (isEdit = false) => {
    const fieldId = isEdit ? 'edit_archivo' : 'archivo';
    const imageFieldId = isEdit ? 'edit_Imagen' : 'Imagen';
    
    return (
      <div className="form-group full-width">
        <label htmlFor={fieldId}>Imagen del Producto</label>
        
        {/* Opción 1: Subir archivo */}
        <input
          type="file"
          id={fieldId}
          name="archivo"
          accept="image/jpeg, image/png, image/gif, image/webp"
          onChange={handleFileChange}
          disabled={loading}
        />
        <small>Formatos: JPG, PNG, GIF, WEBP (Máx. 5MB)</small>

        {/* Vista previa de imagen */}
        {renderImagePreview(isEdit)}

        {/* Opción 2: URL de imagen (alternativa) */}
        <div style={{marginTop: '10px'}}>
          <small>O ingresa una URL:</small>
          <input
            type="text"
            id={imageFieldId}
            name="Imagen"
            value={formData.Imagen}
            onChange={handleInputChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={loading || formData.archivo}
          />
        </div>

        {isEdit && selectedProduct?.Imagen && !formData.archivo && (
          <div className="current-image-info">
            <small>
              <strong>Imagen actual:</strong> {selectedProduct.Imagen}
            </small>
          </div>
        )}
      </div>
    );
  };

  if (loading && !showCreateModal && !showEditModal) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={hideNotification}
      />

      <div className="admin-page">
        <div className="admin-header">
          <h1>Gestión de Productos</h1>
          <p>Administra el catálogo de productos</p>
          <div className="user-info">
            <small>Usuario: {user?.Nombre} ({user?.Tipo_usuario})</small>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadProducts} className="btn-retry">Reintentar</button>
          </div>
        )}

        <div className="admin-actions">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            disabled={loading}
          >
            + Crear Producto
          </button>
          <button onClick={loadProducts} className="btn-secondary" disabled={loading}>
            🔄 Actualizar
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.Id_producto}>
                    <td>{product.Id_producto}</td>
                    <td>
                      <div className="product-info">
                        <strong>{product.Nombre_producto}</strong>
                      </div>
                    </td>
                    <td>${product.Precio_producto?.toLocaleString()}</td>
                    <td>{getTypeBadge(product.Tipo_producto)}</td>
                    <td>
                      <div className="description">
                        {product.Descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td>
                      {product.Imagen && (
                        <div className="product-image-cell">
                          {product.Imagen.startsWith('http') ? (
                            <img 
                              src={product.Imagen} 
                              alt={product.Nombre_producto}
                              className="product-thumbnail"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                          ) : (
                            <img 
                              src={`http://localhost/reactRB/backend/${product.Imagen}`}
                              alt={product.Nombre_producto}
                              className="product-thumbnail"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline';
                              }}
                            />
                          )}
                          <small style={{display: 'none'}}>Imagen no disponible</small>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="btn-edit"
                          title="Editar producto"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.Id_producto)}
                          className="btn-delete"
                          title="Eliminar producto"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal para crear producto */}
        {showCreateModal && (
          <ModalContainer
            title="Crear Nuevo Producto"
            onClose={() => {
              setShowCreateModal(false);
              resetForm();
            }}
            size="large"
          >
            <div className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="Nombre_producto">Nombre *</label>
                  <input
                    type="text"
                    id="Nombre_producto"
                    name="Nombre_producto"
                    value={formData.Nombre_producto}
                    onChange={handleInputChange}
                    className={formErrors.Nombre_producto ? 'input-error' : ''}
                    placeholder="Nombre del producto"
                    disabled={loading}
                  />
                  {formErrors.Nombre_producto && (
                    <span className="field-error">{formErrors.Nombre_producto}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="Precio_producto">Precio *</label>
                  <input
                    type="number"
                    id="Precio_producto"
                    name="Precio_producto"
                    value={formData.Precio_producto}
                    onChange={handleInputChange}
                    className={formErrors.Precio_producto ? 'input-error' : ''}
                    placeholder="Precio en pesos"
                    min="1"
                    disabled={loading}
                  />
                  {formErrors.Precio_producto && (
                    <span className="field-error">{formErrors.Precio_producto}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="Tipo_producto">Tipo *</label>
                  <select
                    id="Tipo_producto"
                    name="Tipo_producto"
                    value={formData.Tipo_producto}
                    onChange={handleInputChange}
                    className={formErrors.Tipo_producto ? 'input-error' : ''}
                    disabled={loading}
                  >
                    <option value="Empanada">Empanada</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Postre">Postre</option>
                  </select>
                  {formErrors.Tipo_producto && (
                    <span className="field-error">{formErrors.Tipo_producto}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="Descripcion">Descripción</label>
                  <textarea
                    id="Descripcion"
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción del producto"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                {/* Campo de imagen para creación */}
                {renderImageField(false)}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Producto'}
                </button>
              </div>
            </div>
          </ModalContainer>
        )}

        {/* Modal para editar producto */}
        {showEditModal && selectedProduct && (
          <ModalContainer
            title={`Editar Producto: ${selectedProduct.Nombre_producto}`}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
              resetForm();
            }}
            size="large"
          >
            <div className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit_Nombre_producto">Nombre *</label>
                  <input
                    type="text"
                    id="edit_Nombre_producto"
                    name="Nombre_producto"
                    value={formData.Nombre_producto}
                    onChange={handleInputChange}
                    className={formErrors.Nombre_producto ? 'input-error' : ''}
                    disabled={loading}
                  />
                  {formErrors.Nombre_producto && (
                    <span className="field-error">{formErrors.Nombre_producto}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Precio_producto">Precio *</label>
                  <input
                    type="number"
                    id="edit_Precio_producto"
                    name="Precio_producto"
                    value={formData.Precio_producto}
                    onChange={handleInputChange}
                    className={formErrors.Precio_producto ? 'input-error' : ''}
                    min="1"
                    disabled={loading}
                  />
                  {formErrors.Precio_producto && (
                    <span className="field-error">{formErrors.Precio_producto}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="edit_Tipo_producto">Tipo *</label>
                  <select
                    id="edit_Tipo_producto"
                    name="Tipo_producto"
                    value={formData.Tipo_producto}
                    onChange={handleInputChange}
                    className={formErrors.Tipo_producto ? 'input-error' : ''}
                    disabled={loading}
                  >
                    <option value="Empanada">Empanada</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Postre">Postre</option>
                  </select>
                  {formErrors.Tipo_producto && (
                    <span className="field-error">{formErrors.Tipo_producto}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="edit_Descripcion">Descripción</label>
                  <textarea
                    id="edit_Descripcion"
                    name="Descripcion"
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={loading}
                  />
                </div>

                {/* Campo de imagen para edición */}
                {renderImageField(true)}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </ModalContainer>
        )}
      </div>
    </>
  );
}