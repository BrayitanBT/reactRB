<?php
class OrderController {
    private $db;
    private $orderModel;

    public function __construct($db) {
        $this->db = $db;
        $this->orderModel = new Order($db);
    }

    // Obtener todas las órdenes con información del usuario y pago
    public function getAllOrders() {
        try {
            error_log("🎯 [GET ALL ORDERS] Obteniendo todas las órdenes");
            
            $query = "SELECT 
                        o.Id_orden,
                        o.Fecha_orden,
                        o.Hora_orden,
                        o.Codigo_orden,
                        o.Id_usuario,
                        u.Nombre,
                        u.Apellido,
                        u.Correo_electronico,
                        p.Tipo_pago,
                        p.Cantidad_pago
                    FROM Orden o
                    LEFT JOIN Usuario u ON o.Id_usuario = u.Id_usuario
                    LEFT JOIN Pagos p ON o.Id_pagos = p.Id_pagos
                    ORDER BY o.Fecha_orden DESC, o.Hora_orden DESC";

            error_log("📊 [GET ALL ORDERS] Query: " . $query);
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();

            $orders = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $orders[] = $row;
            }

            error_log("✅ [GET ALL ORDERS] Órdenes encontradas: " . count($orders));
            
            http_response_code(200);
            return json_encode(array(
                "success" => true,
                "orders" => $orders
            ));

        } catch (Exception $e) {
            error_log("❌ [GET ALL ORDERS] Error: " . $e->getMessage());
            http_response_code(500);
            return json_encode(array(
                "success" => false,
                "message" => "Error al obtener las órdenes: " . $e->getMessage()
            ));
        }
    }

    // Obtener detalles específicos de una orden
    public function getOrderDetails($orderId) {
        try {
            error_log("🎯 [GET ORDER DETAILS] Obteniendo detalles de orden ID: " . $orderId);
            
            // 1. Obtener información básica de la orden
            $query = "SELECT 
                        o.Id_orden,
                        o.Fecha_orden,
                        o.Hora_orden,
                        o.Codigo_orden,
                        o.Id_usuario,
                        u.Nombre,
                        u.Apellido,
                        u.Correo_electronico,
                        u.Telefono,
                        p.Tipo_pago,
                        p.Cantidad_pago
                    FROM Orden o
                    LEFT JOIN Usuario u ON o.Id_usuario = u.Id_usuario
                    LEFT JOIN Pagos p ON o.Id_pagos = p.Id_pagos
                    WHERE o.Id_orden = :Id_orden";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":Id_orden", $orderId);
            $stmt->execute();
            $orden = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$orden) {
                error_log("❌ [GET ORDER DETAILS] Orden no encontrada: " . $orderId);
                http_response_code(404);
                return json_encode(array(
                    "success" => false,
                    "message" => "Orden no encontrada."
                ));
            }

            error_log("✅ [GET ORDER DETAILS] Orden encontrada: " . print_r($orden, true));

            // 2. Obtener productos de la orden
            $productQuery = "SELECT 
                                op.Id_producto,
                                p.Nombre_producto,
                                p.Precio_producto,
                                p.Tipo_producto,
                                p.Descripcion,
                                p.Imagen,
                                op.cantidad
                            FROM Orden_Producto op
                            LEFT JOIN Producto p ON op.Id_producto = p.Id_producto
                            WHERE op.Id_orden = :Id_orden";

            $productStmt = $this->db->prepare($productQuery);
            $productStmt->bindParam(":Id_orden", $orderId);
            $productStmt->execute();

            $productos = array();
            while ($producto = $productStmt->fetch(PDO::FETCH_ASSOC)) {
                $productos[] = $producto;
            }

            error_log("✅ [GET ORDER DETAILS] Productos encontrados: " . count($productos));

            http_response_code(200);
            return json_encode(array(
                "success" => true,
                "orden" => $orden,
                "productos" => $productos
            ));

        } catch (Exception $e) {
            error_log("❌ [GET ORDER DETAILS] Error: " . $e->getMessage());
            http_response_code(500);
            return json_encode(array(
                "success" => false,
                "message" => "Error al obtener los detalles de la orden: " . $e->getMessage()
            ));
        }
    }

    // Obtener órdenes de un usuario específico
    public function getUserOrders($userId) {
        try {
            error_log("🎯 [GET USER ORDERS] Obteniendo órdenes del usuario ID: " . $userId);
            
            $query = "SELECT 
                        o.Id_orden,
                        o.Fecha_orden,
                        o.Hora_orden,
                        o.Codigo_orden,
                        p.Tipo_pago,
                        p.Cantidad_pago
                    FROM Orden o
                    LEFT JOIN Pagos p ON o.Id_pagos = p.Id_pagos
                    WHERE o.Id_usuario = :Id_usuario
                    ORDER BY o.Fecha_orden DESC, o.Hora_orden DESC";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":Id_usuario", $userId);
            $stmt->execute();

            $orders = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $orders[] = $row;
            }

            error_log("✅ [GET USER ORDERS] Órdenes encontradas: " . count($orders));
            
            http_response_code(200);
            return json_encode(array(
                "success" => true,
                "orders" => $orders
            ));

        } catch (Exception $e) {
            error_log("❌ [GET USER ORDERS] Error: " . $e->getMessage());
            http_response_code(500);
            return json_encode(array(
                "success" => false,
                "message" => "Error al obtener las órdenes del usuario: " . $e->getMessage()
            ));
        }
    }
}
?>