// Remove "AWS" and "Amazon" prefixes from the list, and then sort it
// Set Policy Type to "IAM Policy" by default because I think that's what most people use.

var select = document.getElementById("stmt_service");
if (select != null) {
  var options = select.getElementsByTagName("option");

  var arr = [];
  for (var i=0; i < options.length; i++) {
    var option = options[i];
    var text = option.textContent;
    if (text == "Manage Amazon API Gateway") {
      option.textContent = "API Gateway - Manage";
    }
    else if (text.substr(0,4) == "AWS ") {
      option.textContent = text.substr(4);
    }
    else if (text.substr(0,7) == "Amazon ") {
      option.textContent = text.substr(7);
    }
    arr.push(option);
  }

  arr.sort(function(a,b) {
    return a.textContent < b.textContent ? -1 : 1;
  });

  arr.forEach(function(option) {
    select.appendChild(option);
  });

  var select = document.getElementById("policy_type");
  select.value = "IAMPolicy";
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  select.dispatchEvent(evt);
}
