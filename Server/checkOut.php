<?php
    $orderID = $_REQUEST["orderID"];
    $orderList = $_REQUEST["orderList"];
    $total = $_REQUEST["orderTotal"];

    $aOrder = [
        'orderID' => $_REQUEST["orderID"],
        'orderList' => $_REQUEST["orderList"],
        'total' => $_REQUEST["orderTotal"]
    ];

    echo json_encode($aOrder, JSON_UNESCAPED_UNICODE);

    $servername = "localhost";
    $username = "pin";
    $password = "csie404";
    $dbname = $username;

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }
    
    $conn->query("SET NAMES UTF8;");

    foreach ($orderList as $key => $item) {
        $itemGroup = $item['styles'];
        $itemNo = $item['menu_index'];
        $itemName = $item['itemName'];
        $unitPrice = $item['unnitPrice'];
        $qty = $item['qty']; //index依照orderList裡的名稱

        $sql = "INSERT INTO `item_list`(`order_id`, `item_group`, `item_no`, `item_name`, `unit_price`, `qty`) VALUES ('$orderID', '$itemGroup', '$itemNo', '$itemName', $unitPrice, $qty)";
        

        $rs = $conn->query($sql);
        if($rs === TRUE) {
            echo "\n購物品項: " . $itemName . ":存入資料庫成功!\n";
        }else{
            echo "\n錯誤: " . $sql . "<br>" . $conn->error . "\n";
        }
    }

    $sql = "INSERT INTO `list_total`(`order_id`, `total`) VALUES ('" . $orderID . "', $total)";
    $rs = $conn->query($sql);
    if($rs === TRUE) {
        echo "\n訂單: " . $orderID . "總計: " . $total . ":存入資料庫成功!\n";
    }else{
        echo "\n錯誤: " . $sql . "<br>" . $conn->error . "\n";
    }

    $conn->close();
?>