// In the EC2 console, linkify the aws:autoscaling:groupName tag, and add links in the security group popup
// In the ASG console, linkify the launch configuration/template/elb/subnets

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

// Translations are really inconsistent and spotty throughout the console
var languages = {
  "English (US)": ["Launch Configuration", "Launch Template", "Classic Load Balancers", "Target Groups", "Subnet(s)", "Security Groups associated with"],
  "Deutsch": ["Startkonfiguration", "XXX", "Classic Load Balancer", "Zielgruppen", "Subnetz(e)", "Security Groups associated with"],
  "Español": ["Configuración de lanzamiento", "Plantilla de lanzamiento", "Balanceadores de carga clásicos", "Grupos de destino", "Subredes", "Security Groups associated with"],
  "Français": ["configuration de lancement", "Modèle de lancement", "Equlibreur(s) de charge standard", "Groupe(s) cible", "Sous-réseaux", "Groupes de sécurité associés à"],
  "日本語": ["起動設定", "起動テンプレート", "Classic ロードバランサー", "ターゲットグループ", "サブネット", "と関連付けられたセキュリティグループ"],
  "Italiano": ["Configurazione di avvio", "Modello di avvio", "Classic Load Balancer", "Gruppi target", "Sottorete(i)", "Security Groups associated with"],
  "한국어": ["시작 구성", "시작 템플릿", "클래식 로드 밸런서", "대상 그룹", "서브넷", "과(와) 연결된 보안 그룹"],
  "中文(简体)": ["启动配置", "启动模板", "Classic 负载均衡器", "目标组", "子网", "关联的安全组"],
  "中文(繁體)": ["启动配置", "启动模板", "Classic 负载均衡器", "目标组", "子网", "关联的安全组"],
};
var l10n = null;

setInterval(function() {
  if (!l10n) {
    var lang = document.getElementById("awsc-language");
    if (lang) {
      l10n = languages[lang.textContent];
    }
  }

  if (window.location.hash == "") {
    var alert = document.querySelector("awsui-alert");
    if (alert && alert.textContent.startsWith("Just need a simple virtual private server?")) {
      alert.querySelector(".awsui-alert-dismiss-control").click(); // this is saved in a cookie, but it's a per-region cookie :(
    }
  }
  else if (window.location.hash.startsWith("#Instances:")) {
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

    var popup = document.getElementsByClassName("popupContent")[0];
    if (popup && l10n) {
      var el = popup.firstChild;
      while (el && el.nodeType != Node.TEXT_NODE) {
        el = el.firstChild;
      }
      if (!el) {
        return;
      }
      var title = el.textContent.trim();
      if (title.indexOf(l10n[5]) != -1) {
        var table = popup.getElementsByTagName("table")[0];
        if (table) {
          var tr = table.getElementsByTagName("tr");
          for (var i=1; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td");
            var val = td[0];
            var protocol = td[1].textContent.trim();
            if (!val.classList.contains("aws-console-fixes") && val.textContent.indexOf("-") == -1 && (protocol == "tcp" || protocol == "udp")) {
              val.classList.add("aws-console-fixes");
              var v = val.textContent.trim();
              val.removeChild(val.firstChild);
              var a = document.createElement("a");
              a.href = `https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=${v} ${protocol}`;
              a.style.padding = "0";
              a.appendChild(document.createTextNode(v));
              val.appendChild(a);
            }
            var val = td[2];
            if (!val.classList.contains("aws-console-fixes")) {
              val.classList.add("aws-console-fixes");
              var value = val.textContent.trim();
              val.removeChild(val.firstChild);
              value.split(", ").forEach(function(v, i, arr) {
                if (v.startsWith("sg-")) {
                  var a = document.createElement("a");
                  a.href = `/ec2/v2/home?region=${params.region}#SecurityGroups:groupId=${v};sort=groupName`;
                  a.style.padding = "0";
                  a.appendChild(document.createTextNode(v));
                  val.appendChild(a);
                }
                else {
                  val.appendChild(document.createTextNode(v));
                }
                if (i != arr.length-1) {
                  val.appendChild(document.createTextNode(", "));
                }
              });
            }
          }
        }
      }
    }
  }
  else if (window.location.hash.startsWith("#AutoScalingGroups:") && l10n) {
    var keys = document.querySelectorAll("td div.ADB");
    for (var i=0; i < keys.length; i++) {
      if (!keys[i].nextElementSibling) continue;
      var val = keys[i].nextElementSibling.getElementsByClassName("gwt-Label")[0];
      if (!val || !val.firstChild || val.firstChild.nodeType != Node.TEXT_NODE) continue;
      var key = keys[i].textContent.trim();
      var value = val.textContent.trim();

      if (key == l10n[0]) {
        var a = document.createElement("a");
        a.href = `/ec2/autoscaling/home?region=${params.region}#LaunchConfigurations:filter=${value}`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(value));
        val.replaceChild(a, val.firstChild);
      }
      else if (key == l10n[1]) {
        var a = document.createElement("a");
        a.href = `/ec2/v2/home?region=${params.region}#LaunchTemplates:search=${value};sort=launchTemplateId`;
        a.style.padding = "0";
        a.appendChild(document.createTextNode(value));
        val.replaceChild(a, val.firstChild);
      }
      else if (key == l10n[2]) {
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
      else if (key == l10n[3]) {
        val.removeChild(val.firstChild);
        value.split(", ").forEach(function(v, i, arr) {
          var a = document.createElement("a");
          a.href = `/ec2/v2/home?region=${params.region}#TargetGroups:search=${v};sort=targetGroupName`;
          a.style.padding = "0";
          a.appendChild(document.createTextNode(v));
          val.appendChild(a);
          if (i != arr.length-1) {
            val.appendChild(document.createTextNode(", "));
          }
        });
      }
      else if (key == l10n[4]) {
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
        titles[i].classList.add("aws-console-fixes", "user-data-modal");
      }
      else if (title.startsWith("System Log:")) {
        titles[i].getElementsByTagName("div")[3].classList.add("system-log-title");
        var tbody = titles[i].parentNode;
        tbody.getElementsByTagName("pre")[0].classList.add("system-log-body");
        titles[i].classList.add("aws-console-fixes");
        for (var awsui=titles[i].parentNode; awsui != document.body; awsui=awsui.parentNode) {
          if (awsui.classList.contains("awsui")) {
            awsui.classList.add("system-log-modal");
            break;
          }
        }
      }
    }
  }
}, 1000);
