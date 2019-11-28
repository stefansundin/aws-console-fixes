// add a tooltip with the region code on the region column

var region_map = {
  "US East (N. Virginia)": "us-east-1",
  "US East (Ohio)": "us-east-2",
  "US West (N. California)": "us-west-1",
  "US West (Oregon)": "us-west-2",
  "Asia Pacific (Hong Kong)": "ap-east-1",
  "Asia Pacific (Mumbai)": "ap-south-1",
  "Asia Pacific (Seoul)": "ap-northeast-2",
  "Asia Pacific (Singapore)": "ap-southeast-1",
  "Asia Pacific (Sydney)": "ap-southeast-2",
  "Asia Pacific (Tokyo)": "ap-northeast-1",
  "Canada (Central)": "ca-central-1",
  "EU (Frankfurt)": "eu-central-1",
  "EU (Ireland)": "eu-west-1",
  "EU (London)": "eu-west-2",
  "EU (Paris)": "eu-west-3",
  "EU (Stockholm)": "eu-north-1",
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
  if (rows[0].getElementsByTagName("th")[3].innerText.trim() != "Region") {
    return;
  }
  for (var i=1; i < rows.length; i++) {
    var tr = rows[i];
    var tds = tr.getElementsByTagName("td");
    if (tds.length == 0) {
      continue;
    }
    var td = tds[3];
    if (!td || td.title || !td.innerText || !region_map[td.innerText]) {
      continue;
    }
    td.title = region_map[td.innerText];
  }
}, 1000);
