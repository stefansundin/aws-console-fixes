// add a tooltip with the region code on the region column

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

setInterval(function() {
  var table = document.querySelector("table.table.table-condensed");
  if (!table) return;
  var rows = table.getElementsByTagName("tr");
  if (rows[0].getElementsByTagName("th")[1].innerText.trim() != "Region") {
    return;
  }
  for (var i=1; i < rows.length; i++) {
    var tr = rows[i];
    var td = tr.getElementsByTagName("td")[1];
    if (!td || td.title || !td.innerText || !region_map[td.innerText]) {
      continue;
    }
    td.title = region_map[td.innerText];
  }
}, 1000);
