// sort the subnet list in the launch instance wizard, first based on AZ, then Name, then subnet id

setInterval(function() {
  // first of all, there are subnet dropdowns in other parts of the ec2 console, but (for now at least) we only want to sort the one in the launch wizard
  if (!window.location.hash.startsWith("#LaunchInstanceWizard:")) return;

  var options = document.querySelectorAll("select:enabled option[value*='subnet-']");
  if (options.length == 0) return;
  var select = options[0].parentNode;

  var arr = [];
  for (var i=0; i < options.length; i++) {
    if (options[i].parentNode != select) {
      break;
    }
    arr.push(options[i]);
  }

  arr.sort(function(a,b) {
    var a_text = a.textContent.split(" | ");
    var b_text = b.textContent.split(" | ");
    if (a_text.length != b_text.length) {
      return a_text.length > b_text.length ? -1 : 1;
    }
    else if (a_text[2] == b_text[2] && a_text[1] == b_text[1]) {
      return a_text[0] < b_text[0] ? -1 : 1;
    }
    else if (a_text[2] == b_text[2]) {
      return a_text[1] < b_text[1] ? -1 : 1;
    }
    else {
      return a_text[2] < b_text[2] ? -1 : 1;
    }
  });

  var sorted = true;
  for (var i=0; i < arr.length; i++) {
    if (arr[i] != options[i]) {
      sorted = false;
      break;
    }
  }
  if (sorted) return;

  var select = options[0].parentNode;
  arr.forEach(function(option) {
    select.appendChild(option);
  });
  select.selectedIndex = 0;
}, 1000);
