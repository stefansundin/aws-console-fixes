async function main() {
  /** @type {import('../utils.js')} */
  const { getStorage, getPageDocuments } = await import(
    chrome.runtime.getURL('utils.js')
  );

  const storage = await getStorage();
  const { dismissedAlerts } = await storage.get({ dismissedAlerts: [] });
  console.debug('[aws-console-fixes]', { dismissedAlerts });

  function check() {
    console.debug('[aws-console-fixes] DismissAlerts check');

    const documents = getPageDocuments();

    for (const body of documents.map((doc) => doc.body).filter(Boolean)) {
      if (!body.dataset.xAwsConsoleFixesDismissAlerts) {
        body.dataset.xAwsConsoleFixesDismissAlerts = 'true';
        const observer = new MutationObserver((mutations) => {
          check();
        });
        observer.observe(body, { childList: true, subtree: true });
      }
    }

    const elements = /** @type {HTMLDivElement[]} */ (
      documents.flatMap((doc) =>
        Array.from(
          doc.querySelectorAll(
            'div[data-analytics-flashbar="info"], div[data-analytics-alert="info"], div.awsui-flash-type-info, div.awsui-alert-type-info',
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
        if (!confirm('[aws-console-fixes] Dismiss this alert permanently?')) {
          return;
        }
        // Make sure we operate on fresh data:
        storage
          .get({ dismissedAlerts: [] })
          .then(async ({ dismissedAlerts }) => {
            if (dismissedAlerts.includes(text)) {
              return;
            }
            dismissedAlerts.push(text);
            await storage.set({ dismissedAlerts });
          });
      });
    }
  }

  check();
}

main();
