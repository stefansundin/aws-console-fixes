import defaultOptions, { optionsVersion } from './defaultOptions.js';

/**
 * @typedef {import('./types.js').StorageAreaName} StorageAreaName
 * @typedef {import('./types.js').Options} Options
 */

export const isChrome = navigator.userAgent.includes('Chrome/');
export const isFirefox = navigator.userAgent.includes('Firefox/');

/**
 * @returns {Promise<StorageAreaName>}
 */
export async function getStorageAreaName() {
  return chrome.storage.session &&
    (await chrome.storage.session.get({ options: null })).options !== null
    ? 'session'
    : (await chrome.storage.local.get({ options: null })).options !== null
    ? 'local'
    : 'sync';
}

/**
 * @returns {Promise<chrome.storage.StorageArea>}
 */
export async function getStorage() {
  const storageAreaName = await getStorageAreaName();
  return chrome.storage[storageAreaName];
}

/**
 * @returns {Promise<Options>}
 */
export async function getOptions() {
  const storage = await getStorage();
  const { version, options } = await storage.get({
    version: optionsVersion,
    options: defaultOptions,
  });
  if (version > optionsVersion) {
    // Version number in storage is higher than what the installed version supports, probably because of synced settings
    void chrome.runtime.requestUpdateCheck();
  }
  return options;
}

/**
 * @param {number} days
 * @returns {Date}
 */
export function getDateInFuture(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Gets the page's document plus the document from any iframes that may be on the page.
 * @returns {Document[]}
 */
export function getPageDocuments() {
  const documents = /** @type Document[] */ (
    [
      document,
      ...Array.from(document.getElementsByTagName('iframe')).map(
        (iframe) => iframe.contentDocument,
      ),
    ].filter(Boolean)
  );
  return documents;
}

/**
 * @param {Element|null|undefined} el
 * @returns {el is HTMLElement}
 */
export function isHTMLElement(el) {
  return el?.nodeType === Node.ELEMENT_NODE;
}

/**
 * @param {Element|null|undefined} el
 * @returns {el is HTMLButtonElement}
 */
export function isButton(el) {
  return !!el && el.tagName === 'BUTTON';
}

/**
 * @param {Element|null|undefined} el
 * @returns {el is HTMLInputElement}
 */
export function isInputElement(el) {
  return !!el && el.tagName === 'INPUT';
}

/**
 * @param {Element|null|undefined} el
 * @returns {el is HTMLInputElement}
 */
export function isCheckbox(el) {
  return isInputElement(el) && el.type === 'checkbox';
}

/**
 * @param {Element|null|undefined} el
 * @returns {boolean}
 */
export function isChecked(el) {
  return isCheckbox(el) && el.checked;
}
