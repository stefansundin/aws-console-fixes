/**
 * @typedef {'Shortcuts' | 'NavbarFavoritesShorterNames' | 'DismissAlerts' | 'HideNewAdverts' | 'HideSignInMarketing' | 'SignInDarkMode' | 'HideCustomerSatisfactionNotification' | 'HideMarketingChatbot' | 'HideAmazonQ' | 'SwitchRoleAccountID' | 'RememberSAMLRole' | 'AwsPodcast'} ContentScriptName
 * @typedef {'session' | 'local' | 'sync'} StorageAreaName
 * @typedef {'light' | 'dark'} EffectiveTheme
 * @typedef {EffectiveTheme | 'auto'} Theme
 */

/**
 * @typedef {Object} Options
 * @property {Theme} theme
 * @property {EffectiveTheme} [effectiveTheme]
 * @property {boolean} syncTheme
 * @property {ContentScriptName[]} enabledContentScripts
 */

/**
 * @typedef {Object} StorageData
 * @property {number} version
 * @property {Options} options
 * @property {Array<String>} dismissedAlerts
 * @property {Record<String, String>} samlRoles
 */

export {};
