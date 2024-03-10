/**
 * @typedef {'Navbar' | 'DismissAlerts' | 'HideNewAdverts' | 'HideSignInMarketing' | 'HideCustomerSatisfactionNotification' | 'HideMarketingChatbot' | 'HideAmazonQ' | 'S3SyncTheme'} ContentScriptName
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
