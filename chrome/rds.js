var timer = setInterval(function() {
  if (window.location.hash == "") {
    var upsell = document.querySelector('#rds-dashboard-ad-aurora-mysql-launch-instance-btn');
    if (upsell) {
      clearInterval(timer);
      var div = upsell.parentNode;
      while (div.parentNode.id != "rds-dashboard") {
        div = div.parentNode;
        if (!div.parentNode) return;
      }
      div.parentNode.removeChild(div);
    }
  }
}, 200);
