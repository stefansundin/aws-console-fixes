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

    {
      const elements = /** @type {HTMLElement[]} */ (
        documents.flatMap((doc) =>
          Array.from(
            doc.querySelectorAll('button[aria-haspopup="dialog"],awsui-badge'),
          ),
        )
      );

      for (const el of elements) {
        // TODO: check non-english languages
        if (el.innerText?.trim().toLowerCase() === 'new') {
          el.remove();
        }
      }
    }

    {
      // These <span>s appear in the WAFv2 console and do not have any good CSS selectors on them :(
      const elements = /** @type {HTMLElement[]} */ (
        documents.flatMap((doc) => Array.from(doc.getElementsByTagName('span')))
      );

      for (const el of elements) {
        // TODO: check non-english languages
        if (
          el.className.includes('awsui_badge') &&
          el.innerText?.trim().toLowerCase() === 'new'
        ) {
          el.remove();
        }
      }
    }
  }

  check();
}

main();
