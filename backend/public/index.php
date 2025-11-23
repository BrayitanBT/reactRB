<?php
// 🔧 CONFIGURACIÓN COMPLETA DE CORS Y SESIONES
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// 🎯 MANEJAR PREFLIGHT REQUESTS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 📁 INCLUSIÓN DE ARCHIVOS NECESARIOS
include_once '../app/config/config.php';
include_once '../app/models/Database.php';
include_once '../app/models/User.php';
include_once '../app/models/Product.php';
include_once '../app/models/Order.php';
include_once '../app/models/Establecimiento.php';
include_once '../app/models/Pagos.php';
include_once '../app/controllers/AuthController.php';
include_once '../app/controllers/UserController.php';
include_once '../app/controllers/ProductController.php';
include_once '../app/controllers/OrderController.php';
include_once '../app/controllers/AdminController.php';
include_once '../app/controllers/CartController.php';

// 🗄️ CONEXIÓN A LA BASE DE DATOS
$database = new Database();
$db = $database->getConnection();

// 🎮 INSTANCIAR CONTROLADORES
$authController = new AuthController($db);
$userController = new UserController($db);
$productController = new ProductController($db);
$orderController = new OrderController($db);
$adminController = new AdminController($db);
$cartController = new CartController($db);

// 🎯 OBTENER DATOS DE LA PETICIÓN
$method = $_SERVER['REQUEST_METHOD'];
$path = $_GET['url'] ?? '';

// 🔧 FUNCIÓN PARA OBTENER DATOS SEGÚN EL MÉTODO
function getRequestData() {
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Para métodos que pueden tener FormData (POST, PUT)
    if ($method === 'POST' || $method === 'PUT') {
        // Si hay archivos, es FormData - usar $_POST
        if (!empty($_FILES)) {
            return $_POST;
        } else {
            // Si no hay archivos, es JSON - leer de php://input
            $input = file_get_contents('php://input');
            return json_decode($input, true) ?? [];
        }
    }
    
    // Para otros métodos, usar parámetros GET o array vacío
    return $_GET ?? [];
}

// 🚦 SISTEMA DE RUTEO ACTUALIZADO CON SESIONES
switch(true) {
    // ============================================
    // 🔐 AUTENTICACIÓN
    // ============================================
    case $method == 'POST' && $path == 'signup':
        $data = getRequestData();
        echo $authController->signup($data);
        break;
        
    case $method == 'POST' && $path == 'login':
        $data = getRequestData();
        echo $authController->login($data);
        break;
        
    case $method == 'POST' && $path == 'logout':
        echo $authController->logout();
        break;
        
    case $method == 'GET' && $path == 'check-session':
        echo $authController->checkSession();
        break;
        
    // ============================================
    // 👥 USUARIOS
    // ============================================
    case $method == 'GET' && $path == 'users':
        echo $userController->getAllUsers();
        break;
        
    case $method == 'GET' && $path == 'profile':
        echo $userController->getProfile();
        break;
        
    // ============================================
    // 🍕 PRODUCTOS
    // ============================================
    case $method == 'GET' && $path == 'products':
        echo $productController->getAllProducts();
        break;
        
    case $method == 'POST' && $path == 'products':
        // ✅ MODIFICADO: No pasar parámetros, el controlador maneja FormData/JSON internamente
        echo $productController->createProduct();
        break;
        
    // ============================================
    // 📋 ÓRDENES
    // ============================================
    case $method == 'GET' && $path == 'orders/user':
        if(!isLoggedIn()) {
            http_response_code(401);
            echo json_encode(array("message" => "No autorizado."));
            break;
        }
        echo $orderController->getUserOrders($_SESSION['user_id']);
        break;
        
    case $method == 'GET' && $path == 'orders':
        echo $orderController->getAllOrders();
        break;

    case $method == 'POST' && $path == 'orders':
        if(!isLoggedIn()) {
            http_response_code(401);
            echo json_encode(array("message" => "No autorizado."));
            break;
        }
        $data = getRequestData();
        echo $cartController->createOrder($data);
        break;

    case $method == 'GET' && strpos($path, 'orders/') === 0:
        if(!isLoggedIn()) {
            http_response_code(401);
            echo json_encode(array("message" => "No autorizado."));
            break;
        }
        $orderId = str_replace('orders/', '', $path);
        echo $cartController->getOrderDetails($orderId, $_SESSION['user_id']);
        break;
        
    // ============================================
    // 👨‍💼 ADMIN - USUARIOS
    // ============================================
    case $method == 'PUT' && $path == 'admin/users':
        $data = getRequestData();
        echo $adminController->updateUser($data);
        break;
        
    case $method == 'DELETE' && strpos($path, 'admin/users/') === 0:
        $userId = str_replace('admin/users/', '', $path);
        echo $adminController->deleteUser($userId);
        break;
        
    // ============================================
    // 👨‍💼 ADMIN - PRODUCTOS
    // ============================================
    case $method == 'PUT' && $path == 'admin/products':
        // ✅ Para JSON sin archivos
        $data = getRequestData();
        echo $adminController->updateProduct($data);
        break;
        
    case $method == 'POST' && $path == 'admin/products':
        // ✅ NUEVO: Para FormData con archivos
        echo $adminController->updateProduct();
        break;
        
    case $method == 'DELETE' && strpos($path, 'admin/products/') === 0:
        $productId = str_replace('admin/products/', '', $path);
        echo $adminController->deleteProduct($productId);
        break;
        
    // ============================================
    // 👨‍💼 ADMIN - ESTABLECIMIENTOS
    // ============================================
    case $method == 'GET' && $path == 'admin/establecimientos':
        echo $adminController->getEstablecimientos();
        break;
        
    case $method == 'POST' && $path == 'admin/establecimientos':
        $data = getRequestData();
        echo $adminController->createEstablecimiento($data);
        break;
        
    case $method == 'PUT' && $path == 'admin/establecimientos':
        $data = getRequestData();
        echo $adminController->updateEstablecimiento($data);
        break;
        
    case $method == 'DELETE' && strpos($path, 'admin/establecimientos/') === 0:
        $establecimientoId = str_replace('admin/establecimientos/', '', $path);
        echo $adminController->deleteEstablecimiento($establecimientoId);
        break;
        
    // ============================================
    // 🛒 CARRITO
    // ============================================
    case $method == 'GET' && $path == 'cart':
        echo $cartController->getCart();
        break;
        
    case $method == 'POST' && $path == 'cart/add':
        $data = getRequestData();
        echo $cartController->addToCart($data);
        break;
        
    // ============================================
    // ❌ ENDPOINT NO ENCONTRADO
    // ============================================
    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint no encontrado."));
        break;
}
?>