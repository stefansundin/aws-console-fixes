// Disable spellcheck on input fields

setInterval(function() {
  // Some input fields are created dynamically, which is why an interval is required
  document.querySelectorAll("input[type='text'],textarea").forEach(function(ta){
    ta.spellcheck = false;
  });
}, 1000);
