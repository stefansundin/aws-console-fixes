// https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-console.html
// You can prefill the form with a URL like this:
// https://signin.aws.amazon.com/switchrole?account=account_id_number&roleName=role_name&displayName=text_to_display
// Both the "account" and "roleName" parameters are required, but displayName is optional.

// autofill the current account id to simplify switching role, if empty
var account = document.getElementById("account");
if (account.value == "") {
  var account_id = JSON.parse(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)aws-userInfo\s*\=\s*([^;]*).*$)|^.*$/, "$1"))).arn.split(":")[4];
  account.value = account_id;

  // trigger default display name update
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("input", false, true);
  account.dispatchEvent(evt);
}
