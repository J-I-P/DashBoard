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

        //SE5
        // var item = '<tr>'+
        //     '<th scope="row">'+ orderList.length+'</th>'+
        //         '<td>'+ opt[n][selectIndex]+'</td>'+
        //         '<td>'+ price[n][selectIndex]+'</td>'+
        //         '<td>'+ amount+'</td>'+
        //         '<td>'+ total+'</td>'+
        //         '<td>'+
        //             '<button class="btn btn-danger tablebtn">'+
        //                 '<i class="far fa-trash-alt"></i>'+
        //             '</button>'+
        //         '</td>'+
        //     '</tr>';

        //SE6
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

function setOrderID() {
    var today = new Date();
    var sY = today.getFullYear().toString();
    //var sM = (today.getMonth() + 1).toString();
    //var sD = today.getDate().toString();
    var sM = numeral(today.getMonth()+1).format('00');
    var sD = numeral(today.getDate()).format('00');
    var sN = numeral(seqNo).format('0000');
    $("#orderID").val(sY+sM+sD+sN);
}

function delOnRow() { //button in td being clicked
    //console.log("In td tag button clicked...");
    //console.log($(this)); // $(this) : the clicked button
    // $(this).parent() : the <td>
    // $(this).parent().parent() :the <tr>
    // $(this).parent().parent().parent() : the <tbody>
    // $(this).parent().parent().parent().children() : [tr-1, tr-2, ...]
    // $(this).parent().parent().children() : <tr>.children() : [td-1, td-2, ...]
    // array.index(ele) : index of element in the array
    // rowIndex = [tr-1, tr-2, ...].index(the <tr>)
    // colIndex = [td-1, td-2, ...].index(the <td>)

    var rowIndex = $(this).parent().parent().parent().children().index( $(this).parent().parent());
    var colIndex = $(this).parent().parent().children().index( $(this).parent());

    //console.log(rowIndex, colIndex);

    var oneRow = $(this).closest("tr");
    //SE5
    //var n = oneRow['0'].firstChild.innerText *1 -1;
    //SE6
    var n = oneRow['0'].firstElementChild.innerText *1 -1;

    oneRow.remove();

    var newTBody = $('#order')['0'].children;
    for(var i = 0; i<newTBody.length ; ++i){
        //SE5
        //newTBody[i].firstChild.innerText = i+1;
        //SE6
        newTBody[i].firstElementChild.innerText = i+1;
    }

    //console.log(orderList[n]);
    setTotal( orderTotal - orderList[n].unnitPrice*orderList[n].amount);
    orderList.splice(n,1);


}

function main_pos() {
    $("input[name='styles']").on("change", chg);
    $("#menus").on("change", showStatus);
    $("#amount").on("change", showStatus);
    $("#addItem").on("click", addItem);
    $("#clearItem").on("click", clearItem);
    $('.table tbody').on("click", '.btn', delOnRow);
    chg();
    setOrderID();
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
var seqNo = 1;