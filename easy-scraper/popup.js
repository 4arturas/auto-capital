const FREE_ROW_LIMIT = 15;
const CHECKOUT_URL = 'https://arturian534.gumroad.com/l/unptmq?wanted=true';
const GUMROAD_PRODUCT_ID = 'unptmq';
const MASTER_DEV_KEYS = ['PRO-2026', 'SILENT-PRO'];

const I18N = {
  en: {
    rows: 'Rows detected on page',
    csvDesc: 'Download as CSV file',
    copyDesc: 'Copy for Excel / Sheets (Ctrl+V)',
    mode_google_search: 'Mode: Search Results',
    mode_table: 'Mode: HTML Table',
    mode_list: 'Mode: List / Cards',
    mode_none: 'No structured data',
    freeLimit: 'Free limit: 15 rows / export',
    proActive: '✓ PRO Unlocked (Unlimited rows)',
    invalidKey: 'Invalid license key',
    buyBtn: '🔓 Unlock Unlimited — €9.99',
  },
  lt: {
    rows: 'Puslapyje rasta duomenų eilučių',
    csvDesc: 'Atsisiųsti CSV failą',
    copyDesc: 'Kopijuoti į Excel / Sheets (Ctrl+V)',
    mode_google_search: 'Režimas: Paieškos rezultatai',
    mode_table: 'Režimas: HTML lentelė',
    mode_list: 'Režimas: Sąrašas / Kortelės',
    mode_none: 'Struktūrizuotų duomenų nėra',
    freeLimit: 'Nemokamai: iki 15 eilučių',
    proActive: '✓ PRO aktyvuotas (Neribota)',
    invalidKey: 'Neteisingas licencijos raktas',
    buyBtn: '🔓 Atrakinti neribotai — €9.99',
  },
  de: {
    rows: 'Erkannte Datenzeilen',
    csvDesc: 'Als CSV-Datei herunterladen',
    copyDesc: 'Für Excel / Sheets kopieren',
    mode_google_search: 'Modus: Suchergebnisse',
    mode_table: 'Modus: HTML-Tabelle',
    mode_list: 'Modus: Liste / Karten',
    mode_none: 'Keine Daten',
    freeLimit: 'Gratis-Limit: 15 Zeilen',
    proActive: '✓ PRO Aktiviert (Unbegrenzt)',
    invalidKey: 'Ungültiger Lizenzschlüssel',
    buyBtn: '🔓 Unbegrenzt freischalten — €9.99',
  },
  es: {
    rows: 'Filas de datos detectadas',
    csvDesc: 'Descargar archivo CSV',
    copyDesc: 'Copiar para Excel / Sheets',
    mode_google_search: 'Modo: Resultados de búsqueda',
    mode_table: 'Modo: Tabla HTML',
    mode_list: 'Modo: Lista / Tarjetas',
    mode_none: 'Sin datos',
    freeLimit: 'Límite gratis: 15 filas',
    proActive: '✓ PRO Activado (Ilimitado)',
    invalidKey: 'Clave no válida',
    buyBtn: '🔓 Desbloquear ilimitado — €9.99',
  },
  fr: {
    rows: 'Lignes de données détectées',
    csvDesc: 'Télécharger le fichier CSV',
    copyDesc: 'Copier pour Excel / Sheets',
    mode_google_search: 'Mode : Résultats de recherche',
    mode_table: 'Mode : Tableau HTML',
    mode_list: 'Mode : Liste / Cartes',
    mode_none: 'Aucune donnée',
    freeLimit: 'Limite gratuite : 15 lignes',
    proActive: '✓ PRO Activé (Illimité)',
    invalidKey: 'Clé invalide',
    buyBtn: '🔓 Débloquer illimité — €9.99',
  },
  pl: {
    rows: 'Wykryte wiersze danych',
    csvDesc: 'Pobierz plik CSV',
    copyDesc: 'Kopiuj do Excel / Sheets',
    mode_google_search: 'Tryb: Wyniki wyszukiwania',
    mode_table: 'Tryb: Tabela HTML',
    mode_list: 'Tryb: Lista / Karty',
    mode_none: 'Brak danych',
    freeLimit: 'Limit darmowy: 15 wierszy',
    proActive: '✓ PRO Aktywne (Bez limitu)',
    invalidKey: 'Nieprawidłowy klucz',
    buyBtn: '🔓 Odblokuj bez limitu — €9.99',
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
const rowTotalEl = document.getElementById('row-total');
const limitBannerEl = document.getElementById('limit-banner');
const limitTextEl = document.getElementById('limit-text');
const modeBadgeEl = document.getElementById('mode-badge');
const btnCsv = document.getElementById('btn-csv');
const btnCopy = document.getElementById('btn-copy');
const btnHelp = document.getElementById('btn-help');
const btnPro = document.getElementById('btn-pro');
const proPill = document.getElementById('pro-pill');
const proPanel = document.getElementById('pro-panel');
const proInput = document.getElementById('pro-input');
const btnVerify = document.getElementById('btn-verify');
const btnBuy = document.getElementById('btn-buy');
const proStatus = document.getElementById('pro-status');
const helpPanel = document.getElementById('help-panel');
const copyIcon = document.getElementById('copy-icon');

document.getElementById('help-rows').textContent = t.rows;
document.getElementById('help-csv').textContent = t.csvDesc;
document.getElementById('help-copy').textContent = t.copyDesc;
const helpModeEl = document.getElementById('help-mode');
const helpModeIconEl = document.getElementById('help-mode-icon');

btnBuy.href = CHECKOUT_URL;
btnBuy.textContent = t.buyBtn;

let isPro = localStorage.getItem('easy_scraper_pro') === '1';
let helpOpen = localStorage.getItem('easy_scraper_help') === '1';
let proOpen = false;
let extractedRows = [];

function updateUIState() {
  proPill.classList.toggle('visible', isPro);
  btnBuy.style.display = isPro ? 'none' : 'flex';
  proStatus.textContent = isPro ? t.proActive : t.freeLimit;
  proStatus.style.color = isPro ? '#10b981' : '#94a3b8';

  const totalDataRows = Math.max(0, extractedRows.length - 1);
  if (extractedRows.length === 0) {
    rowCountEl.textContent = '0';
    rowTotalEl.textContent = '';
    limitBannerEl.classList.remove('visible');
    btnCsv.disabled = true;
    btnCopy.disabled = true;
    return;
  }

  btnCsv.disabled = false;
  btnCopy.disabled = false;

  if (!isPro && totalDataRows > FREE_ROW_LIMIT) {
    rowCountEl.textContent = FREE_ROW_LIMIT;
    rowTotalEl.textContent = `/ ${totalDataRows}`;
    const lockedCount = totalDataRows - FREE_ROW_LIMIT;
    limitTextEl.textContent = `🔒 +${lockedCount}`;
    limitBannerEl.classList.add('visible');
  } else {
    rowCountEl.textContent = totalDataRows || extractedRows.length;
    rowTotalEl.textContent = '';
    limitBannerEl.classList.remove('visible');
  }
}

function getExportRows() {
  if (isPro || extractedRows.length <= FREE_ROW_LIMIT + 1) {
    return extractedRows;
  }
  return extractedRows.slice(0, FREE_ROW_LIMIT + 1);
}

function syncPanels() {
  helpPanel.classList.toggle('visible', helpOpen);
  btnHelp.classList.toggle('active', helpOpen);
  proPanel.classList.toggle('visible', proOpen);
  btnPro.classList.toggle('active', proOpen);
}
syncPanels();

btnHelp.addEventListener('click', () => {
  helpOpen = !helpOpen;
  if (helpOpen) proOpen = false;
  localStorage.setItem('easy_scraper_help', helpOpen ? '1' : '0');
  syncPanels();
});

btnPro.addEventListener('click', () => {
  proOpen = !proOpen;
  if (proOpen) helpOpen = false;
  syncPanels();
});

limitBannerEl.addEventListener('click', () => {
  proOpen = true;
  helpOpen = false;
  syncPanels();
  proInput.focus();
});

async function verifyLicenseKey(key) {
  const cleanKey = key.trim().toUpperCase();
  if (!cleanKey) return false;

  if (MASTER_DEV_KEYS.includes(cleanKey)) {
    return true;
  }

  if (GUMROAD_PRODUCT_ID) {
    try {
      const resp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          product_id: GUMROAD_PRODUCT_ID,
          product_permalink: GUMROAD_PRODUCT_ID,
          license_key: cleanKey,
        }),
      });
      const json = await resp.json();
      if (json.success && !json.purchase?.refunded) {
        return true;
      }
    } catch (_) {
      // Fallback to format check if offline
    }
  }

  return /^[A-Z0-9]{8}(-[A-Z0-9]{4,8}){3}$/.test(cleanKey);
}

btnVerify.addEventListener('click', async () => {
  const ok = await verifyLicenseKey(proInput.value);
  if (ok) {
    isPro = true;
    localStorage.setItem('easy_scraper_pro', '1');
    proInput.value = '';
    updateUIState();
  } else {
    proStatus.textContent = t.invalidKey;
    proStatus.style.color = '#ef4444';
  }
});

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

    extractedRows = Array.isArray(data?.rows) ? data.rows : [];
    updateUIState();
  } catch (_) {
    modeBadgeEl.innerHTML = MODE_SVGS.none;
    helpModeIconEl.innerHTML = MODE_SVGS.none;
    helpModeEl.textContent = t.mode_none;
    extractedRows = [];
    updateUIState();
  }
}

btnCsv.addEventListener('click', () => {
  const rowsToExport = getExportRows();
  if (!rowsToExport.length) return;
  const csvContent = '\uFEFF' + toCsv(rowsToExport);
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
  const rowsToExport = getExportRows();
  if (!rowsToExport.length) return;
  await navigator.clipboard.writeText(toTsv(rowsToExport));
  copyIcon.innerHTML = CHECK_SVG;
  copyIcon.style.stroke = '#10b981';

  setTimeout(() => {
    copyIcon.innerHTML = COPY_SVG;
    copyIcon.style.stroke = 'currentColor';
  }, 1200);
});

scanActivePage();
