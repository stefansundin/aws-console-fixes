// https://duckduckgo.com/?q=%22Please+complete+the+form+below+to+download+the%22+site%3Aaws.amazon.com&ia=web
// https://aws.amazon.com/lambda/serverless-architectures-learn-more/
// https://aws.amazon.com/lambda/serverless-architectures-learn-more/dl/
// https://pages.awscloud.com/awsmp_networking_solutionoverview.html

var retURL = document.querySelector("input[name=retURL]");
if (retURL) {
  var btn = document.createElement("a");
  btn.href = retURL.value;
  var form = retURL.form;
  var submit = form.querySelector("[type=submit]");
  if (submit.textContent.indexOf("Download") != -1) {
    btn.className = submit.className;
    btn.appendChild(document.createTextNode(submit.textContent));
    form.parentNode.appendChild(btn);
    form.parentNode.removeChild(form);
  }
  else {
    btn.className = "button btn-size-normal btn-non-block btn-gold";
    btn.appendChild(document.createTextNode("Skip form"));
    form.parentNode.insertBefore(btn, form);
  }
}
else {
  var content = document.getElementById("aws-page-content");
  var noscript = content.getElementsByTagName("noscript")[0];
  var form = content.getElementsByTagName("form")[0];
  if (noscript && form) {
    var htmlString = noscript.innerText;
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    var retURL = doc.querySelector("input[name=ret]");

    var btn = document.createElement("a");
    btn.href = retURL.value;
    btn.className = "button btn-size-normal btn-non-block btn-gold";
    btn.appendChild(document.createTextNode("Skip form"));
    form.parentNode.insertBefore(btn, form);
  }
}
