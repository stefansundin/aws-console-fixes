async function main() {
  /** @type {import('../utils.js')} */
  const { getStorage, getPageDocuments } = await import(
    chrome.runtime.getURL('utils.js')
  );

  const storage = await getStorage();
  const { dismissedAlerts } = await storage.get({ dismissedAlerts: [] });
  console.log('[aws-console-fixes]', { dismissedAlerts });

  function checkForAlerts() {
    console.log(
      '[aws-console-fixes] DismissAlerts checkForAlerts',
      document.location.href,
      document.body,
    );

    const elements = /** @type HTMLDivElement[] */ (
      getPageDocuments().flatMap((doc) =>
        Array.from(
          doc.querySelectorAll(
            'div[data-analytics-flashbar="info"], div.awsui-flash-type-info, div.awsui-alert-type-info',
          ),
        ),
      )
    );

    if (elements.length > 0) {
      console.debug(`[aws-console-fixes] DismissAlerts elements`, elements);
    }
    for (const el of elements) {
      if (el.dataset.xAwsConsoleFixesAlertProcessed || !el.textContent) {
        continue;
      }
      el.dataset.xAwsConsoleFixesAlertProcessed = 'true';

      const button = Array.from(el.querySelectorAll('button')).at(-1);
      if (!button || button.textContent?.trim() !== '') {
        console.debug(
          `[aws-console-fixes] DismissAlerts can't find notification close button`,
          el,
        );
        continue;
      }
      if (button.dataset.xAwsConsoleFixesAlertProcessed) {
        continue;
      }
      button.dataset.xAwsConsoleFixesAlertProcessed = 'true';
      console.debug('[aws-console-fixes] DismissAlerts button:', button);

      const text = el.textContent.trim(); // maybe use innerText?
      console.debug('[aws-console-fixes] DismissAlerts text:', text);

      if (dismissedAlerts.includes(text)) {
        console.debug('[aws-console-fixes] DismissAlerts auto dismissed:', el);
        el.remove();
        // Instead of removing the element, maybe click the dismiss button instead?
        continue;
      }

      if (button.title) {
        button.title += ' (aws-console-fixes tweaked)';
      } else {
        button.title = 'aws-console-fixes tweaked';
      }
      button.addEventListener('click', (e) => {
        console.debug(
          '[aws-console-fixes] DismissAlerts button click:',
          e.target,
        );
        if (confirm('[aws-console-fixes] Dismiss this alert permanently?')) {
          // Make sure we operate on fresh data:
          storage
            .get({ dismissedAlerts: [] })
            .then(async ({ dismissedAlerts }) => {
              dismissedAlerts.push(text);
              await storage.set({ dismissedAlerts });
            });
        }
      });
    }
  }

  const observer = new MutationObserver((mutations) => {
    checkForAlerts();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  checkForAlerts();
}

main();
