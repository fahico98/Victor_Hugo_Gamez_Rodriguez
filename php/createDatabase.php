
<?php

include("connection.php");

function createDatabase(){
   try{
      global $db_name, $table_name;
      $pdo = connect();
      $query = "CREATE DATABASE IF NOT EXISTS $db_name";
      $pdo->query($query);
      $query = "USE $db_name";
      $pdo->query($query);
      $query =
         "CREATE TABLE IF NOT EXISTS $table_name (
            id                      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            nombre_producto         VARCHAR(100) NOT NULL UNIQUE,
            marca                   VARCHAR(100) NOT NULL,
            numero_de_serie         VARCHAR(50) NOT NULL UNIQUE,
            cantidad                INT,
            maximo                  INT,
            minimo                  INT,
            almacen                 INT,
            gabeta_o_rack           VARCHAR(50),
            nivel                   VARCHAR(50),
            ubicacion               VARCHAR(50)
         )";
      $pdo->query($query);
      $pdo = null;
   }catch(Exception $e){
      die("ERROR: " . $e->getMessage());
   }
}

?>