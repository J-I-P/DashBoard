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

function padding(num, length) {
    //这里用slice和substr均可
    return (Array(length).join("0") + num).slice(-length);
}

function setOrderID() {
    var today = new Date();
    var sY = today.getFullYear().toString();
    var sM = (today.getMonth() + 1).toString();
    var sD = today.getDate().toString();
    $("#orderID").val(sY+sM+sD+padding(seqNo, 3));
}

function main_pos() {
    $("input[name='styles']").on("change", chg);
    $("#menus").on("change", showStatus);
    $("#amount").on("change", showStatus);
    $("#addItem").on("click", addItem);
    $("#clearItem").on("click", clearItem);
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