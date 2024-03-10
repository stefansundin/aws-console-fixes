import {
  getOptions,
  getRequiredPermissions,
  getSystemTheme,
  isChrome,
  isFirefox,
  isRequiredPermissionsGranted,
} from '../utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (isChrome) {
    document.body.classList.add('chrome');
  } else if (isFirefox) {
    document.body.classList.add('firefox');
  }

  const options = await getOptions();

  if (options.theme === 'auto') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        document.documentElement.setAttribute(
          'data-bs-theme',
          e.matches ? 'dark' : 'light',
        );
      });
  }

  const theme = options.theme === 'auto' ? getSystemTheme() : options.theme;
  document.documentElement.setAttribute('data-bs-theme', theme);

  const currentStateParagraph = /** @type HTMLParagraphElement */ (
    document.getElementById('currentState')
  );
  const numEnabledScripts = options.enabledContentScripts.length;
  currentStateParagraph.textContent = `${numEnabledScripts} scripts are enabled.`;
  if (numEnabledScripts === 1) {
    currentStateParagraph.textContent =
      currentStateParagraph.textContent.replace('scripts are', 'script is');
  }

  const openOptionsButton = /** @type HTMLButtonElement */ (
    document.getElementById('openOptions')
  );
  openOptionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });

  const granted = await isRequiredPermissionsGranted();
  if (!granted) {
    const insufficientPermissionsAlert = /** @type HTMLDivElement */ (
      document.getElementById('insufficientPermissionsAlert')
    );
    insufficientPermissionsAlert.classList.remove('d-none');
    const fixPermissionsButton = /** @type HTMLButtonElement */ (
      document.getElementById('fixPermissions')
    );
    fixPermissionsButton.addEventListener('click', () => {
      const requiredPermissions = getRequiredPermissions(options);
      chrome.permissions.request(requiredPermissions);
      window.close();
    });
  }
});
