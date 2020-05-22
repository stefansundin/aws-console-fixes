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
// This may need improvements for non-English keyboard layouts
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
    const visible = (dropdown.style.display === "block");
    nav.click();
    if (visible) {
      input.blur();
    }
    else {
      input.focus();
    }
    e.preventDefault();
    return;
  }

  // Press 1-9 and 0 (0 is 10) to focus your console shortcuts. Does not automatically navigate so you have to press the Enter key afterwards.
  let i = parseInt(e.key, 10);
  if (!isNaN(i)) {
    if (i == 0) {
      i = 10;
    }
    const shortcutBar = document.getElementById("nav-shortcutBar");
    if (!shortcutBar) return;
    const a = shortcutBar.getElementsByTagName("a")[i-1];
    if (!a) return;
    a.focus();
    return;
  }

  // Press - to open the user dropdown
  // Press = to open the region dropdown
  if (e.key == "-" || e.key == "=") {
    let menu, dropdown;
    if (e.key == "-") {
      menu = document.getElementById("nav-usernameMenu");
      dropdown = document.getElementById("usernameMenuContent");
    }
    else if (e.key == "=") {
      menu = document.getElementById("nav-regionMenu");
      dropdown = document.getElementById("regionMenuContent");
    }
    if (!menu || !dropdown) return;
    const visible = (dropdown.style.display === "block");
    menu.click();
    if (!visible) {
      const a = dropdown.getElementsByTagName("a")[0];
      if (a) {
        setTimeout(function() {
          a.focus();
        }, 10);
      }
    }
    return;
  }
});
