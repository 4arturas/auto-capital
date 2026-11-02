(function () {
  "use strict";

  const PREFIX = "[Gmail Trimless]";
  const MARKER = "data-auto-clicked";

  /**
   * Selectors for Gmail's "Show trimmed content" button.
   * Covers known selectors and the aria-label attribute.
   */
  const SELECTORS = [
    '[aria-label="Show trimmed content"]',
    ".adL",
    ".ajT"
  ].join(", ");

  function expandTrimmedButtons() {
    const buttons = document.querySelectorAll(SELECTORS);
    let expanded = 0;

    buttons.forEach(function (btn) {
      if (btn.hasAttribute(MARKER)) {
        return;
      }

      if (!btn.offsetParent) {
        return;
      }

      btn.click();
      btn.setAttribute(MARKER, "true");
      expanded++;
    });

    if (expanded > 0) {
      console.log(`${PREFIX} Expanded ${expanded} trimmed section(s).`);
    }
  }

  /**
   * Periodic check as a fallback for edge cases MutationObserver might miss
   * (e.g., rapid DOM changes during Gmail's internal rendering).
   */
  setInterval(expandTrimmedButtons, 2000);

  /**
   * Watch for DOM changes since Gmail is a SPA where emails load on-the-fly.
   */
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        expandTrimmedButtons();
        return;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log(`${PREFIX} Observer started. Watching for trimmed content…`);

  /**
   * Run an initial check in case buttons are already present on page load.
   */
  expandTrimmedButtons();
})();
