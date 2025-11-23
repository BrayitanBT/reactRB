import { useState, useEffect } from 'react';
import UserForm from './UserForm';

export default function UserFormContainer({ 
  userData, 
  onSubmit, 
  onCancel, 
  isAdmin = false,
  isCreate = false 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    contrasena: '', // Solo para creación
    confirmarContrasena: '', // Solo para creación
    tipo_usuario: 'cliente'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData && !isCreate) {
      console.log('📝 Datos del usuario para el formulario:', userData);
      
      setFormData({
        nombre: userData.Nombre || userData.nombre?.split(' ')[0] || '',
        apellido: userData.Apellido || userData.nombre?.split(' ')[1] || '',
        email: userData['Correo electronico'] || userData.Correo_electronico || userData.email || '',
        telefono: userData.Telefono || userData.telefono || '',
        documento: userData.Documento || userData.documento || '',
        contrasena: '',
        confirmarContrasena: '',
        tipo_usuario: userData['Tipo usuario'] || userData.Tipo_usuario || userData.rol || 'cliente'
      });
    } else if (isCreate) {
      // Reset form para creación
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento: '',
        contrasena: '',
        confirmarContrasena: '',
        tipo_usuario: 'cliente'
      });
    }
  }, [userData, isCreate]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.documento || formData.documento.toString().trim() === '') {
      newErrors.documento = 'El documento es requerido';
    } else if (!/^\d+$/.test(formData.documento.toString())) {
      newErrors.documento = 'El documento debe contener solo números';
    }

    // Validaciones específicas para creación
    if (isCreate) {
      if (!formData.contrasena) {
        newErrors.contrasena = 'La contraseña es requerida';
      } else if (formData.contrasena.length < 6) {
        newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmarContrasena) {
        newErrors.confirmarContrasena = 'Confirma la contraseña';
      } else if (formData.contrasena !== formData.confirmarContrasena) {
        newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
      }
    }

    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener entre 7 y 15 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('❌ Validación fallida:', errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let userDataToSend;

      if (isCreate) {
        // Datos para crear usuario
        userDataToSend = {
          Nombre: formData.nombre.trim(),
          Apellido: formData.apellido.trim(),
          Correo_electronico: formData.email.trim(),
          Telefono: formData.telefono.trim() || '',
          Documento: formData.documento,
          Contrasena: formData.contrasena,
          Tipo_usuario: formData.tipo_usuario
        };
      } else {
        // Datos para actualizar usuario
        userDataToSend = {
          Id_usuario: userData['Id usuario'] || userData.id || userData.Id_usuario,
          Nombre: formData.nombre.trim(),
          Apellido: formData.apellido.trim(),
          Correo_electronico: formData.email.trim(),
          Telefono: formData.telefono.trim() || '',
          Documento: formData.documento,
          Tipo_usuario: formData.tipo_usuario
        };
      }

      console.log('📤 Enviando datos:', userDataToSend);
      const result = await onSubmit(userDataToSend);
      
      if (result && !result.success) {
        setErrors({ submit: result.message || 'Error al procesar el usuario' });
      }
    } catch (error) {
      console.error('💥 Error en handleSubmit:', error);
      setErrors({ 
        submit: error.message || 'Error inesperado al procesar el usuario' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserForm
      formData={formData}
      errors={errors}
      loading={loading}
      isAdmin={isAdmin}
      isCreate={isCreate}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}