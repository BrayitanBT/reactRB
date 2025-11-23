<?php
class CartController {
    private $db;
    private $orderModel;
    private $pagoModel;

    public function __construct($db) {
        $this->db = $db;
        $this->orderModel = new Order($db);
        $this->pagoModel = new Pagos($db);
    }

    public function createOrder($data) {
        error_log("🎯 [CREATE ORDER] Iniciando creación de orden");
        
        // Verificar sesión
        if(!isLoggedIn()) {
            http_response_code(401);
            return json_encode(array("message" => "Debe iniciar sesión para crear una orden."));
        }

        $userId = $_SESSION['user_id'];
        
        // Validar datos
        if(empty($data['productos']) || empty($data['tipo_pago']) || empty($data['total'])) {
            http_response_code(400);
            return json_encode(array("message" => "Datos incompletos."));
        }

        try {
            // Iniciar transacción
            $this->db->beginTransaction();

            error_log("💰 Creando pago...");
            // 1. Crear pago
            $this->pagoModel->Tipo_pago = $data['tipo_pago'];
            $this->pagoModel->Cantidad_pago = $data['total'];

            if(!$this->pagoModel->create()) {
                throw new Exception("Error al crear el pago");
            }

            $pagoId = $this->pagoModel->Id_pagos;
            error_log("✅ Pago creado con ID: " . $pagoId);

            error_log("📦 Creando orden...");
            // 2. Crear orden
            $this->orderModel->Id_usuario = $userId;
            $this->orderModel->Id_pagos = $pagoId;
            $this->orderModel->Codigo_orden = rand(100000, 999999);

            if(!$this->orderModel->create()) {
                throw new Exception("Error al crear la orden");
            }

            $ordenId = $this->orderModel->Id_orden;
            error_log("✅ Orden creada con ID: " . $ordenId);

            error_log("🛒 Agregando productos a la orden...");
            // 3. Agregar productos a la orden
            foreach($data['productos'] as $producto) {
                $query = "INSERT INTO Orden_Producto (Id_orden, Id_producto, cantidad) 
                         VALUES (:Id_orden, :Id_producto, :cantidad)";
                
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(":Id_orden", $ordenId);
                $stmt->bindParam(":Id_producto", $producto['Id_producto']);
                $stmt->bindParam(":cantidad", $producto['cantidad']);
                
                if(!$stmt->execute()) {
                    throw new Exception("Error al agregar producto a la orden");
                }
                
                error_log("✅ Producto agregado: " . $producto['Id_producto'] . " (cantidad: " . $producto['cantidad'] . ")");
            }

            // Commit de la transacción
            $this->db->commit();

            error_log("✅ Orden completada exitosamente - ID: " . $ordenId);
            http_response_code(201);
            return json_encode(array(
                "success" => true,
                "message" => "Orden creada exitosamente.",
                "orden_id" => $ordenId,
                "codigo_orden" => "ORD-" . str_pad($ordenId, 6, "0", STR_PAD_LEFT)
            ));

        } catch (Exception $e) {
            // Rollback en caso de error
            $this->db->rollBack();
            error_log("❌ Error en createOrder: " . $e->getMessage());
            
            http_response_code(500);
            return json_encode(array(
                "success" => false,
                "message" => "Error al crear la orden: " . $e->getMessage()
            ));
        }
    }

    // Obtener detalles de una orden específica
    public function getOrderDetails($orderId, $userId = null) {
        try {
            // Si es usuario normal, verificar que sea su orden
            if ($userId && !isAdmin()) {
                $verifyQuery = "SELECT Id_orden FROM Orden WHERE Id_orden = :Id_orden AND Id_usuario = :Id_usuario";
                $verifyStmt = $this->db->prepare($verifyQuery);
                $verifyStmt->bindParam(":Id_orden", $orderId);
                $verifyStmt->bindParam(":Id_usuario", $userId);
                $verifyStmt->execute();
                
                if ($verifyStmt->rowCount() === 0) {
                    http_response_code(403);
                    return json_encode(array("message" => "No tienes permiso para ver esta orden."));
                }
            }

            // Usar el OrderController para obtener los detalles
            $orderController = new OrderController($this->db);
            return $orderController->getOrderDetails($orderId);

        } catch (Exception $e) {
            error_log("❌ Error en getOrderDetails: " . $e->getMessage());
            http_response_code(500);
            return json_encode(array("message" => "Error al obtener los detalles de la orden."));
        }
    }
}
?>