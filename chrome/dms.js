var timer = setInterval(function() {
  if (window.location.hash == "" || window.location.hash == "#dashboard:") {
    var alert = document.querySelector("awsui-alert");
    if (alert && alert.textContent.startsWith("Migrating your database? Try Aurora.")) {
      alert.querySelector(".awsui-alert-dismiss-control").click();
      clearInterval(timer);
    }
  }
}, 200);
