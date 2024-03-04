import { getDateInFuture } from '../utils.js';

/**
 * @typedef {import('../types.js').Theme} Theme
 * @typedef {import('../types.js').EffectiveTheme} EffectiveTheme
 */

/**
 * @param {Theme} theme
 * @param {EffectiveTheme} [effectiveTheme]
 */
export async function syncTheme(theme, effectiveTheme) {
  const newCookieExpirationDate = getDateInFuture(180).getTime() / 1000;
  const refreshCookieExpirationDate = getDateInFuture(50);

  // AWS Management Console
  {
    // Normally AWS sets the expiration date to 10 days in the future (sometimes it uses a session cookie too???)
    // The possible values are: default, light, dark
    // This code sets the expiration date to 180 days in the future, and updates the cookie if it is due to expire in the next 50 days

    const value = theme === 'auto' ? 'default' : theme;
    const cookie = await chrome.cookies.get({
      name: 'awsc-color-theme',
      url: 'https://console.aws.amazon.com/',
    });
    console.debug('syncTheme: awsc-color-theme', cookie);

    if (
      !cookie ||
      value !== cookie.value ||
      cookie.expirationDate === undefined ||
      new Date(cookie.expirationDate * 1000) < refreshCookieExpirationDate
    ) {
      console.debug(
        'syncTheme: updated cookie',
        await chrome.cookies.set({
          url: 'https://console.aws.amazon.com/',
          domain: '.amazon.com',
          expirationDate: newCookieExpirationDate,
          httpOnly: false,
          secure: false,
          name: 'awsc-color-theme',
          path: '/',
          value,
        }),
      );
    }
  }

  // Updates the theme on docs.aws.amazon.com:
  if (effectiveTheme) {
    // effectiveTheme may be undefined if the user has never saved the options. This should never happen in practice.
    // If the user changes their system theme (or it changes automatically based on the time of day) then the docs theme will be out of sync.

    const textTheme =
      effectiveTheme === 'dark'
        ? 'awsui-polaris-dark-mode'
        : 'awsdocs-theme-light';
    const codeTheme = effectiveTheme;

    const cookie = await chrome.cookies.get({
      name: 'aws-docs-settings',
      url: 'https://docs.aws.amazon.com/',
    });
    console.debug('syncTheme: aws-docs-settings', cookie);

    let updateCookie = false;
    let awsDocsSettings = { textTheme, codeTheme };

    if (cookie) {
      // Decode existing cookie value
      awsDocsSettings = JSON.parse(atob(cookie.value));
      console.debug(
        'syncTheme: awsDocsSettings',
        JSON.stringify(awsDocsSettings),
      );
      if (
        (awsDocsSettings.textTheme &&
          !['awsdocs-theme-light', 'awsui-polaris-dark-mode'].includes(
            awsDocsSettings.textTheme,
          )) ||
        (awsDocsSettings.codeTheme &&
          !['light', 'dark'].includes(awsDocsSettings.codeTheme))
      ) {
        updateCookie = false;
      } else if (
        awsDocsSettings.textTheme !== textTheme ||
        awsDocsSettings.codeTheme !== codeTheme
      ) {
        updateCookie = true;
        awsDocsSettings.textTheme = textTheme;
        awsDocsSettings.codeTheme = codeTheme;
      } else if (
        cookie.expirationDate === undefined ||
        new Date(cookie.expirationDate * 1000) < refreshCookieExpirationDate
      ) {
        updateCookie = true;
      }
      console.debug(
        'syncTheme: awsDocsSettings',
        JSON.stringify(awsDocsSettings),
      );
    } else {
      updateCookie = true;
    }

    if (updateCookie) {
      console.debug(
        'syncTheme: updated cookie',
        // This is a host-only cookie, which means that the domain property has to be omitted!
        await chrome.cookies.set({
          url: 'https://docs.aws.amazon.com/',
          expirationDate: newCookieExpirationDate,
          httpOnly: false,
          secure: false,
          name: 'aws-docs-settings',
          path: '/',
          value: btoa(JSON.stringify(awsDocsSettings)),
        }),
      );
    }
  }
}
