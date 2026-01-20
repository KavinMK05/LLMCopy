// Default settings
const DEFAULT_SETTINGS = {
  timestamp: true,
  scrapedAt: true,
  url: true,
  source: true,
  title: true,
  role: true,
};

// Option IDs mapping
const OPTIONS = {
  "opt-timestamp": "timestamp",
  "opt-scraped-at": "scrapedAt",
  "opt-url": "url",
  "opt-source": "source",
  "opt-title": "title",
  "opt-role": "role",
};

// Load settings from storage
async function loadSettings() {
  const result = await chrome.storage.sync.get("llmcopySettings");
  return result.llmcopySettings || DEFAULT_SETTINGS;
}

// Save settings to storage
async function saveSettings(settings) {
  await chrome.storage.sync.set({ llmcopySettings: settings });
  showSaveStatus();
}

// Show save status indicator
function showSaveStatus() {
  const status = document.getElementById("save-status");
  status.textContent = "✓ Saved";
  status.classList.add("show");
  setTimeout(() => {
    status.classList.remove("show");
  }, 1500);
}

// Initialize popup
async function init() {
  const settings = await loadSettings();

  // Set checkbox states
  for (const [optId, settingKey] of Object.entries(OPTIONS)) {
    const checkbox = document.getElementById(optId);
    if (checkbox) {
      checkbox.checked = settings[settingKey] !== false;

      // Add change listener
      checkbox.addEventListener("change", async () => {
        const currentSettings = await loadSettings();
        currentSettings[settingKey] = checkbox.checked;
        await saveSettings(currentSettings);
      });
    }
  }
}

// Run on load
document.addEventListener("DOMContentLoaded", init);
