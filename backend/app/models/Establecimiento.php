<?php
class Establecimiento {
    private $conn;
    private $table_name = "Establecimiento";

    public $Id_Establecimiento;
    public $Nombre_sede;
    public $Ciudad;
    public $Tipo_de_mesa;
    public $Responsable;
    public $Mesero;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los establecimientos
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Crear establecimiento
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET Nombre_sede=:Nombre_sede, Ciudad=:Ciudad, 
                     Tipo_de_mesa=:Tipo_de_mesa, Responsable=:Responsable, Mesero=:Mesero";
        
        $stmt = $this->conn->prepare($query);

        $this->Nombre_sede = htmlspecialchars(strip_tags($this->Nombre_sede));
        $this->Ciudad = htmlspecialchars(strip_tags($this->Ciudad));
        $this->Tipo_de_mesa = htmlspecialchars(strip_tags($this->Tipo_de_mesa));

        $stmt->bindParam(":Nombre_sede", $this->Nombre_sede);
        $stmt->bindParam(":Ciudad", $this->Ciudad);
        $stmt->bindParam(":Tipo_de_mesa", $this->Tipo_de_mesa);
        $stmt->bindParam(":Responsable", $this->Responsable);
        $stmt->bindParam(":Mesero", $this->Mesero);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Actualizar establecimiento
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                 SET Nombre_sede=:Nombre_sede, Ciudad=:Ciudad, 
                     Tipo_de_mesa=:Tipo_de_mesa, Responsable=:Responsable, Mesero=:Mesero 
                 WHERE Id_Establecimiento = :Id_Establecimiento";

        $stmt = $this->conn->prepare($query);

        $this->Nombre_sede = htmlspecialchars(strip_tags($this->Nombre_sede));
        $this->Ciudad = htmlspecialchars(strip_tags($this->Ciudad));
        $this->Tipo_de_mesa = htmlspecialchars(strip_tags($this->Tipo_de_mesa));

        $stmt->bindParam(":Nombre_sede", $this->Nombre_sede);
        $stmt->bindParam(":Ciudad", $this->Ciudad);
        $stmt->bindParam(":Tipo_de_mesa", $this->Tipo_de_mesa);
        $stmt->bindParam(":Responsable", $this->Responsable);
        $stmt->bindParam(":Mesero", $this->Mesero);
        $stmt->bindParam(":Id_Establecimiento", $this->Id_Establecimiento);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Eliminar establecimiento
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE Id_Establecimiento = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->Id_Establecimiento);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>