function toObject(arr) {
  var obj = {};
  arr.forEach(function(e) {
    obj[e[0]] = e[1];
  });
  return obj;
}

var args = toObject(window.location.search.substr(1).split("&").map(function(arg){ return arg.split("="); }));
var url = decodeURIComponent(args["openid.return_to"]);
console.log(url)

if (url.indexOf("redirect_uri") != -1) {
  var re = /redirect_uri=([^&]*)/g;
  var matches = re.exec(url);
  url = decodeURIComponent(matches[1]);
}

url = url.replace("&isauthcode=true", "");
url = url.replace(/[?&]state=hashArgs([^&]+)/, function(state, hashArgs) {
  console.log(state, hashArgs);
  return decodeURIComponent(hashArgs);
});
console.log(url);

var link = document.createElement("a");
link.href = url;
link.appendChild(document.createTextNode(`Go to ${url}`));

var div = document.createElement("div");
div.style.textAlign = "center";
div.appendChild(link);
document.body.insertBefore(div, document.body.firstChild);
