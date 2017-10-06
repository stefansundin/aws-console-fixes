// Add direct links to headers

var body = document.querySelector("#main-col-body");
if (body != null) {
  var h2s = body.getElementsByTagName("h2");
  for (var i=0; i < h2s.length; i++) {
    var h2 = h2s[i];
    if (!h2.id) continue;

    // h2.textContent += ` #${h2.id}`;
    var a = document.createElement("a");
    a.href = `#${h2.id}`;
    a.textContent = "#";
    a.className = "aws-console-fixes";
    // h2.insertBefore(a, h2.firstChild);
    h2.appendChild(document.createTextNode(" "));
    h2.appendChild(a);
  }
}
