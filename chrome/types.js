/**
 * @typedef {'Shortcuts' | 'DismissAlerts' | 'HideNewAdverts' | 'HideSignInMarketing' | 'SignInDarkMode' | 'HideCustomerSatisfactionNotification' | 'HideMarketingChatbot' | 'HideAmazonQ' | 'SwitchRoleAccountID' | 'S3SyncTheme'} ContentScriptName
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

export {};
