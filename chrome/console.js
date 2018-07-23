// Add data-region-id attr to current region to allow it to be shown in the dropdown.
// The menu is rebuilt every time it is opened, so that means we need to use an interval and look up the element every time.
// Add a link directly to your own user in the IAM console.

var meta_region = document.querySelector("meta[name='awsc-mezz-region']");
var current_region = document.querySelector("#regionMenuContent span.current-region");

if (meta_region && current_region) {
  var region = meta_region.getAttribute("content");
  setInterval(function() {
    document.querySelector("#regionMenuContent span.current-region").setAttribute("data-region-id", region);
  }, 200);
}

var username_div = document.querySelector("#awsc-login-display-name-user");
if (username_div) {
  // this element is not present when logged in to the root account
  var username = username_div.textContent;
  var username_link = document.createElement("a");
  username_link.href = `https://console.aws.amazon.com/iam/home#/users/${username}`;
  username_link.innerText = username;
  username_div.replaceWith(username_link);
}
