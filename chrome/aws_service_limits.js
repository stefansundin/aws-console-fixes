// Remove "AWS" and "Amazon" prefixes from the list (and inside paranthesis, e.g. "Amazon Elastic Block Store (Amazon EBS)"), and then sort it

var ul = document.querySelector("ul.pagetoc");
if (ul != null) {
  var li = ul.getElementsByTagName("li");

  var arr = [];
  for (var i=0; i < li.length; i++) {
    arr.push(li[i]);
    var a = li[i].getElementsByTagName("a")[0];
    a.textContent = a.textContent.replace(/AWS /g, "").replace(/Amazon /g, "");
  }

  arr.sort(function(a,b) {
    return a.textContent < b.textContent ? -1 : 1;
  });

  arr.forEach(function(li) {
    ul.appendChild(li);
  });
}
