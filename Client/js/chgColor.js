function chgBlue() {
    $("#title").attr("class", "text-primary")
}

function chgGreen() {
    $("#title").attr("class", "text-success")
}

function main_chgColor() {
    console.log("Load Change Color...")
    $("#btnBlue").on("click", chgBlue)
    $("#btnGreen").on("click", chgGreen)
}