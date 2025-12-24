import { getDateInFuture } from '../utils.js';

/**
 * @param {Theme} theme
 * @param {EffectiveTheme} [effectiveTheme]
 */
export async function syncTheme(theme, effectiveTheme) {
  if (
    !(await chrome.permissions.contains({
      permissions: ['cookies'],
      origins: [
        // 'https://console.aws.amazon.com/',
        'https://docs.aws.amazon.com/',
      ],
    }))
  ) {
    console.warn(
      'Unable to synchronize theme to the AWS Management Console. Permissions have not been granted.',
    );
    return;
  }

  const newCookieExpirationDate = Math.floor(getDateInFuture(180).getTime() / 1000);
  // const refreshCookieExpirationDate = getDateInFuture(50);

  // AWS Management Console

  // Broken!
  // The cookie is automatically overwritten by settingsByScope.userAccount.colorTheme.value from a network request:
  // https://us-west-2.ccs.console.api.aws/GetCallerSettings
  // Then the cookie value is written by JavaScript in awsc-head.js:
  // document.cookie = 'awsc-color-theme=dark;path=/;domain=.amazon.com;secure'
  // Going to just mark this part of the script as broken for the time being.

  // {
  //   // Normally AWS sets the expiration date to 10 days in the future (sometimes it uses a session cookie too???)
  //   // The possible values are: default, light, dark
  //   // This code sets the expiration date to 180 days in the future, and updates the cookie if it is due to expire in the next 50 days

  //   const value = theme === 'auto' ? 'default' : theme;
  //   const cookie = await chrome.cookies.get({
  //     name: 'awsc-color-theme',
  //     url: 'https://console.aws.amazon.com/',
  //   });
  //   console.debug('syncTheme: awsc-color-theme', cookie);

  //   if (
  //     !cookie ||
  //     value !== cookie.value ||
  //     cookie.expirationDate === undefined ||
  //     new Date(cookie.expirationDate * 1000) < refreshCookieExpirationDate
  //   ) {
  //     console.debug(
  //       'syncTheme: updated cookie',
  //       await chrome.cookies.set({
  //         url: 'https://global.console.aws.amazon.com/',
  //         domain: '.amazon.com',
  //         expirationDate: newCookieExpirationDate,
  //         httpOnly: false,
  //         secure: true,
  //         name: 'awsc-color-theme',
  //         path: '/',
  //         value,
  //       }),
  //       // await chrome.cookies.set({
  //       //   url: 'https://console.aws.amazon.com/',
  //       //   domain: '.amazon.com',
  //       //   expirationDate: newCookieExpirationDate,
  //       //   httpOnly: false,
  //       //   secure: true,
  //       //   name: 'awsc-color-theme',
  //       //   path: '/',
  //       //   value,
  //       // }),
  //       // // session cookie:
  //       // await chrome.cookies.set({
  //       //   url: 'https://console.aws.amazon.com/',
  //       //   domain: '.amazon.com',
  //       //   httpOnly: false,
  //       //   secure: true,
  //       //   name: 'awsc-color-theme',
  //       //   path: '/',
  //       //   value,
  //       // }),
  //     );
  //   }
  // }

  // Updates the theme on docs.aws.amazon.com:
  if (effectiveTheme) {
    // effectiveTheme may be undefined if the user has never saved the options. This should never happen in practice.
    // If the user changes their system theme (or it changes automatically based on the time of day) then the docs theme will be out of sync.

    const textTheme =
      effectiveTheme === 'dark'
        ? 'awsui-polaris-dark-mode'
        : 'awsdocs-theme-light';
    const textThemePreference = theme === 'auto' ? 'system' : theme;
    const codeTheme = effectiveTheme;

    // Cookie is a base64 encoded JSON blob, decoded example:
    // {"textTheme":"awsui-polaris-dark-mode","textThemePreference":"system","codeTheme":"light"}
    // const cookie = await chrome.cookies.get({
    //   name: 'dark-mode-settings',
    //   url: 'https://docs.aws.amazon.com/',
    // });
    // console.debug('syncTheme: dark-mode-settings', cookie);

    const darkModeSettings = { textTheme, textThemePreference, codeTheme };

    console.debug(
      'syncTheme: updated cookie',
      // This is a host-only cookie, which means that the domain property has to be omitted!
      await chrome.cookies.set({
        url: 'https://docs.aws.amazon.com/',
        expirationDate: newCookieExpirationDate,
        httpOnly: false,
        secure: false,
        name: 'dark-mode-settings',
        path: '/',
        value: btoa(JSON.stringify(darkModeSettings)),
      }),
    );
  }
}
