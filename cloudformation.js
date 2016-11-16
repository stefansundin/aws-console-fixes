setInterval(function() {
  var checkbox = document.querySelector("input[name=CAPABILITY_IAM]");
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
  }
}, 1000);
