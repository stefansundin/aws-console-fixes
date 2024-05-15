// https://aws.amazon.com/podcasts/aws-podcast/

const timeCodeRegex = /\b\d?\d:\d\d\b/g;
const linkRegex = /\bhttps?:\/\/.+\b/g;

/**
 * @param {Element|Node|null|undefined} el
 * @returns {el is HTMLElement}
 */
function isHTMLElement(el) {
  return el?.nodeType === Node.ELEMENT_NODE;
}

async function main() {
  function check() {
    console.debug(`[aws-console-fixes] AwsPodcast checking`);

    const descriptionElements = document.getElementsByClassName('m-desc');
    for (const descriptionElement of descriptionElements) {
      if (!isHTMLElement(descriptionElement)) {
        continue;
      }
      if (descriptionElement.dataset.xAwsConsoleFixesAwsPodcast) {
        descriptionElement.dataset.xAwsConsoleFixesAwsPodcast = 'true';
        continue;
      }
      const text = descriptionElement.textContent;
      const audioElement =
        descriptionElement.parentElement?.getElementsByTagName('audio')[0];
      if (
        !text ||
        !audioElement ||
        descriptionElement.getElementsByTagName('a').length > 0
      ) {
        continue;
      }

      let match;
      while ((match = timeCodeRegex.exec(text))) {
        console.debug(`[aws-console-fixes] AwsPodcast match`, match[0]);
        const [minutesStr, secondsStr] = match[0].split(':');
        const seconds = Number(minutesStr) * 60 + Number(secondsStr);
        const link = document.createElement('a');
        link.role = 'button';
        link.style.cursor = 'pointer';
        link.textContent = match[0];
        link.addEventListener('click', () => {
          audioElement.currentTime = seconds;
          audioElement.play();
        });
        descriptionElement.appendChild(link);
        descriptionElement.appendChild(document.createTextNode(' '));
      }

      while ((match = linkRegex.exec(text))) {
        console.debug(`[aws-console-fixes] AwsPodcast match`, match[0]);
        const link = document.createElement('a');
        link.href = match[0];
        link.target = '_blank';
        link.textContent = match[0];
        descriptionElement.appendChild(link);
        descriptionElement.appendChild(document.createTextNode(' '));
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
