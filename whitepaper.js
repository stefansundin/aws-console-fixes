// https://aws.amazon.com/lambda/serverless-architectures-learn-more/
// https://aws.amazon.com/lambda/serverless-architectures-learn-more/dl/

var retURL = document.querySelector("input[name=retURL]");
if (retURL) {
  var node = retURL;
  while (node.tagName != "FORM") {
    node = node.parentNode;
  }
  var btn = document.createElement("a");
  btn.href = retURL.value;
  btn.className = "button btn-size-normal btn-non-block btn-gold";
  btn.appendChild(document.createTextNode("Download"));
  node.parentNode.appendChild(btn);
  node.parentNode.removeChild(node);
}
