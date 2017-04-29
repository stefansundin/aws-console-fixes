// In the EC2 console, linkify the aws:autoscaling:groupName tag
// In the ASG console, linkify the launch configuration

function getParent(e, nodeName) {
  while (e.nodeName != nodeName) {
    e = e.parentNode;
  }
  return e;
}

function toObject(arr, f=decodeURIComponent) {
  var obj = {};
  arr.forEach(function(e) {
    obj[e[0]] = f(e[1]);
  });
  return obj;
}

var params = toObject(window.location.search.substr(1).split("&").map((arg) => arg.split("=")));

setInterval(function() {
  if (window.location.hash.startsWith("#Instances:")) {
    var keys = document.querySelectorAll("td:first-child div.GSG");
    for (var i=0; i < keys.length; i++) {
      if (keys[i].textContent == "aws:autoscaling:groupName") {
        var td = getParent(keys[i], "TD");
        var val = td.nextSibling.getElementsByClassName("GSG")[0];
        if (val.firstChild.nodeName == "A") return;

        var asg = val.textContent;
        var a = document.createElement("a");
        a.href = `/ec2/autoscaling/home?region=${params.region}#AutoScalingGroups:filter=${asg};view=details`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(asg));
        val.replaceChild(a, val.firstChild);
        break;
      }
    }
  }
  else if (window.location.hash.startsWith("#AutoScalingGroups:")) {
    var keys = document.querySelectorAll("td:first-child div.MQ");
    for (var i=0; i < keys.length; i++) {
      // For some reason I can only select English, French (only in ca-central-1), Japanese, and Chinese in the dropdown...
      var l10n = ["Launch Configuration", "configuration de lancement", "起動設定", "启动配置"];
      if (l10n.indexOf(keys[i].textContent) != -1) {
        var val = keys[i].nextSibling.getElementsByClassName("A5G")[0];
        if (val.firstChild.nodeName == "A") return;

        var lc = val.textContent;
        var a = document.createElement("a");
        a.href = `/ec2/autoscaling/home?region=${params.region}#LaunchConfigurations:filter=${lc}`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(lc));
        val.replaceChild(a, val.firstChild);
        break;
      }
    }
  }
}, 1000);
