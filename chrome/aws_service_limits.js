// Remove "AWS" and "Amazon" prefixes from the list, and then sort it

var ul = document.querySelector(".highlights ul");
if (ul != null) {
  var li = ul.getElementsByTagName("li");

  var arr = [];
  for (var i=0; i < li.length; i++) {
    arr.push(li[i]);
    var a = li[i].getElementsByTagName("a")[0];
    if (a.textContent.substr(0,4) == "AWS ") {
      a.textContent = a.textContent.substr(4);
    }
    else if (a.textContent.substr(0,7) == "Amazon ") {
      a.textContent = a.textContent.substr(7);
    }
  }

  arr.sort(function(a,b) {
    return a.textContent < b.textContent ? -1 : 1;
  });

  arr.forEach(function(li) {
    ul.appendChild(li);
  });
}
