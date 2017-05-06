// Remove spaces before the dot to make DNS records easier to copy.. ugh..

setInterval(function() {
  var div = document.getElementsByClassName("GEHJJTKDB2D")[0];
  if (div == null) return;

  if (div.previousSibling.nodeType == Node.TEXT_NODE) {
    div.parentNode.removeChild(div.previousSibling);
  }
  if (div.firstChild.nodeType == Node.TEXT_NODE) {
    div.removeChild(div.firstChild);
  }
}, 1000);
