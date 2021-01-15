
var btn = document.getElementById("btn-alert");
var alert = document.getElementById("alert-boot");

var bsAlert = new bootstrap.Alert(alert);


btn.addEventListener('click', function() {
    bsAlert.close();
})

