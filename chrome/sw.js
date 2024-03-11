/**
 * @typedef {import('./types.js').ContentScriptName} ContentScriptName
 */

import { availableContentScripts } from './scripts/index.js';
import { syncTheme } from './scripts/syncTheme.js';
import { getOptions, isRequiredPermissionsGranted } from './utils.js';

async function checkPermissions() {
  const registeredContentScripts =
    await chrome.scripting.getRegisteredContentScripts();
  if (registeredContentScripts.length === 0) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  const granted = await isRequiredPermissionsGranted();
  const text = granted ? '' : '!';
  chrome.action.setBadgeText({ text });
}

async function unregisterContentScripts() {
  const registeredContentScripts =
    await chrome.scripting.getRegisteredContentScripts();
  if (registeredContentScripts.length > 0) {
    await chrome.scripting.unregisterContentScripts({
      ids: registeredContentScripts.map((s) => s.id),
    });
  }
}

async function updateOptions() {
  await unregisterContentScripts();

  const options = await getOptions();

  // Register the content scripts that the user wants
  const enabledContentScripts = options.enabledContentScripts.filter(
    (id) => id in availableContentScripts,
  );
  const contentScripts = enabledContentScripts.map(
    (id) => availableContentScripts[id],
  );

  if (contentScripts.length > 0) {
    await chrome.scripting.registerContentScripts(contentScripts);
  }

  // Do misc things
  if (options.syncTheme) {
    syncTheme(options.theme, options.effectiveTheme);
  }
}

chrome.runtime.onMessage.addListener(({ type, name }, sender, sendResponse) => {
  if (type === 'updateOptions') {
    updateOptions()
      .then(() => sendResponse(true))
      .catch(() => sendResponse(false))
      .finally(() => checkPermissions());
    return true;
  } else if (type === 'unregisterContentScripts') {
    unregisterContentScripts()
      .then(() => sendResponse(true))
      .catch(() => sendResponse(false))
      .finally(() => checkPermissions());
    return true;
  }
});

// Not available in Firefox:
if (chrome.storage.session.setAccessLevel) {
  // Make it possible for content scripts to access chrome.storage.session:
  chrome.storage.session
    .setAccessLevel({
      accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
    })
    .catch(console.error);
}

updateOptions();

chrome.permissions.onAdded.addListener(() => checkPermissions());
chrome.permissions.onRemoved.addListener(() => checkPermissions());
