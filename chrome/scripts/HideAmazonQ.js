async function main() {
  /** @type {import('../utils.js')} */
  const { getPageDocuments } = await import(chrome.runtime.getURL('utils.js'));

  function check() {
    const documents = getPageDocuments();

    for (const body of documents.map((doc) => doc.body).filter(Boolean)) {
      if (!body.dataset.xAwsConsoleFixesHideAmazonQ) {
        body.dataset.xAwsConsoleFixesHideAmazonQ = 'true';
        const observer = new MutationObserver((mutations) => {
          check();
        });
        observer.observe(body, { childList: true, subtree: true });
      }
    }

    const buttons = /** @type {HTMLButtonElement[]} */ (
      documents.flatMap((doc) =>
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

  check();
}

main();
