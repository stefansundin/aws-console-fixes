// Remove "AWS" and "Amazon" prefixes from the policy generator dropdown, and then sort the list

setInterval(function() {
  var select = document.querySelector("select.serviceDropdown");
  if (select == null) return;

  var options = select.getElementsByTagName("option");
  if (options[0].textContent.substr(0,4) != "AWS ") return;

  var arr = [];
  for (var i=0; i < options.length; i++) {
    var option = options[i];
    if (option.textContent.substr(0,4) == "AWS ") {
      option.textContent = option.textContent.substr(4);
    }
    else if (option.textContent.substr(0,7) == "Amazon ") {
      option.textContent = option.textContent.substr(7);
    }
    arr.push(option);
  }

  arr.sort(function(a,b) {
    return a.textContent < b.textContent ? -1 : 1;
  });

  arr.forEach(function(option) {
    select.appendChild(option);
  });
}, 1000);
