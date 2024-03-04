async function main() {
  /** @type {import('../utils.js')} */
  const { getOptions } = await import(chrome.runtime.getURL('utils.js'));

  const options = await getOptions();
  if (!options.syncTheme) {
    return;
  }

  const themeMap = { light: 'dawn', dark: 'tomorrow_night_bright' };
  const possibleThemes = Object.values(themeMap);

  // This localStorage setting is used by the code editor in the S3 console, e.g. when editing the CORS rules
  const currentSetting = JSON.parse(localStorage['code_editor'] ?? '{}');
  const currentTheme = currentSetting?.preferences?.theme;
  if (currentTheme !== undefined && !possibleThemes.includes(currentTheme)) {
    // An unknown theme is in effect, so do nothing. This script needs updating!
    console.error(
      `[aws-console-fixes] S3SyncTheme: Unknown code_editor theme: ${currentTheme}`,
    );
    return;
  }

  const desiredTheme =
    themeMap[
      options.theme === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : options.theme
    ];
  if (currentTheme === desiredTheme) {
    // Update not necessary
    return;
  }

  if (!currentSetting.preferences) {
    currentSetting.preferences = {};
  }
  currentSetting.preferences.theme = desiredTheme;

  console.debug(
    `[aws-console-fixes] S3SyncTheme: Updating localStorage code_editor key from ${
      localStorage['code_editor']
    } to ${JSON.stringify(currentSetting)}`,
  );
  localStorage['code_editor'] = JSON.stringify(currentSetting);
}

main();
