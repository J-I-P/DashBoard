<?php
    $orderID = $_REQUEST["orderID"];
    $servername = "localhost";
    $username = "pin";
    $password = "csie404";
    $dbname = $username;

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    $conn->query("SET NAMES UTF8;");

    
    $sql= "SELECT order_id, item_name, unit_price, qty FROM item_list WHERE order_id = '$orderID'";
    $rs = $conn->query($sql);

    $rsp = "[";
    if ($rs->num_rows > 0) {
        $i = 0;
        while ( $row = $rs->fetch_assoc() ) {
            if ( $i!=0 ){
                $rsp = $rsp . ",";
            }
            $oneObj = json_encode($row, JSON_UNESCAPED_UNICODE);
            $rsp .= $oneObj;
            ++$i;
        }
        $rsp = $rsp . "]";
        echo $rsp;
    }else{
        echo "\nError: " . $sql . "<br>" . $conn->error . "\n";
    }

    $conn -> close();

?>