import './forms.css';

export default function UserForm({ 
  formData, 
  errors, 
  loading, 
  isAdmin = false,
  isCreate = false,
  onChange, 
  onSubmit, 
  onCancel 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            disabled={loading}
          />
          {errors.nombre && <span className="error-text">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={errors.apellido ? 'error' : ''}
            disabled={loading}
          />
          {errors.apellido && <span className="error-text">{errors.apellido}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled={loading}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="documento">Documento *</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className={errors.documento ? 'error' : ''}
            disabled={loading}
            placeholder="Solo números"
          />
          {errors.documento && <span className="error-text">{errors.documento}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={errors.telefono ? 'error' : ''}
            disabled={loading}
            placeholder="Ej: 3001234567"
          />
          {errors.telefono && <span className="error-text">{errors.telefono}</span>}
        </div>

        {isCreate && (
          <>
            <div className="form-group">
              <label htmlFor="contrasena">Contraseña *</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                className={errors.contrasena ? 'error' : ''}
                disabled={loading}
              />
              {errors.contrasena && <span className="error-text">{errors.contrasena}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className={errors.confirmarContrasena ? 'error' : ''}
                disabled={loading}
              />
              {errors.confirmarContrasena && <span className="error-text">{errors.confirmarContrasena}</span>}
            </div>
          </>
        )}

        {isAdmin && (
          <div className="form-group">
            <label htmlFor="tipo_usuario">Tipo de Usuario</label>
            <select
              id="tipo_usuario"
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="cliente">Cliente</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        )}
      </div>

      {errors.submit && (
        <div className="form-error-message">
          {errors.submit}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (isCreate ? 'Crear Usuario' : 'Guardar Cambios')}
        </button>
      </div>
    </form>
  );
}