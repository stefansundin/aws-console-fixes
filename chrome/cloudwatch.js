// Sort the lambda function dropdown (Logs -> Actions -> Stream to AWS Lambda)
// Sort the elasticsearch dropdown (Logs -> Actions -> Stream to Amazon Elasticsearch Service)

function sort_dropdown(select) {
  if (select == null || select.disabled) return;

  var options = select.getElementsByTagName("option");
  if (options.length < 2) return;

  var arr = [];
  var sorted = true;
  for (var i=1; i < options.length; i++) {
    var option = options[i];
    if (arr.length > 0 && option.textContent.toLowerCase() < arr[arr.length-1].textContent.toLowerCase()) {
      sorted = false;
    }
    arr.push(option);
  }
  if (sorted) return;

  arr.sort(function(a,b) {
    return a.textContent.toLowerCase() < b.textContent.toLowerCase() ? -1 : 1;
  });

  arr.forEach(function(option) {
    select.appendChild(option);
  });
}

setInterval(function() {
  sort_dropdown(document.querySelector("#gwt-debug-lambdaFunctionListBox"));
  sort_dropdown(document.querySelector("#gwt-debug-elasticSearchClusterListBox"));
}, 1000);
