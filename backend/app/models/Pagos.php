<?php
class Pagos {
    private $conn;
    private $table_name = "Pagos";

    public $Id_pagos;
    public $Tipo_pago;
    public $Cantidad_pago;
    // NO incluir Fecha_pago - la fecha va en la orden

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear pago - SIN fecha
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 (Tipo_pago, Cantidad_pago) 
                 VALUES (:Tipo_pago, :Cantidad_pago)";
        
        $stmt = $this->conn->prepare($query);

        // Sanitizar datos
        $this->Tipo_pago = htmlspecialchars(strip_tags($this->Tipo_pago));

        // Bind parameters
        $stmt->bindParam(":Tipo_pago", $this->Tipo_pago);
        $stmt->bindParam(":Cantidad_pago", $this->Cantidad_pago);

        if($stmt->execute()) {
            $this->Id_pagos = $this->conn->lastInsertId();
            return true;
        }
        
        error_log("❌ Error en Pagos->create(): " . print_r($stmt->errorInfo(), true));
        return false;
    }

    // Obtener pago por ID
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE Id_pagos = :Id_pagos";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Id_pagos", $this->Id_pagos);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Obtener todos los pagos (solo admin)
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Actualizar pago
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET Tipo_pago=:Tipo_pago, Cantidad_pago=:Cantidad_pago 
                 WHERE Id_pagos = :Id_pagos";

        $stmt = $this->conn->prepare($query);

        $this->Tipo_pago = htmlspecialchars(strip_tags($this->Tipo_pago));

        $stmt->bindParam(":Tipo_pago", $this->Tipo_pago);
        $stmt->bindParam(":Cantidad_pago", $this->Cantidad_pago);
        $stmt->bindParam(":Id_pagos", $this->Id_pagos);

        if($stmt->execute()) {
            return true;
        }
        
        error_log("❌ Error en Pagos->update(): " . print_r($stmt->errorInfo(), true));
        return false;
    }

    // Eliminar pago
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE Id_pagos = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Id_pagos);

        if($stmt->execute()) {
            return true;
        }
        
        error_log("❌ Error en Pagos->delete(): " . print_r($stmt->errorInfo(), true));
        return false;
    }
}
?>