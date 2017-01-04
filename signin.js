// this script adds a link at the top of the signin page, to the page you would end up at
// useful to see what tabs you had open from yesterday, and close them rather than refresh

function toObject(arr) {
  var obj = {};
  arr.forEach(function(e) {
    obj[e[0]] = decodeURIComponent(e[1]);
  });
  return obj;
}

function getParams(url) {
  return toObject(url.substr(url.indexOf("?")+1).split("&").map(function(arg){ return arg.split("="); }));
}

var args = getParams(window.location.search);
console.log(args);

if (args["openid.return_to"]) {
  args = getParams(args["openid.return_to"]);
  console.log(args);
}

if (args.redirect_uri) {
  var url = args.redirect_uri;
  console.log(url);

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
}
