(function () {
  // Prevent double injection
  if (document.getElementById("focus-reader-overlay")) {
    return;
  }

  // Theme styles
  const themes = {
    light: {
      bg: "#ffffff",
      text: "#2c2c2c",
      link: "#1a5276",
      border: "#e8e8e8",
      codeBg: "#f5f5f5",
    },
    sepia: {
      bg: "#f4ecd8",
      text: "#5b4636",
      link: "#8b5e3c",
      border: "#e6dbbf",
      codeBg: "#ebe3cd",
    },
    dark: {
      bg: "#1a1a1a",
      text: "#d4d4d4",
      link: "#7eb8da",
      border: "#333333",
      codeBg: "#2a2a2a",
    },
  };

  let currentTheme = "light";
  let currentFontSize = 18;

  // Find the main article content
  function findArticleContent() {
    // Try common selectors first
    const selectors = [
      "article",
      '[role="main"]',
      ".article-body",
      ".article-content",
      ".post-content",
      ".post-body",
      ".entry-content",
      ".entry-body",
      ".story-body",
      ".article",
      ".post",
      ".entry",
      ".story",
      "#article",
      "#post",
      "#entry",
      "main",
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.querySelector("p") && el.innerText.length > 500) {
        return el;
      }
    }

    // Fallback: find the container with the most paragraphs
    let bestContainer = null;
    let maxParagraphs = 0;

    const candidates = document.querySelectorAll("div, section");
    candidates.forEach((candidate) => {
      const paragraphs = candidate.querySelectorAll("p");
      if (paragraphs.length > maxParagraphs && candidate.innerText.length > 500) {
        maxParagraphs = paragraphs.length;
        bestContainer = candidate;
      }
    });

    return bestContainer;
  }

  // Find the main title
  function findTitle() {
    const titleSelectors = [
      "h1",
      ".article-title",
      ".post-title",
      ".entry-title",
      ".story-title",
      "#article-title",
      "#post-title",
    ];

    for (const selector of titleSelectors) {
      const el = document.querySelector(selector);
      if (el && el.innerText.trim().length > 0) {
        return el.outerHTML;
      }
    }

    return "";
  }

  // Find the main image
  function findMainImage(container) {
    if (!container) return "";

    const img = container.querySelector("img");
    if (img && img.width > 300) {
      return `<img src="${img.src || img.dataset.src}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin-bottom:24px;">`;
    }

    return "";
  }

  // Clean up unwanted elements from the content
  function cleanContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Remove unwanted elements
    const unwantedSelectors = [
      "script",
      "style",
      "iframe",
      "noscript",
      "nav",
      ".ad",
      ".ads",
      ".advertisement",
      ".sidebar",
      ".comments",
      ".comment",
      ".social-share",
      ".share-buttons",
      ".related-posts",
      ".newsletter",
      ".cookie",
      ".popup",
      ".banner",
      ".sticky",
      ".widget",
      '[class*="ad-"]',
      '[class*="ads-"]',
      '[id*="ad-"]',
      '[id*="ads-"]',
    ];

    unwantedSelectors.forEach((selector) => {
      try {
        temp.querySelectorAll(selector).forEach((el) => el.remove());
      } catch (e) {
        // Ignore invalid selectors
      }
    });

    return temp.innerHTML;
  }

  // Apply theme to the overlay
  function applyTheme(themeName) {
    const overlay = document.getElementById("focus-reader-overlay");
    if (!overlay) return;

    const t = themes[themeName] || themes.light;
    overlay.style.background = t.bg;
    overlay.style.color = t.text;

    const content = overlay.querySelector(".focus-reader-content");
    if (content) {
      content.style.color = t.text;
      content.querySelectorAll("a").forEach((a) => {
        a.style.color = t.link;
      });
      content.querySelectorAll("blockquote").forEach((bq) => {
        bq.style.borderColor = t.border;
      });
      content.querySelectorAll("code, pre").forEach((code) => {
        code.style.background = t.codeBg;
      });
    }
  }

  // Apply font size to the overlay
  function applyFontSize(size) {
    const content = document.querySelector(".focus-reader-content");
    if (content) {
      content.style.fontSize = size + "px";
    }
  }

  // Build and show the reader overlay
  function activateReader() {
    const articleContainer = findArticleContent();
    if (!articleContainer) {
      console.warn("Focus Reader: Could not find article content.");
      return;
    }

    const titleHtml = findTitle();
    const mainImage = findMainImage(articleContainer);
    const cleanHtml = cleanContent(articleContainer.innerHTML);

    // Hide the original page
    const originalBody = document.body.cloneNode(true);
    originalBody.id = "focus-reader-original";
    originalBody.style.display = "none";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "focus-reader-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      z-index: 2147483647;
      background: ${themes[currentTheme].bg};
      color: ${themes[currentTheme].text};
      font-family: Georgia, 'Merriweather', 'Times New Roman', serif;
      line-height: 1.8;
    `;

    const t = themes[currentTheme];
    overlay.innerHTML = `
      <div class="focus-reader-content" style="
        max-width: 700px;
        margin: 0 auto;
        padding: 48px 24px 96px;
        font-size: ${currentFontSize}px;
        color: ${t.text};
      ">
        ${titleHtml ? `<div style="margin-bottom:24px;">${titleHtml}</div>` : ""}
        ${mainImage}
        <div class="focus-reader-body">${cleanHtml}</div>
      </div>
      <style>
        .focus-reader-content h1,
        .focus-reader-content h2,
        .focus-reader-content h3 {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.3;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .focus-reader-content h1 { font-size: 2em; }
        .focus-reader-content h2 { font-size: 1.6em; }
        .focus-reader-content h3 { font-size: 1.3em; }
        .focus-reader-content p {
          margin-bottom: 1.2em;
        }
        .focus-reader-content a {
          color: ${t.link};
          text-decoration: underline;
        }
        .focus-reader-content blockquote {
          border-left: 3px solid ${t.border};
          margin: 1.5em 0;
          padding: 0.5em 1em;
          font-style: italic;
        }
        .focus-reader-content code {
          background: ${t.codeBg};
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .focus-reader-content pre {
          background: ${t.codeBg};
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 0.9em;
          line-height: 1.5;
        }
        .focus-reader-content ul,
        .focus-reader-content ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }
        .focus-reader-content li {
          margin-bottom: 0.4em;
        }
        .focus-reader-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5em 0;
        }
        .focus-reader-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        .focus-reader-content th,
        .focus-reader-content td {
          border: 1px solid ${t.border};
          padding: 8px 12px;
          text-align: left;
        }
        .focus-reader-content hr {
          border: none;
          border-top: 1px solid ${t.border};
          margin: 2em 0;
        }
      </style>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
  }

  // Remove the reader overlay and restore the page
  function deactivateReader() {
    const overlay = document.getElementById("focus-reader-overlay");
    if (overlay) {
      overlay.remove();
    }
    document.body.style.overflow = "";
  }

  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "focus-reader-settings") {
      if (message.fontSize !== undefined) {
        currentFontSize = message.fontSize;
        applyFontSize(currentFontSize);
      }
      if (message.theme !== undefined) {
        currentTheme = message.theme;
        applyTheme(currentTheme);
      }
      sendResponse({ ok: true });
    } else if (message.type === "focus-reader-disable") {
      deactivateReader();
      sendResponse({ ok: true });
    }
  });

  // Activate the reader
  activateReader();
})();
