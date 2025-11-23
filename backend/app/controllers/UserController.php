<?php
class UserController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    // Obtener perfil del usuario actual (USANDO SESIONES)
    public function getProfile() {
        if(!isLoggedIn()) {
            http_response_code(401);
            return json_encode(array("message" => "No autorizado."));
        }

        $this->userModel->Id_usuario = $_SESSION['user_id'];
        $user = $this->userModel->readOne();
        
        if($user) {
            http_response_code(200);
            return json_encode(array("user" => $user));
        } else {
            http_response_code(404);
            return json_encode(array("message" => "Usuario no encontrado."));
        }
    }

    // Obtener todos los usuarios (solo admin - USANDO SESIONES)
    public function getAllUsers() {
        if(!isAdmin()) {
            http_response_code(403);
            return json_encode(array("message" => "Acceso denegado. Se requiere rol de administrador."));
        }

        $stmt = $this->userModel->readAll();
        $users = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }

        http_response_code(200);
        return json_encode(array("users" => $users));
    }
}
?>