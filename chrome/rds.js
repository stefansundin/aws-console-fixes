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

setTimeout(function() {
  if (document.body.classList.contains("awsui-mezzanine-overrides")) {
    // New redesigned console
    var timer2 = setInterval(function() {
      if (window.location.hash.startsWith("#dbinstances:")) {
        var checkbox = document.querySelector('.awsui-modal-__state-showing #awsui-toggle-3'); // Engine version
        if (checkbox) {
          clearInterval(timer2);
          var div = checkbox.parentNode;
          while (!div.classList.contains("awsui-table-content-selector-option")) {
            div = div.parentNode;
          }
          console.log(div.textContent);
          if (div.textContent == "Engine version") {
            checkbox.click();
            document.querySelector('awsui-modal .awsui-radio-native-input[value="100"]').click(); // 100 resources
            document.querySelector('.awsui-table-preferences-confirm-button button').click();
          }
        }
      }
    }, 200);
  }
  else {
    var timer2 = setInterval(function() {
      if (window.location.hash.startsWith("#dbinstances:")) {
        var checkbox = document.querySelector('.gwt-CheckBox[aria-label="Engine Version"] label');
        if (checkbox) {
          clearInterval(timer2);
          checkbox.click();
          document.querySelector('.dialogContent button').click();
        }
      }
    }, 200);
  }
}, 1000);
