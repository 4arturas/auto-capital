const I18N = {
  en: {
    rows: 'Rows detected on page',
    csvDesc: 'Download as CSV file',
    copyDesc: 'Copy for Excel / Sheets (Ctrl+V)',
    mode_google_search: 'Mode: Search Results',
    mode_table: 'Mode: HTML Table',
    mode_list: 'Mode: List / Cards',
    mode_none: 'No structured data',
  },
  lt: {
    rows: 'Puslapyje rasta duomenų eilučių',
    csvDesc: 'Atsisiųsti CSV failą',
    copyDesc: 'Kopijuoti į Excel / Sheets (Ctrl+V)',
    mode_google_search: 'Režimas: Paieškos rezultatai',
    mode_table: 'Režimas: HTML lentelė',
    mode_list: 'Režimas: Sąrašas / Kortelės',
    mode_none: 'Struktūrizuotų duomenų nėra',
  },
  de: {
    rows: 'Erkannte Datenzeilen',
    csvDesc: 'Als CSV-Datei herunterladen',
    copyDesc: 'Für Excel / Sheets kopieren',
    mode_google_search: 'Modus: Suchergebnisse',
    mode_table: 'Modus: HTML-Tabelle',
    mode_list: 'Modus: Liste / Karten',
    mode_none: 'Keine Daten',
  },
  es: {
    rows: 'Filas de datos detectadas',
    csvDesc: 'Descargar archivo CSV',
    copyDesc: 'Copiar para Excel / Sheets',
    mode_google_search: 'Modo: Resultados de búsqueda',
    mode_table: 'Modo: Tabla HTML',
    mode_list: 'Modo: Lista / Tarjetas',
    mode_none: 'Sin datos',
  },
  fr: {
    rows: 'Lignes de données détectées',
    csvDesc: 'Télécharger le fichier CSV',
    copyDesc: 'Copier pour Excel / Sheets',
    mode_google_search: 'Mode : Résultats de recherche',
    mode_table: 'Mode : Tableau HTML',
    mode_list: 'Mode : Liste / Cartes',
    mode_none: 'Aucune donnée',
  },
  pl: {
    rows: 'Wykryte wiersze danych',
    csvDesc: 'Pobierz plik CSV',
    copyDesc: 'Kopiuj do Excel / Sheets',
    mode_google_search: 'Tryb: Wyniki wyszukiwania',
    mode_table: 'Tryb: Tabela HTML',
    mode_list: 'Tryb: Lista / Karty',
    mode_none: 'Brak danych',
  },
};

const MODE_SVGS = {
  google_search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/></svg>`,
  none: `<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`,
};

const COPY_SVG = `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`;
const CHECK_SVG = `<polyline points="20 6 9 17 4 12"/>`;

const langCode = (navigator.language || 'en').slice(0, 2).toLowerCase();
const t = I18N[langCode] || I18N.en;

const rowCountEl = document.getElementById('row-count');
const modeBadgeEl = document.getElementById('mode-badge');
const btnCsv = document.getElementById('btn-csv');
const btnCopy = document.getElementById('btn-copy');
const btnHelp = document.getElementById('btn-help');
const helpPanel = document.getElementById('help-panel');
const copyIcon = document.getElementById('copy-icon');

const helpRowsEl = document.getElementById('help-rows');
const helpCsvEl = document.getElementById('help-csv');
const helpCopyEl = document.getElementById('help-copy');
const helpModeEl = document.getElementById('help-mode');
const helpModeIconEl = document.getElementById('help-mode-icon');

helpRowsEl.textContent = t.rows;
helpCsvEl.textContent = t.csvDesc;
helpCopyEl.textContent = t.copyDesc;

let helpOpen = localStorage.getItem('easy_scraper_help') === '1';
function applyHelpState() {
  helpPanel.classList.toggle('visible', helpOpen);
  btnHelp.classList.toggle('active', helpOpen);
}
applyHelpState();

btnHelp.addEventListener('click', () => {
  helpOpen = !helpOpen;
  localStorage.setItem('easy_scraper_help', helpOpen ? '1' : '0');
  applyHelpState();
});

let extractedRows = [];

function toCsv(rows) {
  return rows
      .map(row =>
          row.map(cell => {
            const str = String(cell ?? '').replace(/"/g, '""');
            return /[",\n\r]/.test(str) ? `"${str}"` : str;
          }).join(',')
      )
      .join('\r\n');
}

function toTsv(rows) {
  return rows
      .map(row => row.map(cell => String(cell ?? '').replace(/[\t\r\n]+/g, ' ')).join('\t'))
      .join('\n');
}

async function scanActivePage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scraper-engine.js'],
    });

    const data = results?.[0]?.result;
    const type = data?.type || 'none';
    const modeLabel = t[`mode_${type}`] || t.mode_none;
    const modeSvg = MODE_SVGS[type] || MODE_SVGS.none;

    modeBadgeEl.innerHTML = modeSvg;
    helpModeIconEl.innerHTML = modeSvg;
    helpModeEl.textContent = modeLabel;

    if (data && Array.isArray(data.rows) && data.rows.length > 0) {
      extractedRows = data.rows;
      rowCountEl.textContent = extractedRows.length;
      btnCsv.disabled = false;
      btnCopy.disabled = false;
    } else {
      extractedRows = [];
      rowCountEl.textContent = '0';
      btnCsv.disabled = true;
      btnCopy.disabled = true;
    }
  } catch (_) {
    modeBadgeEl.innerHTML = MODE_SVGS.none;
    helpModeIconEl.innerHTML = MODE_SVGS.none;
    helpModeEl.textContent = t.mode_none;
    rowCountEl.textContent = '0';
    btnCsv.disabled = true;
    btnCopy.disabled = true;
  }
}

btnCsv.addEventListener('click', () => {
  if (!extractedRows.length) return;
  const csvContent = '\uFEFF' + toCsv(extractedRows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

  const a = document.createElement('a');
  a.href = url;
  a.download = `easy-scraper-${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

btnCopy.addEventListener('click', async () => {
  if (!extractedRows.length) return;
  await navigator.clipboard.writeText(toTsv(extractedRows));
  copyIcon.innerHTML = CHECK_SVG;
  copyIcon.style.stroke = '#10b981';

  setTimeout(() => {
    copyIcon.innerHTML = COPY_SVG;
    copyIcon.style.stroke = 'currentColor';
  }, 1200);
});

scanActivePage();
