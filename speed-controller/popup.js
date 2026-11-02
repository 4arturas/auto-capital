// Speed Controller — Popup Script

document.addEventListener("DOMContentLoaded", () => {
  const speedDisplay = document.getElementById("speed-display");
  const btnSlower = document.getElementById("btn-slower");
  const btnReset = document.getElementById("btn-reset");
  const btnFaster = document.getElementById("btn-faster");

  // Fetch current speed from the active tab
  function fetchSpeed() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSpeed" }, (response) => {
        if (response && response.speed !== undefined) {
          speedDisplay.textContent = "⚡ Greitis: " + response.speed.toFixed(2) + "x";
        }
      });
    });
  }

  // Send speed change command to the active tab
  function sendCommand(delta) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: "setSpeed", delta: delta }, () => {
        // Refresh display after a short delay
        setTimeout(fetchSpeed, 200);
      });
    });
  }

  // Initial fetch
  fetchSpeed();

  // Button handlers
  btnSlower.addEventListener("click", () => sendCommand("slower"));
  btnReset.addEventListener("click", () => sendCommand("reset"));
  btnFaster.addEventListener("click", () => sendCommand("faster"));
});
