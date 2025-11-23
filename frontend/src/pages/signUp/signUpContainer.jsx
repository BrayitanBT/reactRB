import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // ✅ Usar nuestro AuthContext
import SignUp from "./signUp";

export default function SignUpContainer() {
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Documento: '',
        Telefono: '',
        Correo_electronico: '',
        Contrasena: '',
        confirmPassword: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup } = useAuth(); // ✅ Usar nuestro hook de autenticación
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones
        if (formData.Contrasena !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.Contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            // ✅ Usar nuestro nuevo sistema de registro
            const result = await signup({
                Nombre: formData.Nombre,
                Apellido: formData.Apellido,
                Documento: formData.Documento,
                Telefono: formData.Telefono,
                Correo_electronico: formData.Correo_electronico,
                Contrasena: formData.Contrasena
            });

            if (result.success) {
                alert('✅ Cuenta creada exitosamente');
                // Limpiar formulario
                setFormData({
                    Nombre: '',
                    Apellido: '',
                    Documento: '',
                    Telefono: '',
                    Correo_electronico: '',
                    Contrasena: '',
                    confirmPassword: ''
                });
                navigate('/profile');
            } else {
                setError(result.message);
            }

        } catch (err) {
            console.error('Error en registro:', err);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <SignUp 
            handleSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
            error={error}
            loading={loading}
        />
    );
}