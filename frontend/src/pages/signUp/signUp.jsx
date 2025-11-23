import './signUp.css';
import { Link } from 'react-router-dom';
import { Undo2 } from 'lucide-react';

export default function SignUp({ 
    handleSubmit, 
    formData, 
    handleInputChange, 
    error, 
    loading 
}) {
    return (
        <div className='signUp-page'>
            <div className='registro-container'>
                
                <Link to='/'>
                    <p className='return-buton'>Inicio <Undo2 /></p>
                </Link>

                <h2 className='registro-title'>Registrarse</h2>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='registro-form'>

                    <div>
                        <label className='registro-label'>Nombres:</label>
                        <input
                            type='text'
                            value={formData.Nombre}
                            onChange={(e) => handleInputChange('Nombre', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='registro-label'>Apellidos:</label>
                        <input
                            type='text'
                            value={formData.Apellido}
                            onChange={(e) => handleInputChange('Apellido', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='registro-label'>Documento:</label>
                        <input
                            type='number'
                            value={formData.Documento}
                            onChange={(e) => handleInputChange('Documento', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className='registro-label'>Teléfono:</label>
                        <input
                            type='tel'
                            value={formData.Telefono}
                            onChange={(e) => handleInputChange('Telefono', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                        />
                    </div>

                    <div className='registro-form-full'>
                        <label className='registro-label'>Correo Electrónico:</label>
                        <input
                            type='email'
                            value={formData.Correo_electronico}
                            onChange={(e) => handleInputChange('Correo_electronico', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                        />
                    </div>

                    <div className='registro-form-full'>
                        <label className='registro-label'>Contraseña:</label>
                        <input
                            type='password'
                            value={formData.Contrasena}
                            onChange={(e) => handleInputChange('Contrasena', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                            minLength="6"
                        />
                    </div>

                    <div className='registro-form-full'>
                        <label className='registro-label'>Confirmar Contraseña:</label>
                        <input
                            type='password'
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            required
                            className='registro-input'
                            disabled={loading}
                            minLength="6"
                        />
                    </div>

                    <button 
                        type='submit' 
                        className='registro-button registro-form-full'
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <div className='registro-login-text'>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to='/log-in'>
                        <p className='registro-login-link'>Inicia sesión</p>
                    </Link>
                </div>

            </div>
        </div>
    );
}