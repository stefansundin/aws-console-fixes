async function main() {
  /** @type {import('../utils.js')} */
  const { isHTMLElement } = await import(chrome.runtime.getURL('utils.js'));

  // Global shortcuts
  // This may need improvements for non-English keyboard layouts
  document.body.addEventListener('keydown', (e) => {
    console.debug(`[aws-console-fixes] Navbar keydown: ${e.key}`);

    const target = /** @type Element */ (e.target);
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Press 1-9 and 0 (0 is 10) to focus your favorite shortcuts.
    // Does not automatically navigate so you have to press the Enter key afterwards.
    let i = parseInt(e.key, 10);
    if (!isNaN(i)) {
      if (i === 0) {
        i = 10;
      }
      const favoritesBar = document.querySelector(
        'ol[data-rbd-droppable-id="global-nav-favorites-bar-list-edit-mode"]',
      );
      if (!favoritesBar) {
        console.debug(
          `[aws-console-fixes] Navbar: Could not find the favorites bar DOM element.`,
        );
        return;
      }
      const a = favoritesBar.getElementsByTagName('a')[i - 1];
      if (!a) {
        console.debug(
          `[aws-console-fixes] Navbar: Could not find element ${i} in the favorites bar.`,
        );
        return;
      }
      a.focus();
      return;
    }

    // Press ` to open the services dropdown
    // Press - to open the region dropdown
    // Press = to open the user dropdown
    const selector =
      e.key === '`'
        ? 'services'
        : e.key === '-'
        ? 'regions'
        : e.key === '='
        ? 'account'
        : undefined;
    if (selector) {
      const menu = document.querySelector(
        `button[aria-controls="menu--${selector}"]`,
      );
      if (!isHTMLElement(menu)) {
        console.debug(
          `[aws-console-fixes] Navbar: menu is not an HTML element?`,
          menu,
        );
        return;
      }
      const dropdown = menu.nextElementSibling;
      if (!isHTMLElement(dropdown)) {
        console.debug(
          `[aws-console-fixes] Navbar: dropdown is not an HTML element?`,
          dropdown,
        );
        return;
      }
      const visible = dropdown.style.display === 'block';
      menu.click();
      if (!visible) {
        const a = dropdown.querySelector('a, button');
        // console.log('a', a);
        // console.log('dropdown', dropdown);
        if (a) {
          setTimeout(function () {
            dropdown.focus();
            // a.focus();
          }, 10);
        }
      }
      return;
    }
  });
}

main();