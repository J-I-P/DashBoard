var vOp = {
    "Add": "+",
    "Sub": "-",
    "Mul": "*",
    "Div": "/",
    "Dot": ".",
    "Left": "(",
    "Right": ")"
};

function setInput(){
    var vID = this.id.substring(3);
    var vEqu = $("#equ").val();
    var vEquLen = vEqu.length;

    console.log(vID);
    switch(vID){
        case "Cls":
            $("#equ").val("");
            $("#ans").val("");
            break;
        case "Del":
            var z = vEqu.substring(0, vEquLen-1);
            $("#equ").val(z);
            break;
        case "Add":
        case "Sub":
        case "Mul":
        case "Div":
        case "Dot":
        case "Left":
        case "Right":
            $("#equ").val(vEqu + vOp[vID]);
            break;
        case "eql":
            setAns();
            break;
        default:
            $("#equ").val(vEqu + vID);
            break;
    }
}

function setAns(){
    var vEqu = $("#equ").val();
    $("#ans").val( eval(vEqu) );
}

function main_cal(){
    console.log("Hello");
    $("#cal .btn").on('click', setInput);
}