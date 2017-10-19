// Add data-region-id attr to current region to allow it to be shown in the dropdown.
// The menu is rebuilt every time it is opened, so that means we need to use an interval and look up the element every time.

var meta_region = document.querySelector("meta[name='awsc-mezz-region']");
var current_region = document.querySelector("#regionMenuContent span.current-region");

if (meta_region && current_region) {
  var region = meta_region.getAttribute("content");
  setInterval(function() {
    document.querySelector("#regionMenuContent span.current-region").setAttribute("data-region-id", region);
  }, 200);
}
