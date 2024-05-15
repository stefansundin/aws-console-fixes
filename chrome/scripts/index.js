/**
 * @import { ContentScriptName } from '../types.js'
 */

/** @type Record<ContentScriptName, chrome.scripting.RegisteredContentScript> */
export const availableContentScripts = {
  S3SyncTheme: {
    id: 'S3SyncTheme',
    js: ['scripts/S3SyncTheme.js'],
    matches: ['https://s3.console.aws.amazon.com/*'],
    runAt: 'document_start',
  },

  Shortcuts: {
    id: 'Shortcuts',
    js: ['scripts/Shortcuts.js'],
    css: ['scripts/Shortcuts.css'],
    matches: ['https://*.console.aws.amazon.com/*'],
    runAt: 'document_end',
  },

  NavbarFavoritesShorterNames: {
    id: 'NavbarFavoritesShorterNames',
    js: ['scripts/NavbarFavoritesShorterNames.js'],
    matches: ['https://*.console.aws.amazon.com/*'],
    runAt: 'document_end',
  },

  DismissAlerts: {
    id: 'DismissAlerts',
    js: ['scripts/DismissAlerts.js'],
    matches: [
      'https://*.console.aws.amazon.com/*',
      'https://health.aws.amazon.com/*',
    ],
    runAt: 'document_end',
  },

  HideNewAdverts: {
    id: 'HideNewAdverts',
    js: ['scripts/HideNewAdverts.js'],
    matches: ['https://*.console.aws.amazon.com/*'],
    runAt: 'document_end',
  },

  HideSignInMarketing: {
    id: 'HideSignInMarketing',
    css: ['scripts/HideSignInMarketing.css'],
    matches: [
      'https://*.signin.aws.amazon.com/signin*',
      'https://*.signin.aws.amazon.com/oauth*',
    ],
    runAt: 'document_start',
  },

  SignInDarkMode: {
    id: 'SignInDarkMode',
    css: ['scripts/SignInDarkMode.css'],
    matches: [
      'https://*.signin.aws.amazon.com/signin*',
      'https://*.signin.aws.amazon.com/oauth*',
    ],
    runAt: 'document_start',
  },

  HideCustomerSatisfactionNotification: {
    id: 'HideCustomerSatisfactionNotification',
    css: ['scripts/HideCustomerSatisfactionNotification.css'],
    matches: ['https://*.console.aws.amazon.com/*'],
    runAt: 'document_start',
  },

  HideMarketingChatbot: {
    id: 'HideMarketingChatbot',
    css: ['scripts/HideMarketingChatbot.css'],
    matches: ['https://aws.amazon.com/*', 'https://calculator.aws/*'],
    runAt: 'document_start',
  },

  HideAmazonQ: {
    id: 'HideAmazonQ',
    css: ['scripts/HideAmazonQ.css'],
    js: ['scripts/HideAmazonQ.js'],
    matches: [
      'https://*.console.aws.amazon.com/*',
      'https://docs.aws.amazon.com/*',
    ],
    runAt: 'document_end',
  },

  SwitchRoleAccountID: {
    id: 'SwitchRoleAccountID',
    js: ['scripts/SwitchRoleAccountID.js'],
    matches: ['https://*.signin.aws.amazon.com/switchrole*'],
    runAt: 'document_end',
  },
};
