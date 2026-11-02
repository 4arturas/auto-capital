(function() {
  function cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  // --- 1. Google Search organic results (Anchor-outwards resilient approach) ---
  function isGoogleSearch() {
    return /google\.[a-z.]+\/search/i.test(window.location.href);
  }

  function extractGoogleSearch() {
    const rows = [['Title', 'URL', 'Description']];
    const seenUrls = new Set();

    // Find all H3 headings inside #search or #rso (main results area)
    const searchRoot = document.querySelector('#rso, #search') || document.body;
    const headings = searchRoot.querySelectorAll('h3');

    headings.forEach(h3 => {
      const title = cleanText(h3.textContent);
      if (!title) return;

      // In Google Search, <a> wraps <h3> (so h3.closest('a') finds it), or <a> is inside/adjacent
      const linkEl = h3.closest('a[href]') || h3.parentElement?.querySelector('a[href]') || h3.querySelector('a[href]');
      if (!linkEl) return;

      const rawHref = linkEl.getAttribute('href') || linkEl.href || '';
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;

      // Resolve relative URLs if needed
      let url = rawHref;
      try {
        url = new URL(rawHref, window.location.origin).href;
      } catch (_) {}

      // Skip internal Google search navigation links
      if (/google\.[a-z.]+\/search/i.test(url)) return;
      if (seenUrls.has(url)) return;
      seenUrls.add(url);

      // Walk up to the result card container to extract description snippet
      const card =
          h3.closest('div.MjjYbeb, div.g, div[data-hveid], div.tF2Cxc, div.srKDX') ||
          linkEl.parentElement?.parentElement?.parentElement;

      let description = '';
      if (card) {
        const descEl = card.querySelector('.VwiC3b, .yXK7lf, [data-sncf="1"], [data-sncf], .MUxGbd, .ITZIwc');
        if (descEl) {
          description = cleanText(descEl.textContent);
        } else {
          // Fallback: take card text minus title and link URL text
          const clone = card.cloneNode(true);
          clone.querySelectorAll('h3, cite, script, style, svg, button').forEach(el => el.remove());
          description = cleanText(clone.textContent).slice(0, 350);
        }
      }

      rows.push([title, url, description]);
    });

    return rows.length > 1 ? rows : null;
  }

  // --- 2. Standard table extraction (Wikipedia, Yahoo Finance, etc.) ---
  function extractTables() {
    // Skip tiny layout tables (like Google's top sitelinks or footer pagination)
    const tables = Array.from(document.querySelectorAll('table')).filter(t => {
      const trs = t.querySelectorAll('tr');
      return trs.length >= 3 && t.offsetHeight > 0;
    });

    const allRows = [];
    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      rows.forEach(tr => {
        const cells = tr.querySelectorAll('td, th');
        const row = [];
        cells.forEach(cell => {
          row.push(cleanText(cell.textContent));
        });
        if (row.some(cell => cell.length > 0)) {
          allRows.push(row);
        }
      });
    });

    return allRows;
  }

  // --- 3. General repeating list fallback (e-commerce, directories, blogs) ---
  function detectRepeatingContainers() {
    const selectors = [
      '.product-card', '.item-card', '.result-item', '.search-result',
      'article', '.card', '.list-item', '.entry', '.post',
      '[class*="product-"]', '[class*="item-"]', '[class*="card-"]'
    ];

    for (const selector of selectors) {
      const elements = Array.from(document.querySelectorAll(selector)).filter(el => el.offsetHeight > 0);
      if (elements.length >= 3) {
        return elements;
      }
    }

    const lists = document.querySelectorAll('ul, ol');
    for (const list of lists) {
      const items = Array.from(list.querySelectorAll(':scope > li')).filter(el => el.offsetHeight > 0);
      if (items.length >= 4) {
        return items;
      }
    }

    return null;
  }

  function extractFromContainers(containers) {
    const rows = [['Title', 'Link', 'Details']];
    containers.forEach(container => {
      const headerEl = container.querySelector('h1, h2, h3, h4, h5, h6');
      const linkEl = (headerEl && (headerEl.closest('a[href]') || headerEl.querySelector('a[href]'))) || container.querySelector('a[href]');
      const title = headerEl ? cleanText(headerEl.textContent) : cleanText(linkEl?.textContent || '');

      let link = '';
      if (linkEl) {
        try {
          link = new URL(linkEl.getAttribute('href'), window.location.origin).href;
        } catch (_) {
          link = cleanText(linkEl.getAttribute('href') || '');
        }
      }

      const detailsParts = [];
      const priceMatch = container.textContent.match(/(?:\$|€|£)\s*[\d,]+(?:\.\d{2})?|[\d,]+[.,]\d{2}\s*(?:€|\$|£)/);
      if (priceMatch) detailsParts.push(cleanText(priceMatch[0]));

      const descEl = container.querySelector('p, .description, .details');
      if (descEl && (!headerEl || !headerEl.contains(descEl))) {
        const descText = cleanText(descEl.textContent);
        if (descText && !detailsParts.includes(descText)) {
          detailsParts.push(descText);
        }
      }

      if (title || link) {
        rows.push([title, link, detailsParts.join(' | ')]);
      }
    });
    return rows.length > 1 ? rows : [];
  }

  // --- Dispatch: Google Search -> Tables -> Repeating Lists ---
  if (isGoogleSearch()) {
    const googleRows = extractGoogleSearch();
    if (googleRows && googleRows.length > 1) {
      return { type: 'google_search', rows: googleRows };
    }
  }

  const tableRows = extractTables();
  if (tableRows.length > 0) {
    return { type: 'table', rows: tableRows };
  }

  const containers = detectRepeatingContainers();
  if (containers) {
    const listRows = extractFromContainers(containers);
    if (listRows.length > 1) {
      return { type: 'list', rows: listRows };
    }
  }

  return { type: 'none', rows: [] };
})();