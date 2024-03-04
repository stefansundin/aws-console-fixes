import * as bootstrap from '../bootstrap/bootstrap.esm.bundle.min.js';
import defaultOptions, { optionsVersion } from '../defaultOptions.js';
import {
  getStorage,
  getStorageAreaName,
  isCheckbox,
  isChecked,
} from '../utils.js';

/**
 * @typedef {import('../types.js').ContentScriptName} ContentScriptName
 * @typedef {import('../types.js').StorageAreaName} StorageAreaName
 * @typedef {import('../types.js').Theme} Theme
 * @typedef {import('../types.js').EffectiveTheme} EffectiveTheme
 * @typedef {HTMLButtonElement | HTMLInputElement | HTMLOutputElement | HTMLSelectElement | HTMLTextAreaElement} FormControlElement
 */

/**
 * @typedef {Object} NewOptions
 * @property {Theme | undefined} theme
 * @property {EffectiveTheme | undefined} effectiveTheme
 * @property {boolean | undefined} syncTheme
 * @property {ContentScriptName[]} enabledContentScripts
 */

/**
 * @typedef {Object} SaveData
 * @property {StorageAreaName | undefined} newStorageAreaName
 * @property {NewOptions} newOptions
 */

/** @returns {EffectiveTheme} */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

async function updateDebug() {
  const textarea = /** @type HTMLTextAreaElement */ (
    document.getElementById('debug')
  );
  textarea.value = JSON.stringify(
    {
      extensionVersion: (await chrome.runtime.getManifest()).version,
      storage: {
        session: await chrome.storage.session.get(null),
        local: await chrome.storage.local.get(null),
        sync: await chrome.storage.sync.get(null),
      },
      registeredContentScripts:
        await chrome.scripting.getRegisteredContentScripts(),
    },
    null,
    '  ',
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  await updateDebug();
  const extensionInfo = await chrome.management.getSelf();
  if (extensionInfo.installType === 'development') {
    const debugDetails = /** @type HTMLDetailsElement */ (
      document.getElementById('debugDetails')
    );
    debugDetails.open = true;
  }

  const storageAreaName = await getStorageAreaName();
  const storage = chrome.storage[storageAreaName];

  const { options, dismissedAlerts } = await storage.get({
    options: defaultOptions,
    dismissedAlerts: [],
  });

  // themeTemp is the currently selected theme, which may not have been saved to storage yet
  let themeTemp = options.theme;

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (themeTemp === 'auto') {
        document.documentElement.setAttribute(
          'data-bs-theme',
          e.matches ? 'dark' : 'light',
        );
      }
    });

  const theme = options.theme === 'auto' ? getSystemTheme() : options.theme;
  document.documentElement.setAttribute('data-bs-theme', theme);

  const optionsForm = /** @type HTMLFormElement */ (
    document.getElementById('options')
  );

  const formElements = /** @type FormControlElement[] */ (
    Array.from(optionsForm.elements)
  );

  for (const e of formElements) {
    if (e.name === 'storageArea') {
      e.value = storageAreaName;
    } else if (e.name === 'theme') {
      e.value = options.theme;
      e.addEventListener('input', (e) => {
        const target = /** @type HTMLSelectElement */ (e.target);
        themeTemp = target.value;
        const theme = target.value === 'auto' ? getSystemTheme() : target.value;
        document.documentElement.setAttribute('data-bs-theme', theme);
      });
    } else if (e.name === 'syncTheme') {
      const el = /** @type HTMLInputElement */ (e);
      el.checked = options.syncTheme;
    } else if (e.name === 'contentScript[]') {
      const el = /** @type HTMLInputElement */ (e);
      el.checked = options.enabledContentScripts.includes(el.value);
    }
  }

  async function saveOptions() {
    const { newStorageAreaName, newOptions } = formElements.reduce(
      (acc, e) => {
        if (e.name === 'storageArea') {
          const el = /** @type HTMLSelectElement */ (e);
          acc.newStorageAreaName = /** @type StorageAreaName */ (el.value);
        } else if (e.name === 'theme') {
          acc.newOptions.theme = /** @type Theme */ (e.value);
          if (acc.newOptions.theme === 'auto') {
            acc.newOptions.effectiveTheme = getSystemTheme();
          }
        } else if (e.name === 'contentScript[]' && isChecked(e)) {
          acc.newOptions.enabledContentScripts.push(
            /** @type ContentScriptName */ (e.value),
          );
        } else if (e.name === 'syncTheme' && isCheckbox(e)) {
          acc.newOptions.syncTheme = e.checked;
        }
        return acc;
      },
      /** @type SaveData */ ({
        newStorageAreaName: undefined,
        newOptions: {
          theme: undefined,
          effectiveTheme: undefined,
          syncTheme: undefined,
          enabledContentScripts: [],
        },
      }),
    );

    if (newStorageAreaName === 'local') {
      await chrome.storage.session.clear();
    } else if (newStorageAreaName === 'sync') {
      await chrome.storage.session.clear();
      await chrome.storage.local.clear();
    }
    const newStorage =
      chrome.storage[/** @type StorageAreaName */ (newStorageAreaName)];

    if (newStorageAreaName !== storageAreaName) {
      // Start by copying all options, which includes content script-specific options
      const allOptions = await storage.get(null);
      await newStorage.set(allOptions);
    }

    console.log('newOptions', newOptions);
    await newStorage.set({ version: optionsVersion, options: newOptions });

    await chrome.runtime.sendMessage({ type: 'updateOptions' });

    await updateDebug();
  }

  const saveButton = /** @type HTMLButtonElement */ (
    document.getElementById('save')
  );
  saveButton.addEventListener('click', async () => {
    try {
      await saveOptions();
      saveButton.textContent = 'Saved!';
      setTimeout(() => {
        saveButton.textContent = 'Save settings';
      }, 3000);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === 'Extension context invalidated.'
      ) {
        // The options page has to be reloaded if the extension is updated or reloaded
        console.debug(err);
        window.location.reload();
      } else {
        throw err;
      }
    }
  });

  const dismissedAlertsCount = /** @type HTMLSpanElement */ (
    document.getElementById('dismissedAlertsCount')
  );
  dismissedAlertsCount.innerText =
    `${dismissedAlerts.length} ` +
    (dismissedAlerts.length === 1 ? 'alert has' : 'alerts have');

  /** @type HTMLAnchorElement */ (
    document.getElementById('resetDismissedAlerts')
  ).addEventListener('click', async () => {
    const storage = await getStorage();
    await storage.set({ dismissedAlerts: [] });
    dismissedAlertsCount.innerText = '0 alerts have';
  });

  /** @type HTMLAnchorElement */ (
    document.getElementById('reset')
  ).addEventListener('click', async () => {
    await chrome.storage.session.clear();
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
    const registeredContentScripts =
      await chrome.scripting.getRegisteredContentScripts();
    if (registeredContentScripts.length > 0) {
      await chrome.scripting.unregisterContentScripts({
        ids: registeredContentScripts.map((s) => s.id),
      });
    }
    await updateDebug();
    window.location.reload();
  });

  // Setup bootstrap stuff
  const tooltipElements = /** @type NodeListOf<HTMLElement> */ (
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  for (const tooltipElement of tooltipElements) {
    new bootstrap.Tooltip(tooltipElement);
  }
});
