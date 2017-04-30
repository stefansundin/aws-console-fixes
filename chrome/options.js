var default_options = {
  redirect_signin: false
};

document.addEventListener('DOMContentLoaded', function() {
  var redirect_signin_input = document.getElementById('redirect_signin');
  var save_button = document.getElementById('save');
  var status = document.getElementById('status');

  chrome.storage.sync.get(default_options, function(items) {
    redirect_signin_input.checked = items.redirect_signin;
  });

  save_button.addEventListener('click', function() {
    var new_options = {
      redirect_signin: redirect_signin_input.checked
    };
    chrome.storage.sync.set(new_options, function() {
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 5000);
    });
  });

  document.getElementById('reset').addEventListener('click', function() {
    redirect_signin_input.checked = false;
    chrome.storage.sync.clear(function() {
      status.textContent = 'Options reset.';
      setTimeout(function() {
        status.textContent = '';
      }, 5000);
    });
  });
});
