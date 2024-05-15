// Note: Besides the replacements defined here, the code also removes and "Amazon" or "AWS" prefixes.

/** @type Record<string, string> */
const textReplacements = {
  'Amazon Managed Blockchain': 'Blockchain',
  'Amazon MemoryDB for Redis': 'MemoryDB',
  'Amazon OpenSearch Service': 'OpenSearch',
  'Amazon Simple Email Service': 'SES',
  'Amazon Simple Notification Service': 'SNS',
  'AWS Health Dashboard': 'Health',
  'AWS Private Certificate Authority': 'Private CA',
  'Billing and Cost Management': 'Billing',
  'Console Home': 'Home',
  'Database Migration Service': 'DMS',
  'Elastic Beanstalk': 'Beanstalk',
  'Elastic Container Registry': 'ECR',
  'Elastic Container Service': 'ECS',
  'Elastic Kubernetes Service': 'EKS',
  'Key Management Service': 'KMS',
  'Red Hat OpenShift Service on AWS': 'OpenShift',
  'Simple Queue Service': 'SQS',
};

async function main() {
  /** @type {import('../utils.js')} */
  const { isHTMLElement } = await import(chrome.runtime.getURL('utils.js'));

  /** @type HTMLOListElement | null | undefined */
  let favoritesBar;

  function check() {
    if (!favoritesBar || !favoritesBar.isConnected) {
      return;
    }

    for (const node of favoritesBar.childNodes) {
      if (!isHTMLElement(node)) {
        continue;
      }
      const spanElement = node.getElementsByTagName('span')[0];
      if (
        spanElement.childNodes.length !== 1 ||
        spanElement.childNodes[0].nodeType !== Node.TEXT_NODE
      ) {
        continue;
      }
      const textNode = spanElement.childNodes[0];
      const text = textNode.textContent;
      if (!text) {
        continue;
      }
      const newText = textReplacements[text];
      if (newText) {
        textNode.textContent = newText;
      } else if (text.startsWith('Amazon ')) {
        textNode.textContent = text.substring('Amazon '.length);
      } else if (text.startsWith('AWS ')) {
        textNode.textContent = text.substring('AWS '.length);
      }
    }

    // If the favorites bar was long before the text replacements then a scroll arrow button was added, and performing the text replacements doesn't make the arrow go away, so send a resize event to make the AWS code react to the new width
    favoritesBar.dispatchEvent(new Event('resize', { bubbles: true }));
  }

  // First wait for the favorites bar element to be added to the page
  // Then add a different observer that watches for the favorites themselves to be added, and any mutations afterwards
  const documentObserver = new MutationObserver((mutations) => {
    checkForFavoritesBar();
  });
  if (!document.body.dataset.xAwsConsoleFixesNavbarFavoritesShorterNames) {
    document.body.dataset.xAwsConsoleFixesNavbarFavoritesShorterNames = 'true';
    documentObserver.observe(document.body, { childList: true, subtree: true });
  }

  function checkForFavoritesBar() {
    favoritesBar = /** @type HTMLOListElement | null */ (
      document.querySelector(
        'ol[data-rbd-droppable-id="global-nav-favorites-bar-list-edit-mode"]',
      )
    );

    if (!favoritesBar) {
      console.debug(
        `[aws-console-fixes] NavbarFavoritesShorterNames: Could not find the favorites bar DOM element.`,
      );
      return;
    }

    documentObserver.disconnect();
    const observer = new MutationObserver((mutations) => {
      // TODO: exclude our own mutations?? remove subtree?
      check();
    });
    observer.observe(favoritesBar, { childList: true, subtree: true });
  }

  checkForFavoritesBar();
}

main();
