var timer = setInterval(function() {
  if (window.location.hash == "") {
    var upsell = document.querySelector('#rds-dashboard-ad-aurora-mysql-launch-instance-btn');
    if (upsell) {
      clearInterval(timer);
      var div = upsell.parentNode.parentNode.parentNode;
      div.parentNode.removeChild(div);
    }
  }
}, 200);
