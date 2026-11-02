// Speed Controller — Content Script
// Injected into all pages to control HTML5 video playback speed.

(function () {
  "use strict";

  const MIN_SPEED = 0.1;
  const MAX_SPEED = 16.0;
  const STEP = 0.1;
  const HUD_FADE_DURATION = 1500; // ms

  // Ignore shortcuts when typing in input/textarea/contenteditable
  function isInputFocused() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") return true;
    if (el.isContentEditable) return true;
    return false;
  }

  // Get all visible video elements
  function getVideos() {
    const videos = Array.from(document.querySelectorAll("video"));
    return videos.filter((v) => v.videoWidth > 0 || v.readyState >= 2);
  }

  // Create or update HUD overlay for a video
  function showHUD(video, speed) {
    let hud = video.parentElement?.querySelector(".speed-controller-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "speed-controller-hud";
      hud.style.position = "absolute";
      hud.style.top = "12px";
      hud.style.left = "12px";
      hud.style.zIndex = "9999";
      hud.style.transition = "opacity 0.4s ease";
      if (!video.parentElement) {
        video.style.position = "relative";
      } else {
        video.parentElement.style.position =
          video.parentElement.style.position || "relative";
      }
      video.parentElement.appendChild(hud);
    }
    hud.textContent = speed.toFixed(1) + "x";
    hud.style.opacity = "1";

    // Clear previous timeout
    if (hud._timeout) clearTimeout(hud._timeout);
    hud._timeout = setTimeout(() => {
      hud.style.opacity = "0";
      setTimeout(() => {
        if (hud.parentElement) hud.parentElement.removeChild(hud);
      }, 400);
    }, HUD_FADE_DURATION);
  }

  // Change speed for all videos
  function setSpeed(delta) {
    const videos = getVideos();
    if (videos.length === 0) return;
    videos.forEach((video) => {
      let newSpeed;
      if (delta === "reset") {
        newSpeed = 1.0;
      } else {
        newSpeed = video.playbackRate + delta;
        newSpeed = Math.round(newSpeed * 10) / 10; // avoid floating point drift
        newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
      }
      video.playbackRate = newSpeed;
      showHUD(video, newSpeed);
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (isInputFocused()) return;
    // Ignore if modifier keys are pressed
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key.toLowerCase();
    if (key === "d") {
      e.preventDefault();
      setSpeed(STEP);
    } else if (key === "s") {
      e.preventDefault();
      setSpeed(-STEP);
    } else if (key === "r") {
      e.preventDefault();
      setSpeed("reset");
    }
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getSpeed") {
      const videos = getVideos();
      if (videos.length > 0) {
        sendResponse({ speed: videos[0].playbackRate });
      } else {
        sendResponse({ speed: 1.0 });
      }
      return true; // keep message channel open for async response
    }

    if (message.action === "setSpeed") {
      const delta = message.delta;
      const videos = getVideos();
      videos.forEach((video) => {
        let newSpeed;
        if (delta === "reset") {
          newSpeed = 1.0;
        } else if (delta === "faster") {
          newSpeed = Math.round((video.playbackRate + STEP) * 10) / 10;
          newSpeed = Math.min(MAX_SPEED, newSpeed);
        } else if (delta === "slower") {
          newSpeed = Math.round((video.playbackRate - STEP) * 10) / 10;
          newSpeed = Math.max(MIN_SPEED, newSpeed);
        }
        if (newSpeed !== undefined) {
          video.playbackRate = newSpeed;
          showHUD(video, newSpeed);
        }
      });
      sendResponse({ ok: true });
    }
  });
})();
