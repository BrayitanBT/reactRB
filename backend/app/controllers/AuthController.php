<?php
class AuthController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    // Registro de usuario
    public function signup($data) {
        // Validar datos requeridos
        $required = ['Nombre', 'Apellido', 'Documento', 'Telefono', 'Correo_electronico', 'Contrasena'];
        foreach($required as $field) {
            if(empty($data[$field])) {
                http_response_code(400);
                return json_encode(array("message" => "El campo $field es requerido."));
            }
        }

        // Validar formato email
        if(!filter_var($data['Correo_electronico'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            return json_encode(array("message" => "Formato de email inválido."));
        }

        // Verificar si email ya existe
        $this->userModel->Correo_electronico = $data['Correo_electronico'];
        if($this->userModel->emailExists()) {
            http_response_code(400);
            return json_encode(array("message" => "El email ya está registrado."));
        }

        // Asignar datos al modelo
        $this->userModel->Nombre = $data['Nombre'];
        $this->userModel->Apellido = $data['Apellido'];
        $this->userModel->Documento = $data['Documento'];
        $this->userModel->Telefono = $data['Telefono'];
        $this->userModel->Correo_electronico = $data['Correo_electronico'];
        $this->userModel->Contrasena = $data['Contrasena'];
        $this->userModel->Tipo_usuario = 'cliente'; // Por defecto es cliente

        // Crear usuario
        if($this->userModel->create()) {
            // Iniciar sesión automáticamente después del registro
            $_SESSION['user_id'] = $this->userModel->Id_usuario;
            $_SESSION['user_role'] = $this->userModel->Tipo_usuario;
            $_SESSION['user'] = array(
                "Id_usuario" => $this->userModel->Id_usuario,
                "Nombre" => $this->userModel->Nombre,
                "Apellido" => $this->userModel->Apellido,
                "Correo_electronico" => $this->userModel->Correo_electronico,
                "Tipo_usuario" => $this->userModel->Tipo_usuario
            );

            http_response_code(201);
            return json_encode(array(
                "message" => "Usuario registrado exitosamente.",
                "user" => $_SESSION['user']
            ));
        } else {
            http_response_code(500);
            return json_encode(array("message" => "Error al registrar usuario."));
        }
    }

    // Login de usuario
    public function login($data) {
        // Validar datos requeridos
        if(empty($data['Correo_electronico']) || empty($data['Contrasena'])) {
            http_response_code(400);
            return json_encode(array("message" => "Email y contraseña son requeridos."));
        }

        // Asignar datos al modelo
        $this->userModel->Correo_electronico = $data['Correo_electronico'];
        $this->userModel->Contrasena = $data['Contrasena'];

        // Intentar login
        if($this->userModel->login()) {
            // Establecer variables de sesión
            $_SESSION['user_id'] = $this->userModel->Id_usuario;
            $_SESSION['user_role'] = $this->userModel->Tipo_usuario;
            $_SESSION['user'] = array(
                "Id_usuario" => $this->userModel->Id_usuario,
                "Nombre" => $this->userModel->Nombre,
                "Apellido" => $this->userModel->Apellido,
                "Correo_electronico" => $this->userModel->Correo_electronico,
                "Tipo_usuario" => $this->userModel->Tipo_usuario
            );

            http_response_code(200);
            return json_encode(array(
                "message" => "Login exitoso.",
                "user" => $_SESSION['user']
            ));
        } else {
            http_response_code(401);
            return json_encode(array("message" => "Credenciales incorrectas."));
        }
    }

    // Logout
    public function logout() {
        // Destruir la sesión
        session_destroy();
        session_unset();
        
        http_response_code(200);
        return json_encode(array("message" => "Logout exitoso."));
    }

    // Verificar sesión activa
    public function checkSession() {
        if(isLoggedIn()) {
            http_response_code(200);
            return json_encode(array(
                "authenticated" => true,
                "user" => $_SESSION['user']
            ));
        } else {
            http_response_code(401);
            return json_encode(array("authenticated" => false));
        }
    }
}
?>