// Fill in the current account ID if the input field is empty (i.e. the URL didn't use the "account=" query parameter)

setTimeout(() => {
  const accountIdInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('accountId')
  );
  if (!accountIdInput || accountIdInput.value !== '') {
    return;
  }

  const awsUserInfoCookieResult =
    /(?:(?:^|.*;\s*)aws-userInfo\s*\=\s*([^;]*).*$)|^.*$/.exec(document.cookie);
  if (!awsUserInfoCookieResult) {
    return;
  }

  const awsUserInfoCookie = decodeURIComponent(awsUserInfoCookieResult[1]);
  const accountArn = JSON.parse(awsUserInfoCookie).arn;
  if (!accountArn) {
    return;
  }

  const accountId = accountArn.split(':')[4];
  if (!accountId) {
    return;
  }

  accountIdInput.value = accountId;
  // Without this event, the new value doesn't stick
  accountIdInput.dispatchEvent(new Event('input', { bubbles: true }));

  console.debug(`[aws-console-fixes] Filled in account ID: ${accountId}`);
}, 100);
