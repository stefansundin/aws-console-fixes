// https://aws.amazon.com/podcasts/aws-podcast/

const regex = /\b(\d?\d:\d\d|https?:\/\/.+)\b/;

/**
 * @param {Element|Node|null|undefined} el
 * @returns {el is HTMLElement}
 */
function isHTMLElement(el) {
  return el?.nodeType === Node.ELEMENT_NODE;
}

/**
 * @param {Element|Node|null|undefined} el
 * @returns {el is Text}
 */
function isTextNode(el) {
  return el?.nodeType === Node.TEXT_NODE;
}

async function main() {
  function check() {
    console.debug(`[aws-console-fixes] AwsPodcast checking`);

    const descriptionElements = document.getElementsByClassName('m-desc');
    for (const descriptionElement of descriptionElements) {
      console.debug(`[aws-console-fixes] AwsPodcast card`, descriptionElement);
      if (
        !isHTMLElement(descriptionElement) ||
        descriptionElement.dataset.xAwsConsoleFixesAwsPodcast
      ) {
        continue;
      }
      descriptionElement.dataset.xAwsConsoleFixesAwsPodcast = 'true';

      const audioElement =
        descriptionElement.parentElement?.getElementsByTagName('audio')[0];
      if (
        !audioElement ||
        descriptionElement.getElementsByTagName('a').length > 0
      ) {
        continue;
      }

      /** @type {Text[]} */
      const textNodes = [];
      // Some shownotes have multiple <p></p> elements and even <br> elements, so we need to use a tree walker to just get all the text nodes
      // https://aws.amazon.com/podcasts/aws-podcast/666_aws_news_updates_may_6_2024/
      const treeWalker = document.createTreeWalker(
        descriptionElement,
        NodeFilter.SHOW_TEXT,
      );
      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        if (
          isTextNode(node) &&
          node.textContent &&
          node.textContent.trim().length > 0
        ) {
          textNodes.push(node);
        }
      }

      while (textNodes.length > 0) {
        let textNode = textNodes.pop();
        if (!textNode) {
          break;
        }

        let match;
        while (
          textNode.textContent &&
          (match = regex.exec(textNode.textContent))
        ) {
          console.debug(`[aws-console-fixes] AwsPodcast match`, match[0]);

          const link = document.createElement('a');
          link.textContent = match[0];
          if (match[0].startsWith('http')) {
            link.href = match[0];
            link.target = '_blank';
          } else {
            const [minutesStr, secondsStr] = match[0].split(':');
            const seconds = Number(minutesStr) * 60 + Number(secondsStr);
            link.role = 'button';
            link.style.cursor = 'pointer';
            link.addEventListener('click', () => {
              audioElement.currentTime = seconds;
              audioElement.play();
            });
          }

          textNode = textNode.splitText(match.index);
          textNode = textNode.splitText(match[0].length);
          const middleNode = /** @type {Text} */ (textNode.previousSibling);
          middleNode.parentNode?.replaceChild(link, middleNode);
        }
      }
    }
  }

  if (!document.body.dataset.xAwsConsoleFixesAwsPodcast) {
    document.body.dataset.xAwsConsoleFixesAwsPodcast = 'true';
    const observer = new MutationObserver((mutations) => {
      check();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    check();
  }
}

main();
