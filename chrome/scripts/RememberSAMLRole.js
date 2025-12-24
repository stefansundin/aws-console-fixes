// Remember and automatically check the radio button for the last previously used role on the SAML sign-in page.
// The SAML page may have multiple accounts listed, so the script computes a key for looking up which role to pre-select.
// If there is not an exact match in the stored mappings then it attempts to find a mapping that is a superset of the available roles.

/**
 * @param {string} key
 * @param {Record<string, string>} samlRoles
 */
function findBestRoleFallback(key, samlRoles) {
  const keySet = new Set(key.split(','));
  // This could be improved by ranking the intersection and picking the best one, but this is good enough for the first attempt
  return Object.entries(samlRoles).find(([k, _]) => keySet.isSupersetOf(new Set(k.split(','))))?.[1];
}

async function main() {
  /** @type {import('../utils.js')} */
  const { getStorage } = await import(
    chrome.runtime.getURL('utils.js')
  );

  const storage = await getStorage();
  /** @type {StorageData} */
  const { samlRoles } = await storage.get({ samlRoles: {} });
  console.debug('[aws-console-fixes]', { samlRoles });

  const form = /** @type {HTMLFormElement} */ (document.getElementById('saml_form'));
  // Using namedItem() to avoid type issue: https://github.com/microsoft/TypeScript/issues/19437
  const roles = /** @type {RadioNodeList} */ (form.elements.namedItem('roleIndex'));
  const key = Array.from(roles.values()).map((i) => i.value).join(',');
  const selectedRole = samlRoles[key] || findBestRoleFallback(key, samlRoles);
  console.debug('[aws-console-fixes]', { samlRoles, key, selectedRole });

  if (selectedRole) {
    for (const role of roles) {
      if (role.value === selectedRole) {
        role.click();
        break;
      }
    }
  }

  // Can't use a submit listener because the button is using JavaScript to submit the form :(
  document.getElementById('signin_button')?.addEventListener('click', function () {
    for (const role of roles) {
      if (role.checked) {
        const roleArn = role.value;

        // Make sure we operate on fresh data:
        /** @type {Promise<Partial<StorageData>>} */
        (storage.get({ samlRoles: {} }))
          .then(async ({ samlRoles }) => {
            if (samlRoles) {
              console.debug('[aws-console-fixes] Updating mapping:', { key: roleArn });
              samlRoles[key] = roleArn;
              await storage.set({ samlRoles });
            }
          });

        break;
      }
    }
  });
}

main();
