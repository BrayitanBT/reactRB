import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Login from './login';

export default function LoginContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      // ✅ Usar nuestro nuevo sistema de autenticación
      const result = await login(email, password);

      if (result.success) {
        console.log('✅ Login exitoso:', result.user);
        alert(`Bienvenido, ${result.user.Nombre}`);
        
        // ✅ REDIRIGIR AL INICIO AUTOMÁTICAMENTE
        navigate('/'); // Esto redirige automáticamente al inicio
        
      } else {
        setError(result.message);
        alert(result.message);
      }

    } catch (err) {
      console.error('❌ Error en login:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login
      handleSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
    />
  );
}