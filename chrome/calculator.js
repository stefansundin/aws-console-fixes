// Just disable the free tier checkbox by default

var timer = setInterval(function() {
  var free_tier = document.querySelector('.GLOBAL_FREE_TIER input[type="checkbox"]');
  if (free_tier && free_tier.checked) {
    clearInterval(timer);
    free_tier.click();
  }
}, 200);
