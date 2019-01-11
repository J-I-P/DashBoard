function chgSubTotal() {
    var subTotal = $("#perPrice").val() * $("#amount").val();
    $("#total").val(subTotal);
}

function showStatus() {
    var n = $("input[name='styles']:checked").val();
    var selectIndex = $("#menus option:selected").index();
    var perPrice = price[n][selectIndex];

    $("#perPrice").val(perPrice);
    chgSubTotal();
}

function chg() {
    var n = ( typeof(this.value) == "string" ? this.value : "0");
    $("#menus option").remove();
    for(var i in opt[n]) {
        var newOpt = new Option( opt[n][i], price[n][i]);
        $("#menus").append(newOpt);
    }
    showStatus();
}

function showTableHeader(pID, pTotal) {
    $("#txtOrderID").html( pID );
    $("#orderTotal").html( pTotal*1 );
}

function setTotal(price) {
    orderTotal = price*1;
    $("#orderTotal").html(orderTotal);
    $("#txtOrderID").html( $("#orderID").val());
}

function mkACartRow(pSeqNo, pItemObj) {
    return  `
    <tr>
        <th scope="row">${pSeqNo}</th>
        <td>${pItemObj.itemName}</td>
        <td>${pItemObj.unnitPrice}</td>
        <td>${pItemObj.qty}</td>
        <td>${pItemObj.unnitPrice*pItemObj.qty}</td>
        <td>
            <button class="btn btn-danger tablebtn">
                <i class="far fa-trash-alt"></i>
            </button>
        </td>
    </tr>
`  //依照mkACartObj的格式:itemName menu_index qty unnitPrice
$("#order").append
}

function mkACartObj() {
    var n = $("input[name='styles']:checked").val();
    var index = $("#menus option:selected").index();
    var qty = $("#amount").val();
    var subTotal = $("#total").val();
    
    return {
        styles: n,
        menu_index: index,
        qty: qty,
        itemName: opt[n][index],
        unnitPrice: price[n][index]
    };
}

function addItem() {
        var obj = mkACartObj();
        orderList.push(obj);
        //console.log(obj);

        var item = mkACartRow( orderList.length, obj);
        //console.log(item);
        $("#order").append(item);
        orderTotal +=obj.unnitPrice*obj.qty;
        showTableHeader( $("#orderID").val(), orderTotal);
}

function showOrderList() {
    orderTotal = 0;
    $("#order").empty();
    for (var i in orderList ){
        var item = mkACartRow((i*1+1), orderList[i]);
        $("#order").append(item);
        orderTotal += orderList[i].unnitPrice*orderList[i].qty;
        //console.log(orderTotal);
    }
    showTableHeader( $("#orderID").val(), orderTotal );

}

function clearItem() {
    orderList = [];
    showOrderList();
}

function setOrderID(allOrderIDs) {
    var today = new Date();
    var sY = today.getFullYear().toString();
    var sM = numeral(today.getMonth()+1).format('00');
    var sD = numeral(today.getDate()).format('00');
    var sN = numeral(seqNo).format('0000');
    var sYMD = sY+sM+sD;
    
    var allOrderIDs = $("#orderIDs > option").map(
        function() {return this.value;}
    ).get();
    //console.log(allOrderIDs);

    var lastSeqNo = seqNo;
    if (allOrderIDs.length!=0) {
        var cnt = allOrderIDs.length;
        var lastOrderID = allOrderIDs[cnt-1];
        var lastDate = lastOrderID.substr(0,8);
        lastSeqNo = lastOrderID.substr(8)*1;
    }

    seqNo = (sYMD==lastDate? lastSeqNo+1: seqNo+1);

    var sN = numeral(seqNo).format('0000');
    $("#orderID").val(sYMD+sN);
    //$("#txtOrderID").html(sYMD+sN);
}

function checkOut(){
    $.ajax({
        url:'./Server/checkOut.php',
        method:'POST',
        data: {
            orderID: $('#orderID').val(),
            orderList: orderList,
            orderTotal: orderTotal
        },
        success: function(rsp) {
            //console.log(rsp);
            getAllOrderIDs();
        }
    });
    setOrderID();
    clearItem();
}

function delOnRow() {
    var rowIndex = $(this).parent().parent().parent().children().index( $(this).parent().parent());
    var colIndex = $(this).parent().parent().children().index( $(this).parent());
    var oneRow = $(this).closest("tr");
    var n = oneRow['0'].firstElementChild.innerText *1 -1;

    oneRow.remove();

    var newTBody = $('#order')['0'].children;
    for(var i = 0; i<newTBody.length ; ++i){
        newTBody[i].firstElementChild.innerText = i+1;
    }

    orderTotal -= orderList[n].unnitPrice*orderList[n].qty;
    showTableHeader( $("#orderID").val(), orderTotal );
    orderList.splice(n,1);
}

function showOrderItems() {
    var theID = $("#orderIDs option:selected").val();
    if( !theID ){
        return;
    }
    $.ajax({
        url:'./Server/getOrderItems.php',
        method: 'POST',
        data: { orderID: theID },
    success: function(rsp) {
        var theID = $("#orderIDs option:selected").val();
        //console.log(rsp);
        var selectedOrderList = eval(rsp);
        var orderSum = 0;
        $("#order").empty();
        
        for ( var i in selectedOrderList ) {
            var aItem = selectedOrderList[i];
            orderSum += aItem.qty * aItem.unit_price;
            var item =
                '<tr>'+
                    '<th scope="row">' + (i*1+1) + '</th>'+
                    '<td>'+aItem.item_name+'</td>'+
                    '<td>'+aItem.unit_price+'</td>'+
                    '<td>'+aItem.qty+'</td>'+
                    '<td>'+ (aItem.unit_price*aItem.qty)+'</td>'+
                '</tr>';
            $("#order").append(item);
        }
        showTableHeader(theID, orderSum);
        if(opMode==0){
            showContentByOpMode();
        }
    }
});
}

function getAllOrderIDs() {
    $.ajax({
        url: './Server/getAllOrderIDs.php',
        method: 'POST',
        data: {
        },

        success: function(rsp) {
            $("#orderIDs").on("change", showOrderItems);

            var allOrderIDs = eval( rsp );
            $("#orderIDs").empty();
            for(var i in allOrderIDs) { 
                var aItem = new Option(allOrderIDs[i]);
                $("#orderIDs").append( aItem );
            }
            
            showOrderItems();
            
            //console.log(allOrderIDs);
            setOrderID(allOrderIDs);
        }
    })
}

function toggleOpMode(){
    console.log("in toggleOpMode...");
    opMode = 1-opMode;
    showContentByOpMode();
}

function showContentByOpMode() {
    console.log("in showContentByOpMode...");
    if(opMode==1){
        $("#newOID").hide();
        $("#insertArea").hide();
        $("#allOID").show();
        $("#txtOpMode").html("點餐");
        showOrderItems();
    }else {
        $("#newOID").show();
        $("#insertArea").show();
        $("#allOID").hide();
        $("#txtOpMode").html("查詢");
        showOrderList();
    }
}

function main_new() {
    $("input[name='styles']").on("change", chg);
    $("#menus").on("change", showStatus);
    $("#amount").on("change", showStatus);
    $("#addItem").on("click", addItem);
    $("#clearItem").on("click", clearItem);
    $('.table tbody').on("click", '.btn', delOnRow);
    $("#cash").on("click", checkOut);
    $("#btnOpMode").on("click", toggleOpMode);
    chg();
    getAllOrderIDs();
    showContentByOpMode();
}

var opt, price;
opt = [
    ["00>燒餅", "01>油條", "02>豆漿"],
    ["10>漢堡", "11>薯條", "12>可樂"],
    ["20>馬鈴薯", "21>玉米濃湯", "22>起士培根", "23>奶昔"]
]
price = [
    [10, 15, 12],
    [20, 25, 15],
    [50, 35, 25, 15]
]
var orderList = [];
var orderTotal = 0;
var seqNo = 0;
var opMode = 1;