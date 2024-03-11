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

  {
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

    const fixPermissionsButton = /** @type HTMLButtonElement */ (
      document.getElementById('fixPermissions')
    );
    fixPermissionsButton.addEventListener('click', () => {
      const requiredPermissions = getRequiredPermissions(options);
      chrome.permissions.request(requiredPermissions);
      window.close();
    });
  }

  const openOptionsButton = /** @type HTMLButtonElement */ (
    document.getElementById('openOptions')
  );
  openOptionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });

  const toggleScriptsButton = /** @type HTMLButtonElement */ (
    document.getElementById('toggleScripts')
  );

  async function refreshState() {
    const options = await getOptions();
    const registeredContentScripts =
      await chrome.scripting.getRegisteredContentScripts();

    const currentStateParagraph = /** @type HTMLParagraphElement */ (
      document.getElementById('currentState')
    );
    currentStateParagraph.textContent = `${registeredContentScripts.length} scripts are registered.`;
    if (registeredContentScripts.length === 1) {
      currentStateParagraph.textContent =
        currentStateParagraph.textContent.replace('scripts are', 'script is');
    }

    toggleScriptsButton.disabled = options.enabledContentScripts.length === 0;
    toggleScriptsButton.textContent =
      options.enabledContentScripts.length > 0 &&
      registeredContentScripts.length === 0
        ? 'Enable scripts again'
        : 'Temporarily disable all scripts';

    const granted = await isRequiredPermissionsGranted();
    const insufficientPermissionsAlert = /** @type HTMLDivElement */ (
      document.getElementById('insufficientPermissionsAlert')
    );
    insufficientPermissionsAlert.classList.toggle(
      'd-none',
      granted || registeredContentScripts.length === 0,
    );
  }

  toggleScriptsButton.addEventListener('click', async () => {
    try {
      toggleScriptsButton.disabled = true;
      const registeredContentScripts =
        await chrome.scripting.getRegisteredContentScripts();
      if (registeredContentScripts.length === 0) {
        await chrome.runtime.sendMessage({ type: 'updateOptions' });
      } else {
        await chrome.runtime.sendMessage({ type: 'unregisterContentScripts' });
      }
      refreshState();
    } finally {
      toggleScriptsButton.disabled = false;
    }
  });

  refreshState();

  if (isFirefox) {
    for (const link of document.getElementsByTagName('a')) {
      if (link.target === '_blank') {
        link.addEventListener('click', () => {
          setTimeout(() => {
            window.close();
          }, 10);
        });
      }
    }
  }
});
