// For some reason, importing a type in one script (or this file) makes the import available to all scripts.
// This is causing these tsc errors:
// error TS2300: Duplicate identifier 'StorageData'.
//
// I haven't found a GitHub issue for this problem yet.
// A workaround is to just put these imports in this file until the bug is fixed.
// If "export {}" is present in the file then it isn't affected by this bug, but the script also cannot be loaded, so can't use that.

/**
 * @import { StorageData, Theme, EffectiveTheme } from '../types.js'
 */
