<?php
class AdminController {
    private $db;
    private $userModel;
    private $productModel;
    private $establecimientoModel;

    public function __construct($db) {
        $this->db = $db;
        $this->userModel = new User($db);
        $this->productModel = new Product($db);
        $this->establecimientoModel = new Establecimiento($db);
    }

    // 🔐 Verificar si es admin (USANDO SESIONES)
    private function checkAdmin() {
        if(!isLoggedIn() || !isAdmin()) {
            http_response_code(403);
            echo json_encode(array("message" => "Acceso denegado. Se requiere rol de administrador."));
            return false;
        }
        return true;
    }

    // 👥 CRUD USUARIOS

    // Actualizar usuario
    public function updateUser($data) {
        if(!$this->checkAdmin()) return;

        if(empty($data['Id_usuario']) || empty($data['Nombre']) || empty($data['Correo_electronico'])) {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
            return;
        }

        $this->userModel->Id_usuario = $data['Id_usuario'];
        $this->userModel->Nombre = $data['Nombre'];
        $this->userModel->Apellido = $data['Apellido'] ?? '';
        $this->userModel->Documento = $data['Documento'] ?? '';
        $this->userModel->Telefono = $data['Telefono'] ?? '';
        $this->userModel->Correo_electronico = $data['Correo_electronico'];
        $this->userModel->Tipo_usuario = $data['Tipo_usuario'] ?? 'cliente';

        if($this->userModel->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Usuario actualizado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar usuario."));
        }
    }

    // Eliminar usuario
    public function deleteUser($userId) {
        if(!$this->checkAdmin()) return;

        $this->userModel->Id_usuario = $userId;

        if($this->userModel->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Usuario eliminado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al eliminar usuario."));
        }
    }

    // 🍕 CRUD PRODUCTOS

    // Actualizar producto - MODIFICADO PARA MANEJAR FORMDATA
    public function updateProduct() {
        error_log("🎯 [ADMIN UPDATE PRODUCT] Iniciando actualización de producto");
        
        // DEBUG: Verificar método y headers
        error_log("🔍 [ADMIN UPDATE PRODUCT] Método: " . $_SERVER['REQUEST_METHOD']);
        error_log("🔍 [ADMIN UPDATE PRODUCT] Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'NO DEFINIDO'));
        
        if(!$this->checkAdmin()) return;

        // Determinar si los datos vienen de FormData o JSON
        $data = [];
        if (!empty($_FILES)) {
            error_log("📦 [ADMIN UPDATE PRODUCT] Datos recibidos via FormData");
            $data = $_POST;
            error_log("📦 [ADMIN UPDATE PRODUCT] Datos de POST: " . print_r($_POST, true));
            error_log("📦 [ADMIN UPDATE PRODUCT] Archivos recibidos: " . print_r($_FILES, true));
            
            // DEBUG: Verificar campos específicos
            error_log("🔍 [ADMIN UPDATE PRODUCT] Campos POST disponibles:");
            foreach($_POST as $key => $value) {
                error_log("🔍 [ADMIN UPDATE PRODUCT]   $key: " . (is_array($value) ? print_r($value, true) : $value));
            }
        } else {
            error_log("📦 [ADMIN UPDATE PRODUCT] Datos recibidos via JSON");
            $input = file_get_contents('php://input');
            error_log("📦 [ADMIN UPDATE PRODUCT] Input raw: " . $input);
            $data = json_decode($input, true);
            error_log("📦 [ADMIN UPDATE PRODUCT] Datos de JSON: " . print_r($data, true));
        }
        
        error_log("📦 [ADMIN UPDATE PRODUCT] Datos procesados: " . print_r($data, true));
        error_log("📦 [ADMIN UPDATE PRODUCT] ¿Hay archivos?: " . (!empty($_FILES) ? 'SÍ' : 'NO'));

        // DEBUG DETALLADO DE CAMPOS
        error_log("🔍 [ADMIN UPDATE PRODUCT] Verificando campos requeridos:");
        error_log("🔍 [ADMIN UPDATE PRODUCT] Id_producto: " . ($data['Id_producto'] ?? 'NO ENCONTRADO'));
        error_log("🔍 [ADMIN UPDATE PRODUCT] Nombre_producto: " . ($data['Nombre_producto'] ?? 'NO ENCONTRADO'));
        error_log("🔍 [ADMIN UPDATE PRODUCT] Precio_producto: " . ($data['Precio_producto'] ?? 'NO ENCONTRADO'));
        error_log("🔍 [ADMIN UPDATE PRODUCT] Tipo_producto: " . ($data['Tipo_producto'] ?? 'NO ENCONTRADO'));

        if(empty($data['Id_producto']) || empty($data['Nombre_producto']) || empty($data['Precio_producto'])) {
            error_log("❌ [ADMIN UPDATE PRODUCT] Datos incompletos - Faltan campos requeridos");
            error_log("❌ [ADMIN UPDATE PRODUCT] Id_producto presente: " . (empty($data['Id_producto']) ? 'NO' : 'SÍ'));
            error_log("❌ [ADMIN UPDATE PRODUCT] Nombre_producto presente: " . (empty($data['Nombre_producto']) ? 'NO' : 'SÍ'));
            error_log("❌ [ADMIN UPDATE PRODUCT] Precio_producto presente: " . (empty($data['Precio_producto']) ? 'NO' : 'SÍ'));
            
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
            return;
        }

        // Procesar imagen si se envió
        $imagenPath = '';
        if(!empty($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            error_log("📸 [ADMIN UPDATE PRODUCT] Procesando archivo de imagen...");
            $imagenPath = $this->uploadImage($_FILES['imagen']);
            if (!$imagenPath) {
                error_log("❌ [ADMIN UPDATE PRODUCT] Error al subir la imagen");
                http_response_code(400);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Error al subir la imagen. Formatos permitidos: JPG, PNG, GIF, WEBP (Máx. 5MB)"
                ));
                return;
            }
            error_log("✅ [ADMIN UPDATE PRODUCT] Imagen subida: " . $imagenPath);
        } else {
            // Si no se subió imagen, usar la URL proporcionada
            $imagenPath = $data['Imagen'] ?? '';
            error_log("🔗 [ADMIN UPDATE PRODUCT] Usando URL de imagen: " . $imagenPath);
        }

        // Convertir Precio_producto a entero si viene como string
        $precio = $data['Precio_producto'];
        if (is_string($precio)) {
            $precio = (int) $precio;
        }

        $this->productModel->Id_producto = $data['Id_producto'];
        $this->productModel->Nombre_producto = $data['Nombre_producto'];
        $this->productModel->Precio_producto = $precio;
        $this->productModel->Tipo_producto = $data['Tipo_producto'] ?? '';
        $this->productModel->Descripcion = $data['Descripcion'] ?? '';
        $this->productModel->Imagen = $imagenPath;

        error_log("📝 [ADMIN UPDATE PRODUCT] Datos asignados al modelo:");
        error_log("📝 [ADMIN UPDATE PRODUCT] ID: " . $this->productModel->Id_producto);
        error_log("📝 [ADMIN UPDATE PRODUCT] Nombre: " . $this->productModel->Nombre_producto);
        error_log("📝 [ADMIN UPDATE PRODUCT] Precio: " . $this->productModel->Precio_producto);
        error_log("📝 [ADMIN UPDATE PRODUCT] Imagen: " . $this->productModel->Imagen);

        if($this->productModel->update()) {
            error_log("✅ [ADMIN UPDATE PRODUCT] Producto actualizado exitosamente en BD");
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Producto actualizado exitosamente.",
                "imagen_url" => $imagenPath
            ));
        } else {
            error_log("❌ [ADMIN UPDATE PRODUCT] Error en model->update() - retornó false");
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => "Error al actualizar producto en la base de datos."
            ));
        }
    }

    // Eliminar producto
    public function deleteProduct($productId) {
        if(!$this->checkAdmin()) return;

        $this->productModel->Id_producto = $productId;

        if($this->productModel->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Producto eliminado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al eliminar producto."));
        }
    }

    // 🏢 CRUD ESTABLECIMIENTOS

    // Obtener todos los establecimientos
    public function getEstablecimientos() {
        if(!$this->checkAdmin()) return;

        $stmt = $this->establecimientoModel->readAll();
        $establecimientos = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $establecimientos[] = $row;
        }

        http_response_code(200);
        echo json_encode(array("establecimientos" => $establecimientos));
    }

    // Crear establecimiento
    public function createEstablecimiento($data) {
        if(!$this->checkAdmin()) return;

        if(empty($data['Nombre_sede']) || empty($data['Ciudad'])) {
            http_response_code(400);
            echo json_encode(array("message" => "Nombre de sede y ciudad son requeridos."));
            return;
        }

        $this->establecimientoModel->Nombre_sede = $data['Nombre_sede'];
        $this->establecimientoModel->Ciudad = $data['Ciudad'];
        $this->establecimientoModel->Tipo_de_mesa = $data['Tipo_de_mesa'] ?? '';
        $this->establecimientoModel->Responsable = $data['Responsable'] ?? '';
        $this->establecimientoModel->Mesero = $data['Mesero'] ?? '';

        if($this->establecimientoModel->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Establecimiento creado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al crear establecimiento."));
        }
    }

    // Actualizar establecimiento
    public function updateEstablecimiento($data) {
        if(!$this->checkAdmin()) return;

        if(empty($data['Id_Establecimiento']) || empty($data['Nombre_sede'])) {
            http_response_code(400);
            echo json_encode(array("message" => "Datos incompletos."));
            return;
        }

        $this->establecimientoModel->Id_Establecimiento = $data['Id_Establecimiento'];
        $this->establecimientoModel->Nombre_sede = $data['Nombre_sede'];
        $this->establecimientoModel->Ciudad = $data['Ciudad'] ?? '';
        $this->establecimientoModel->Tipo_de_mesa = $data['Tipo_de_mesa'] ?? '';
        $this->establecimientoModel->Responsable = $data['Responsable'] ?? '';
        $this->establecimientoModel->Mesero = $data['Mesero'] ?? '';

        if($this->establecimientoModel->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Establecimiento actualizado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al actualizar establecimiento."));
        }
    }

    // Eliminar establecimiento
    public function deleteEstablecimiento($establecimientoId) {
        if(!$this->checkAdmin()) return;

        $this->establecimientoModel->Id_Establecimiento = $establecimientoId;

        if($this->establecimientoModel->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Establecimiento eliminado exitosamente."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Error al eliminar establecimiento."));
        }
    }

    // Método para subir imágenes (COPIADO DE PRODUCTCONTROLLER)
    private function uploadImage($file) {
        try {
            // Configuración
            $uploadDir = '../../uploads/productos/';
            $maxFileSize = 5 * 1024 * 1024; // 5MB
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            
            // Verificar si el directorio existe, si no crearlo
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Validar tipo de archivo
            if (!in_array($file['type'], $allowedTypes)) {
                error_log("❌ [ADMIN UPLOAD] Tipo de archivo no permitido: " . $file['type']);
                return false;
            }

            // Validar tamaño
            if ($file['size'] > $maxFileSize) {
                error_log("❌ [ADMIN UPLOAD] Archivo demasiado grande: " . $file['size']);
                return false;
            }

            // Generar nombre único
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
            $filePath = $uploadDir . $fileName;

            // Mover archivo
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                // Devolver ruta relativa para la base de datos
                $relativePath = 'uploads/productos/' . $fileName;
                error_log("✅ [ADMIN UPLOAD] Archivo subido exitosamente: " . $relativePath);
                return $relativePath;
            } else {
                error_log("❌ [ADMIN UPLOAD] Error al mover el archivo");
                return false;
            }

        } catch (Exception $e) {
            error_log("💥 [ADMIN UPLOAD] Exception: " . $e->getMessage());
            return false;
        }
    }
}
?>