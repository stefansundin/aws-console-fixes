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

// Add a link directly to your own user in the IAM console.
// this element is not present when logged in to the root account
var username_div = document.querySelector("#awsc-login-display-name-user");
if (username_div) {
  const label_text = document.querySelector("#awsc-login-display-name-label-user").textContent;
  if (label_text == "IAM User:" || label_text == "Logged in as:") {
    var username = username_div.textContent;
    var username_link = document.createElement("a");
    username_link.id = "awsc-login-display-name-user";
    username_link.classList.add("awsc-username-display-name");
    username_link.title = username;
    username_link.href = `https://console.aws.amazon.com/iam/home#/users/${username}`;
    username_link.textContent = username;
    username_div.replaceWith(username_link);
  }
}

// Global shortcuts
document.body.addEventListener("keydown", e => {
  // Press ` to open the Services dropdown and focus the search field. You can press the Escape key to close it when the search field is focused. Pressing ` again when the search field is not focused will close the dropdown.
  const nav = document.getElementById("nav-servicesMenu");
  const input = document.getElementById("awsc-services-search-autocomplete");
  const dropdown = document.getElementById("servicesMenuContent");
  if (!dropdown || !nav || !input) {
    return;
  }

  if (e.target == input && e.key == "Escape") {
    input.blur();
    nav.click();
    e.preventDefault();
    return;
  }
  if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") {
    return;
  }
  if (e.key == "`") {
    const hidden = (dropdown.style.display == "none");
    nav.click();
    if (hidden) {
      input.focus();
    }
    else {
      input.blur();
    }
    e.preventDefault();
    return;
  }
});
