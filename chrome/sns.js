// add a title to the table cells so you can mouse over instead of resizing the columns

setInterval(function() {
  var rows = document.querySelectorAll("div[ng-repeat='row in renderedRows']");
  for (var i=0; i < rows.length; i++) {
    var row = rows[i];
    for (let n of [1,3]) {
      var col = row.getElementsByClassName(`col${n}`)[0];
      if (col && !col.title) {
        col.title = col.textContent.trim();
      }
    }
  }
}, 1000);
