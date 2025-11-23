<?php
class ProductController {
    private $productModel;

    public function __construct($db) {
        $this->productModel = new Product($db);
    }

    // Obtener todos los productos
    public function getAllProducts() {
        $stmt = $this->productModel->readAll();
        $products = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }

        http_response_code(200);
        return json_encode(array("products" => $products));
    }

    // ✅ CORREGIDO: Crear producto - maneja datos desde parámetro o request
    public function createProduct($data = null) {
        error_log("🎯 [CREATE PRODUCT] === INICIANDO CREACIÓN ===");
        
        // ✅ CORREGIDO: Si no viene data como parámetro, obtenerla de la request
        if ($data === null) {
            error_log("📦 [CREATE PRODUCT] Obteniendo datos directamente desde request...");
            
            // Verificar si es FormData (con archivos) o JSON
            if (!empty($_FILES)) {
                error_log("📦 [CREATE PRODUCT] Datos recibidos via FormData");
                $data = $_POST;
                error_log("📦 [CREATE PRODUCT] Datos POST: " . print_r($_POST, true));
                error_log("📦 [CREATE PRODUCT] Archivos recibidos: " . print_r($_FILES, true));
            } else {
                error_log("📦 [CREATE PRODUCT] Datos recibidos via JSON");
                $input = file_get_contents('php://input');
                error_log("📦 [CREATE PRODUCT] Input raw: " . $input);
                
                if (empty($input)) {
                    error_log("❌ [CREATE PRODUCT] Input vacío - no se recibieron datos");
                    http_response_code(400);
                    return json_encode(array(
                        "success" => false,
                        "message" => "No se recibieron datos del producto."
                    ));
                }
                
                $data = json_decode($input, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    error_log("❌ [CREATE PRODUCT] Error decodificando JSON: " . json_last_error_msg());
                    http_response_code(400);
                    return json_encode(array(
                        "success" => false,
                        "message" => "Formato JSON inválido: " . json_last_error_msg()
                    ));
                }
                
                error_log("📦 [CREATE PRODUCT] Datos JSON decodificados: " . print_r($data, true));
            }
        } else {
            error_log("📦 [CREATE PRODUCT] Datos recibidos como parámetro: " . print_r($data, true));
        }

        // DEBUG DE SESIÓN
        error_log("🔍 [CREATE PRODUCT] === VERIFICANDO SESIÓN ===");
        error_log("🔍 [CREATE PRODUCT] Sesión completa: " . print_r($_SESSION, true));
        error_log("🔍 [CREATE PRODUCT] user_id: " . ($_SESSION['user_id'] ?? 'NO DEFINIDO'));
        error_log("🔍 [CREATE PRODUCT] Tipo_usuario: " . ($_SESSION['Tipo_usuario'] ?? 'NO DEFINIDO'));
        error_log("🔍 [CREATE PRODUCT] user_type: " . ($_SESSION['user_type'] ?? 'NO DEFINIDO'));
        error_log("🔍 [CREATE PRODUCT] isLoggedIn(): " . (isLoggedIn() ? 'SÍ' : 'NO'));
        error_log("🔍 [CREATE PRODUCT] isAdmin(): " . (isAdmin() ? 'SÍ' : 'NO'));
        
        // Verificar autenticación y permisos
        if(!isLoggedIn()) {
            error_log("❌ [CREATE PRODUCT] Usuario no autenticado");
            http_response_code(401);
            return json_encode(array(
                "success" => false,
                "message" => "Debe iniciar sesión para realizar esta acción."
            ));
        }
        
        if(!isAdmin()) {
            error_log("❌ [CREATE PRODUCT] Acceso denegado - No es admin");
            error_log("❌ [CREATE PRODUCT] Tipo de usuario actual: " . ($_SESSION['Tipo_usuario'] ?? 'NO DEFINIDO'));
            http_response_code(403);
            return json_encode(array(
                "success" => false,
                "message" => "Acceso denegado. Se requiere rol de administrador."
            ));
        }

        error_log("✅ [CREATE PRODUCT] Usuario autenticado como administrador");

        // Validar que hay datos
        if (empty($data)) {
            error_log("❌ [CREATE PRODUCT] Datos vacíos o nulos");
            http_response_code(400);
            return json_encode(array(
                "success" => false,
                "message" => "Datos del producto requeridos."
            ));
        }

        // Validar datos requeridos
        error_log("🔍 [CREATE PRODUCT] === VALIDANDO DATOS ===");
        $required = ['Nombre_producto', 'Precio_producto', 'Tipo_producto'];
        foreach($required as $field) {
            if(empty($data[$field])) {
                error_log("❌ [CREATE PRODUCT] Campo requerido faltante: $field");
                error_log("❌ [CREATE PRODUCT] Valor recibido: " . ($data[$field] ?? 'NULL'));
                http_response_code(400);
                return json_encode(array(
                    "success" => false,
                    "message" => "El campo $field es requerido.",
                    "field" => $field
                ));
            }
        }

        error_log("✅ [CREATE PRODUCT] Validación de campos pasada");

        // Procesar imagen si se envió
        $imagenPath = '';
        if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            error_log("📸 [CREATE PRODUCT] Procesando archivo de imagen...");
            $imagenPath = $this->uploadImage($_FILES['imagen']);
            if (!$imagenPath) {
                error_log("❌ [CREATE PRODUCT] Error al subir la imagen");
                http_response_code(400);
                return json_encode(array(
                    "success" => false,
                    "message" => "Error al subir la imagen. Formatos permitidos: JPG, PNG, GIF, WEBP (Máx. 5MB)"
                ));
            }
            error_log("✅ [CREATE PRODUCT] Imagen subida: " . $imagenPath);
        } else {
            // Si no se subió imagen, usar la URL proporcionada o cadena vacía
            $imagenPath = $data['Imagen'] ?? '';
            error_log("🔗 [CREATE PRODUCT] Usando URL de imagen: " . $imagenPath);
            
            // Si hay error en el archivo, loguearlo
            if(isset($_FILES['imagen'])) {
                error_log("⚠️ [CREATE PRODUCT] Error en archivo: " . $_FILES['imagen']['error']);
            }
        }

        // Asignar datos al modelo
        error_log("📝 [CREATE PRODUCT] === ASIGNANDO DATOS AL MODELO ===");
        $this->productModel->Nombre_producto = trim($data['Nombre_producto']);
        $this->productModel->Precio_producto = $data['Precio_producto'];
        $this->productModel->Tipo_producto = $data['Tipo_producto'];
        $this->productModel->Descripcion = $data['Descripcion'] ?? '';
        $this->productModel->Imagen = $imagenPath;

        error_log("📝 [CREATE PRODUCT] Nombre: " . $this->productModel->Nombre_producto);
        error_log("📝 [CREATE PRODUCT] Precio: " . $this->productModel->Precio_producto);
        error_log("📝 [CREATE PRODUCT] Tipo: " . $this->productModel->Tipo_producto);
        error_log("📝 [CREATE PRODUCT] Descripción: " . $this->productModel->Descripcion);
        error_log("📝 [CREATE PRODUCT] Imagen: " . $this->productModel->Imagen);
        
        // Crear el producto en la base de datos
        error_log("🚀 [CREATE PRODUCT] Llamando a model->create()...");
        
        if($this->productModel->create()) {
            error_log("✅ [CREATE PRODUCT] Producto creado exitosamente en BD");
            http_response_code(201);
            return json_encode(array(
                "success" => true,
                "message" => "Producto creado exitosamente.",
                "imagen_url" => $imagenPath,
                "product" => [
                    "Nombre_producto" => $this->productModel->Nombre_producto,
                    "Precio_producto" => $this->productModel->Precio_producto,
                    "Tipo_producto" => $this->productModel->Tipo_producto
                ]
            ));
        } else {
            error_log("❌ [CREATE PRODUCT] Error en model->create() - retornó false");
            
            // Intentar obtener más información del error
            $errorInfo = $this->productModel->getLastError();
            if ($errorInfo) {
                error_log("❌ [CREATE PRODUCT] Error de BD: " . print_r($errorInfo, true));
            }
            
            http_response_code(500);
            return json_encode(array(
                "success" => false,
                "message" => "Error al crear producto en la base de datos."
            ));
        }
    }

    // Método para subir imágenes
    private function uploadImage($file) {
        try {
            error_log("📤 [UPLOAD IMAGE] Iniciando subida de imagen...");
            
            // Configuración
            $uploadDir = '../../uploads/productos/';
            $maxFileSize = 5 * 1024 * 1024; // 5MB
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            
            // Verificar si el directorio existe, si no crearlo
            if (!file_exists($uploadDir)) {
                error_log("📁 [UPLOAD IMAGE] Creando directorio: $uploadDir");
                if (!mkdir($uploadDir, 0777, true)) {
                    error_log("❌ [UPLOAD IMAGE] No se pudo crear el directorio");
                    return false;
                }
            }

            // Validar tipo de archivo
            if (!in_array($file['type'], $allowedTypes)) {
                error_log("❌ [UPLOAD IMAGE] Tipo de archivo no permitido: " . $file['type']);
                return false;
            }

            // Validar tamaño
            if ($file['size'] > $maxFileSize) {
                error_log("❌ [UPLOAD IMAGE] Archivo demasiado grande: " . $file['size'] . " bytes");
                return false;
            }

            // Generar nombre único
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
            $filePath = $uploadDir . $fileName;

            error_log("📁 [UPLOAD IMAGE] Moviendo archivo a: $filePath");

            // Mover archivo
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                // Devolver ruta relativa para la base de datos
                $relativePath = 'uploads/productos/' . $fileName;
                error_log("✅ [UPLOAD IMAGE] Archivo subido exitosamente: " . $relativePath);
                return $relativePath;
            } else {
                error_log("❌ [UPLOAD IMAGE] Error al mover el archivo");
                error_log("❌ [UPLOAD IMAGE] tmp_name: " . $file['tmp_name']);
                error_log("❌ [UPLOAD IMAGE] error: " . $file['error']);
                return false;
            }

        } catch (Exception $e) {
            error_log("💥 [UPLOAD IMAGE] Exception: " . $e->getMessage());
            return false;
        }
    }
}
?>