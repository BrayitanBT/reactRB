<?php
class User {
    private $conn;
    private $table_name = "Usuario";

    public $Id_usuario;
    public $Nombre;
    public $Apellido;
    public $Documento;
    public $Telefono;
    public $Correo_electronico;
    public $Contrasena;
    public $Tipo_usuario;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear usuario (Sign-up)
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET Nombre=:Nombre, Apellido=:Apellido, Documento=:Documento, 
                     Telefono=:Telefono, Correo_electronico=:Correo_electronico, 
                     Contrasena=:Contrasena, Tipo_usuario=:Tipo_usuario";
        
        $stmt = $this->conn->prepare($query);

        // Sanitizar datos
        $this->Nombre = htmlspecialchars(strip_tags($this->Nombre));
        $this->Apellido = htmlspecialchars(strip_tags($this->Apellido));
        $this->Correo_electronico = htmlspecialchars(strip_tags($this->Correo_electronico));
        $this->Tipo_usuario = htmlspecialchars(strip_tags($this->Tipo_usuario));

        // Hash password
        $this->Contrasena = password_hash($this->Contrasena, PASSWORD_DEFAULT);

        // Bind parameters
        $stmt->bindParam(":Nombre", $this->Nombre);
        $stmt->bindParam(":Apellido", $this->Apellido);
        $stmt->bindParam(":Documento", $this->Documento);
        $stmt->bindParam(":Telefono", $this->Telefono);
        $stmt->bindParam(":Correo_electronico", $this->Correo_electronico);
        $stmt->bindParam(":Contrasena", $this->Contrasena);
        $stmt->bindParam(":Tipo_usuario", $this->Tipo_usuario);

        if($stmt->execute()) {
            $this->Id_usuario = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Login usuario
    public function login() {
        $query = "SELECT Id_usuario, Nombre, Apellido, Documento, Telefono, 
                         Correo_electronico, Contrasena, Tipo_usuario 
                  FROM " . $this->table_name . " 
                  WHERE Correo_electronico = :Correo_electronico LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Correo_electronico", $this->Correo_electronico);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar password
            if(password_verify($this->Contrasena, $row['Contrasena'])) {
                $this->Id_usuario = $row['Id_usuario'];
                $this->Nombre = $row['Nombre'];
                $this->Apellido = $row['Apellido'];
                $this->Documento = $row['Documento'];
                $this->Telefono = $row['Telefono'];
                $this->Correo_electronico = $row['Correo_electronico'];
                $this->Tipo_usuario = $row['Tipo_usuario'];
                return true;
            }
        }
        return false;
    }

    // Verificar si email existe
    public function emailExists() {
        $query = "SELECT Id_usuario FROM " . $this->table_name . " 
                  WHERE Correo_electronico = :Correo_electronico";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Correo_electronico", $this->Correo_electronico);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Obtener todos los usuarios (solo admin)
    public function readAll() {
        $query = "SELECT Id_usuario, Nombre, Apellido, Documento, Telefono, 
                         Correo_electronico, Tipo_usuario 
                  FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Obtener usuario por ID
    public function readOne() {
        $query = "SELECT Id_usuario, Nombre, Apellido, Documento, Telefono, 
                         Correo_electronico, Tipo_usuario 
                  FROM " . $this->table_name . " 
                  WHERE Id_usuario = :Id_usuario";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":Id_usuario", $this->Id_usuario);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Verificar si es administrador
    public function isAdmin() {
        return $this->Tipo_usuario === 'administrador';
    }






    

    // Actualizar usuario
public function update() {
    $query = "UPDATE " . $this->table_name . " 
              SET Nombre=:Nombre, Apellido=:Apellido, Documento=:Documento, 
                  Telefono=:Telefono, Correo_electronico=:Correo_electronico, 
                  Tipo_usuario=:Tipo_usuario 
              WHERE Id_usuario = :Id_usuario";

    $stmt = $this->conn->prepare($query);

    // Sanitizar datos
    $this->Nombre = htmlspecialchars(strip_tags($this->Nombre));
    $this->Apellido = htmlspecialchars(strip_tags($this->Apellido));
    $this->Correo_electronico = htmlspecialchars(strip_tags($this->Correo_electronico));

    // Bind parameters
    $stmt->bindParam(":Nombre", $this->Nombre);
    $stmt->bindParam(":Apellido", $this->Apellido);
    $stmt->bindParam(":Documento", $this->Documento);
    $stmt->bindParam(":Telefono", $this->Telefono);
    $stmt->bindParam(":Correo_electronico", $this->Correo_electronico);
    $stmt->bindParam(":Tipo_usuario", $this->Tipo_usuario);
    $stmt->bindParam(":Id_usuario", $this->Id_usuario);

    if($stmt->execute()) {
        return true;
    }
    return false;
}

// Eliminar usuario
public function delete() {
    $query = "DELETE FROM " . $this->table_name . " WHERE Id_usuario = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->Id_usuario);

    if($stmt->execute()) {
        return true;
    }
    return false;
}
}
?>