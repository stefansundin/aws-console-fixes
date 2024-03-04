async function main() {
  /** @type {import('../utils.js')} */
  const { getPageDocuments } = await import(chrome.runtime.getURL('utils.js'));

  function check() {
    const elements = /** @type HTMLButtonElement[] */ (
      getPageDocuments().flatMap((doc) =>
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

  const observer = new MutationObserver((mutations) => {
    check();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  check();
}

main();
