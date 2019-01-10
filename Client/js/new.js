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
    var n = ( typeof(this.value) == "string" ? this.value : $("input[name='styles']:checked").val());
    $("#menus option").remove();
    for(var i in opt[n]) {
        var newOpt = new Option( opt[n][i], price[n][i]);
        $("#menus").append(newOpt);
    }
}

function setTotal(price) {
    orderTotal = price*1;
    $("#orderTotal").html(orderTotal);
    $('#txtOrderID').html( $("#orderID").val());
}

function addItem() {
        var n = $("input[name='styles']:checked").val();
        var selectIndex = $("#menus option:selected").index();
        var amount = $("#amount").val();
        var total = $("#total").val();
        var obj = {
            styles: n, 
            menu_index: selectIndex,
            amount,
            itemName: opt[n][selectIndex],
            unnitPrice: price[n][selectIndex]
        }

        orderList.push(obj);

        var item = `
            <tr>
                <th scope="row">${orderList.length}</th>
                <td>${opt[n][selectIndex]}</td>
                <td>${price[n][selectIndex]}</td>
                <td>${amount}</td>
                <td>${total}</td>
                <td>
                    <button class="btn btn-danger tablebtn">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `  
        $("#order").append(item);
        setTotal(total*1+orderTotal);
}

function clearItem() {
    $("#order").empty();
    orderList = [];
    setTotal(0);
}

function setOrderID(allOrderIDs) {
    var today = new Date();
    var sY = today.getFullYear().toString();
    var sM = numeral(today.getMonth()+1).format('00');
    var sD = numeral(today.getDate()).format('00');
    var sN = numeral(seqNo).format('0000');
    var sYMD = sY+sM+sD;
    
    if (typeof(allOrderIDs)!="object" && setIDMode==0){
        //++seqNo;
        $.ajax({
            url:'./Server/getAllOrderIDs.php',
            method:'POST',
            data: {
                orderID: $('#orderID').val(),
                orderList: orderList,
                orderTotal: orderTotal
            },
            success: function(rsp) {
                console.log(rsp);
                setOrderID(eval(rsp));
            }
        });
    }else if(typeof(allOrderIDs)!="object" && setIDMode==1){
        ++seqNo;
        setIDMode = 0;
    }else{    var cnt = allOrderIDs.length;
        var lastOrderID = allOrderIDs[cnt-1]+"";
        lastDate = lastOrderID.substr(0,8);
        lastSeqNo = lastOrderID.substr(8)*1;
        seqNo = (sYMD==lastDate? lastSeqNo+1 : seqNo+1);
    }
    var sN = numeral(seqNo).format('0000');
    $("#orderID").val(sYMD+sN);
    $("#txtOrderID").html(sYMD+sN);
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
            console.log(rsp);
            //getAllOrderIDs();
        }
    });
    setIDMode = 1;
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

    setTotal( orderTotal - orderList[n].unnitPrice*orderList[n].amount);
    orderList.splice(n,1);
}

function showOrderItems() {
    var theID = $("#orderIDs option:selected").val();
    // if (!theID){
    //     return;
    // }
    // let result;
    // result = await $.ajax({
    //     url:'./Server/getOrderItems.php',
    //     method: 'POST',
    //     data: { orderID: theID },
    // });
    // return result;
    $.ajax({
        url:'./Server/getOrderItems.php',
        method: 'POST',
        data: { orderID: theID },
    success: function(rsp) {
        var theID = $("#orderIDs option:selected").val();
        console.log(rsp);
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
        $("#orderTotal").html(orderSum);
        $("#txtOrderID").html(theID);
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
            
            console.log(allOrderIDs);
            setOrderID(allOrderIDs);
        }
    })
} 

function clearall_table(){
    $("#order").empty();

    $("#orderTotal").html("");
    $("#txtOrderID").html("");
}

function showOrderItemHandler(){
    getAllOrderIDs();
}

function showNewOrderList(){
    var today = new Date();
    var sY = today.getFullYear().toString();
    var sM = numeral(today.getMonth()+1).format('00');
    var sD = numeral(today.getDate()).format('00');
    var sN = numeral(seqNo).format('0000');
    var sYMD = sY+sM+sD;

    $("#orderID").val(sYMD+sN);

    clearall_table();

    var orderSum = 0;
    for ( var i in orderList ) {
        var aItem = orderList[i];
        console.log(aItem);
        orderSum += aItem.amount * aItem.unnitPrice;
        var item =
            '<tr>'+
                '<th scope="row">' + (i*1+1) + '</th>'+
                '<td>'+aItem.itemName+'</td>'+
                '<td>'+aItem.unnitPrice+'</td>'+
                '<td>'+aItem.amount+'</td>'+
                '<td>'+ (aItem.amount*aItem.unnitPrice)+'</td>'+
                '<td>'+
                    '<button class="btn btn-danger tablebtn">'+
                        '<i class="far fa-trash-alt"></i>'+
                    '</button>'+
                '</td>'+
            '</tr>';
        $("#order").append(item);
    }
    $("#orderTotal").html(orderSum);
    $("#txtOrderID").html(sYMD+sN);
}

function toggleOpMode(){
    opMode = 1-opMode;
    if(opMode==1){
        $("#newOID").hide();
        $("#insertArea").hide();
        $("#allOID").show();
        $("#txtOpMode").html("點餐");
        clearall_table();
        showOrderItemHandler();
    }else {
        $("#newOID").show();
        $("#insertArea").show();
        $("#allOID").hide();
        $("#txtOpMode").html("查詢");
        showNewOrderList();
    }
}

function main_new() {
    toggleOpMode();
    $("input[name='styles']").on("change", chg);
    $("#menus").on("change", showStatus);
    $("#amount").on("change", showStatus);
    $("#addItem").on("click", addItem);
    $("#clearItem").on("click", clearItem);
    $('.table tbody').on("click", '.btn', delOnRow);
    $("#cash").on("click", checkOut);
    chg();
    setOrderID();
    //showNewOrderList();

    $("#btnRefreshOrderID").on("click", getAllOrderIDs);
    $("#btnOpMode").on("click", toggleOpMode);
    //getAllOrderIDs();
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
var setIDMode = 0;