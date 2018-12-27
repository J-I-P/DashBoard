function showOrderItems() {
    var theID = $("#orderIDs option:selected").val();
    $.ajax({
        url:'./Server/getOrderItems.php',
        method: 'POST',
        data: { orderID: theID },

        success: function(rsp) {
            var theID = $("#orderIDs option:selected").val();
            //console.log(rsp);
            var selectedOrderList = eval(rsp);
            //console.log(rsp);
            //[{qty: xxx,
            //  item_name: xxx,
            //  unit_price: xxx,
            //}, ...
            //]
            var orderSum = 0;
            $("#selectedOrderList").empty();
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
                $("#selectedOrderList").append(item);
            }
            $("#selectedOrderTotal").html(orderSum);
            $("#selectedOrderID").html(theID);
        }
    });


}

function getAllOrderIDs() {
    $.ajax({
        url: './Server/getAllOrderIDs.php',
        method: 'POST',
        data: {
            //orderID: $('#orderID').val(),
            //orderList: orderList,
            //orderTotal: orderTotal
        },

        success: function(rsp) {
            $("#orderIDs").on("change", showOrderItems);
            console.log('success funciton : 123');
            console.log(rsp);

            var allOrderIDs = eval( rsp );
            console.log(allOrderIDs);
            $("#orderIDs").empty();
            for(var i in allOrderIDs) { // i is key, and is a string
                var aItem = new Option(allOrderIDs[i], allOrderIDs[i]);
                $("#orderIDs").append( aItem );
            }
            $("#orderID").val(Number($("#orderIDs option:last").val())+1);
            seqNo = Number($("#orderIDs option:last").val().substring(8))+1;
            showOrderItems();
        }
    })
} 

function main_posGet() {
    $("#btnRefreshOrderID").on("click", getAllOrderIDs);
    getAllOrderIDs();
}