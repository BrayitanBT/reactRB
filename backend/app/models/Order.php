<?php
class Order {
    private $conn;
    private $table_name = "Orden";

    public $Id_orden;
    public $Fecha_orden;
    public $Hora_orden;
    public $Codigo_orden;
    public $Id_usuario;
    public $Id_pagos;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear orden
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 (Fecha_orden, Hora_orden, Codigo_orden, Id_usuario, Id_pagos) 
                 VALUES (CURDATE(), CURTIME(), :Codigo_orden, :Id_usuario, :Id_pagos)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitizar datos
        $this->Codigo_orden = htmlspecialchars(strip_tags($this->Codigo_orden));

        // Bind parameters
        $stmt->bindParam(":Codigo_orden", $this->Codigo_orden);
        $stmt->bindParam(":Id_usuario", $this->Id_usuario);
        $stmt->bindParam(":Id_pagos", $this->Id_pagos);

        if($stmt->execute()) {
            $this->Id_orden = $this->conn->lastInsertId();
            return true;
        }
        
        error_log("❌ Error en Order->create(): " . print_r($stmt->errorInfo(), true));
        return false;
    }

    // Obtener orden por ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE Id_orden = :Id_orden";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Id_orden", $this->Id_orden);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Obtener órdenes por usuario
    public function readByUser($userId) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE Id_usuario = :Id_usuario 
                  ORDER BY Fecha_orden DESC, Hora_orden DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Id_usuario", $userId);
        $stmt->execute();
        return $stmt;
    }

    // Obtener todas las órdenes (solo admin)
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  ORDER BY Fecha_orden DESC, Hora_orden DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>