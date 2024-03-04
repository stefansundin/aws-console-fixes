async function main() {
  /** @type {import('../utils.js')} */
  const { getPageDocuments } = await import(chrome.runtime.getURL('utils.js'));

  function check() {
    const buttons = /** @type HTMLButtonElement[] */ (
      getPageDocuments().flatMap((doc) =>
        Array.from(
          doc.querySelectorAll('button[data-analytics="askViewModal"]'),
        ),
      )
    );

    for (const button of buttons) {
      if (
        button.textContent?.trim().toLowerCase() ===
        'troubleshoot with amazon q'
      ) {
        button.remove();
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    check();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  check();
}

main();
