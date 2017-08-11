// Remove spaces before the dot to make DNS records easier to copy.. ugh..
// GEHJJTKDB2D=div container for domain div
// GEHJJTKDM1D=subdomain input

setInterval(function() {
  var div = document.getElementsByClassName("GEHJJTKDB2D")[0];
  if (div != null) {
    if (div.previousSibling.nodeType == Node.TEXT_NODE) {
      div.parentNode.removeChild(div.previousSibling);
    }
    if (div.firstChild.nodeType == Node.TEXT_NODE) {
      div.removeChild(div.firstChild);
    }
  }
  var input = document.getElementsByClassName("GEHJJTKDM1D")[0];
  if (input != null && input.pattern == "") {
    // Technically, Route 53 supports any character in a subdomain, even space, but how often do you really intend on creating a record with a space?
    // This will not prevent you from submitting the form, but it will trigger CSS to highlight the input.
    input.pattern = "[a-zA-Z0-9._\\-]+";
  }
}, 1000);
