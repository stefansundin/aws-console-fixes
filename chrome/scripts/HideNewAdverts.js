async function main() {
  /** @type {import('../utils.js')} */
  const { getPageDocuments } = await import(chrome.runtime.getURL('utils.js'));

  function check() {
    const documents = getPageDocuments();

    for (const body of documents.map((doc) => doc.body).filter(Boolean)) {
      if (!body.dataset.xAwsConsoleFixesHideNewAdverts) {
        body.dataset.xAwsConsoleFixesHideNewAdverts = 'true';
        const observer = new MutationObserver((mutations) => {
          check();
        });
        observer.observe(body, { childList: true, subtree: true });
      }
    }

    const elements = /** @type HTMLButtonElement[] */ (
      documents.flatMap((doc) =>
        Array.from(doc.querySelectorAll('button[aria-haspopup="dialog"]')),
      )
    );

    for (const el of elements) {
      // TODO: check non-english languages
      if (el.innerText?.trim().toLowerCase() === 'new') {
        el.remove();
      }
    }
  }

  check();
}

main();
