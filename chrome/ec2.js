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

// For some reason I can only select English, French (only in ca-central-1), Japanese, and Chinese in the dropdown...
var languages = {
  "English": ["Launch Configuration", "Load Balancers", "Target Groups", "Subnet(s)"],
  "Français": ["configuration de lancement", "Equilibreurs de charge", "Groupes cible", "Sous-réseau(x) (subnets)"],
  "日本語": ["起動設定", "ロードバランサー", "ターゲットグループ", "サブネット"],
  "中文(简体)": ["启动配置", "负载均衡器", "目标组", "子网"],
};
var lang = document.getElementById("awsc-language").textContent;
var l10n = languages[lang];

setInterval(function() {
  if (window.location.hash.startsWith("#Instances:")) {
    var keys = document.querySelectorAll("td:first-child");
    for (var i=0; i < keys.length; i++) {
      if (keys[i].textContent.trim() == "aws:autoscaling:groupName") {
        var val = keys[i].nextSibling;
        while (true) {
          var divs = val.getElementsByTagName("div");
          if (divs.length == 0) {
            break;
          }
          val = divs[0];
        }
        if (val.firstChild.nodeName == "A") break;

        var value = val.textContent;
        var a = document.createElement("a");
        a.href = `/ec2/autoscaling/home?region=${params.region}#AutoScalingGroups:filter=${value};view=details`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(value));
        val.replaceChild(a, val.firstChild);
        break;
      }
    }
  }
  else if (window.location.hash.startsWith("#AutoScalingGroups:") && l10n) {
    var keys = document.querySelectorAll("td div.MQ");
    for (var i=0; i < keys.length; i++) {
      var val = keys[i].nextSibling.getElementsByClassName("A5G")[0];
      if (!val || !val.firstChild || val.firstChild.nodeName == "A") continue;
      var key = keys[i].textContent;
      var value = val.textContent;

      if (key == l10n[0]) {
        var a = document.createElement("a");
        a.href = `/ec2/autoscaling/home?region=${params.region}#LaunchConfigurations:filter=${value}`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(value));
        val.replaceChild(a, val.firstChild);
      }
      else if (key == l10n[1]) {
        val.removeChild(val.firstChild);
        value.split(", ").forEach(function(v, i, arr) {
          var a = document.createElement("a");
          a.href = `/ec2/v2/home?region=${params.region}#LoadBalancers:search=${v}`;
          a.style.padding = "0";
          a.appendChild(document.createTextNode(v));
          val.appendChild(a);
          if (i != arr.length-1) {
            val.appendChild(document.createTextNode(", "));
          }
        });
      }
      else if (key == l10n[2]) {
        val.removeChild(val.firstChild);
        value.split(", ").forEach(function(v, i, arr) {
          var a = document.createElement("a");
          a.href = `/ec2/v2/home?region=${params.region}#TargetGroups:search=${v}`;
          a.style.padding = "0";
          a.appendChild(document.createTextNode(v));
          val.appendChild(a);
          if (i != arr.length-1) {
            val.appendChild(document.createTextNode(", "));
          }
        });
      }
      else if (key == l10n[3]) {
        val.removeChild(val.firstChild);
        value.split(",").forEach(function(v, i, arr) {
          var a = document.createElement("a");
          a.href = `/vpc/home?region=${params.region}#subnets:filter=${v}`;
          a.style.padding = "0";
          a.appendChild(document.createTextNode(v));
          val.appendChild(a);
          if (i != arr.length-1) {
            val.appendChild(document.createTextNode(", "));
          }
        });
      }
    }
  }

  if (window.location.hash.startsWith("#Instances:") || window.location.hash.startsWith("#LaunchConfigurations:")) {
    var titles = document.getElementsByClassName("dialogTop");
    for (var i=0; i < titles.length; i++) {
      if (titles[i].classList.contains("aws-console-fixes")) continue;
      var title = titles[i].innerText.trim();
      if (title == "View/Change User Data" || title == "User data") {
        var tbody = titles[i].parentNode;
        var textarea = tbody.getElementsByTagName("textarea")[0];
        textarea.parentNode.classList.add("userdata-container");
        titles[i].classList.add("aws-console-fixes");
      }
      else if (title.startsWith("System Log:")) {
        titles[i].getElementsByTagName("div")[3].classList.add("system-log-title");
        var tbody = titles[i].parentNode;
        tbody.getElementsByTagName("pre")[0].classList.add("system-log-body");
        titles[i].classList.add("aws-console-fixes");
      }
    }
  }
}, 1000);
