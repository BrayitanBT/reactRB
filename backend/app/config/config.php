<?php

define('DB_HOST', 'localhost');
define('DB_NAME', 'RestauranteRB');
define('DB_USER', 'root');
define('DB_PASS', '');
define('BASE_URL', 'http://localhost/tu_proyecto/public/index.php');

// Roles de usuario
define('ROLE_ADMIN', 'administrador');
define('ROLE_USER', 'cliente');

// Función helper para verificar autenticación
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Función helper para verificar rol
function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === ROLE_ADMIN;
}

// Función para obtener usuario actual
function getCurrentUser() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}
?>