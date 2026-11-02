let isActive = false;
let currentFontSize = 18;
let currentTheme = "light";

const toggleBtn = document.getElementById("toggleBtn");
const fontIncreaseBtn = document.getElementById("fontIncrease");
const fontDecreaseBtn = document.getElementById("fontDecrease");
const themeBtns = document.querySelectorAll(".theme-btn");

// Toggle Focus Mode
toggleBtn.addEventListener("click", async () => {
  isActive = !isActive;
  toggleBtn.classList.toggle("active", isActive);
  toggleBtn.textContent = isActive ? "Išjungti skaitymo režimą" : "Įjungti skaitymo režimą";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  if (isActive) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["reader-engine.js"],
    });
    // Send initial settings
    chrome.tabs.sendMessage(tab.id, {
      type: "focus-reader-settings",
      fontSize: currentFontSize,
      theme: currentTheme,
    });
  } else {
    chrome.tabs.sendMessage(tab.id, {
      type: "focus-reader-disable",
    });
  }
});

// Font size controls
fontIncreaseBtn.addEventListener("click", () => {
  if (currentFontSize < 32) {
    currentFontSize += 2;
    sendSettings();
  }
});

fontDecreaseBtn.addEventListener("click", () => {
  if (currentFontSize > 12) {
    currentFontSize -= 2;
    sendSettings();
  }
});

// Theme controls
themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTheme = btn.dataset.theme;
    sendSettings();
  });
});

// Send current settings to the active tab
function sendSettings() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab) {
      chrome.tabs.sendMessage(tab.id, {
        type: "focus-reader-settings",
        fontSize: currentFontSize,
        theme: currentTheme,
      }).catch(() => {
        // Tab doesn't have the listener (focus mode not active) — ignore
      });
    }
  });
}
