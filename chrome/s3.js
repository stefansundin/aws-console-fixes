// add a tooltip with the region code on the region column
// enable the use of shift-clicking to select multiple objects

var region_map = {
  "US East (N. Virginia)": "us-east-1",
  "US East (Ohio)": "us-east-2",
  "US West (N. California)": "us-west-1",
  "US West (Oregon)": "us-west-2",
  "Canada (Central)": "ca-central-1",
  "Asia Pacific (Mumbai)": "ap-south-1",
  "Asia Pacific (Seoul)": "ap-northeast-2",
  "Asia Pacific (Singapore)": "ap-southeast-1",
  "Asia Pacific (Sydney)": "ap-southeast-2",
  "Asia Pacific (Tokyo)": "ap-northeast-1",
  "EU (Frankfurt)": "eu-central-1",
  "EU (Ireland)": "eu-west-1",
  "EU (London)": "eu-west-2",
  "South America (São Paulo)": "sa-east-1",
};

function toObject(arr) {
  var obj = {};
  arr.forEach(function(e) {
    obj[e[0]] = decodeURIComponent(e[1]);
  });
  return obj;
}

var args = toObject(window.location.search.substr(1).split("&").map(function(arg){ return arg.split("="); }));
if (args.search && window.location.pathname != "/s3/home") {
  delete args.search;
}

setInterval(function() {
  if (args.search) {
    var input = document.querySelector('input.input-field[placeholder="Search for buckets"]');
    if (input) {
      input.value = args.search;
      delete args.search;

      // trigger input event
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("input", false, true);
      input.dispatchEvent(evt);
    }
  }

  var table = document.querySelector("table.table.table-condensed");
  if (!table) return;
  var rows = table.getElementsByTagName("tr");
  if (rows[0].getElementsByTagName("th")[1].innerText.trim() != "Region") {
    return;
  }
  for (var i=1; i < rows.length; i++) {
    var tr = rows[i];
    var tds = tr.getElementsByTagName("td");
    if (tds.length == 0) {
      continue;
    }
    var td = tds[1];
    if (!td || td.title || !td.innerText || !region_map[td.innerText]) {
      continue;
    }
    td.title = region_map[td.innerText];
  }
}, 1000);

var last_checkbox = null;

function getParent(e, nodeName) {
  while (e.nodeName != nodeName) {
    e = e.parentNode;
  }
  return e;
}

function nextElement(e, above) {
  if (above) {
    return e.previousSibling;
  }
  return e.nextSibling;
}

document.addEventListener("click", function(e) {
  if (e.target.nodeName != "INPUT") {
    return;
  }
  for (var el = e.target.parentNode; el != null; el = el.parentNode) {
    if (el.nodeName == "THEAD") {
      return; // ignore checkboxes in headers (the select all checkbox)
    }
    if (el.nodeName == "NG-INCLUDE" && el.getAttribute("src") != "'/s3/partials/objects.html'") {
      return; // ignore checkboxes outside of object list tab
    }
  }

  if (e.shiftKey && document.body.contains(last_checkbox)) {
    var last_tr = getParent(last_checkbox, "TR");
    var click_tr = getParent(e.target, "TR");

    // look to see if click_tr is above last_tr
    var above = false;
    for (var tr = last_tr.previousSibling; tr != null; tr = tr.previousSibling) {
      if (tr == click_tr) {
        above = true;
        break;
      }
    }

    // click checkboxes between last_tr and click_tr (excluding click_tr)
    for (var tr = last_tr; tr != null && tr != click_tr; tr = nextElement(tr,above)) {
      if (tr.nodeName != "TR") {
        continue;
      }
      var input = tr.getElementsByTagName("input")[0];
      if (input.checked != e.target.checked) {
        input.click();
      }
    }
  }
  last_checkbox = e.target;
}, {
  capture: true,
  passive: true,
});
