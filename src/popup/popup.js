const DEFAULT_SETTINGS = {
  timestamp: true,
  scrapedAt: true,
  url: true,
  source: true,
  title: true,
  role: true,
};

const OPTIONS = {
  "opt-timestamp": "timestamp",
  "opt-scraped-at": "scrapedAt",
  "opt-url": "url",
  "opt-source": "source",
  "opt-title": "title",
  "opt-role": "role",
};

async function loadSettings() {
  const result = await chrome.storage.sync.get("aiChatExporterSettings");
  return result.aiChatExporterSettings || DEFAULT_SETTINGS;
}

async function saveSettings(settings) {
  await chrome.storage.sync.set({ aiChatExporterSettings: settings });
}

async function init() {
  const settings = await loadSettings();

  for (const [optId, settingKey] of Object.entries(OPTIONS)) {
    const checkbox = document.getElementById(optId);
    if (checkbox) {
      checkbox.checked = settings[settingKey] !== false;

      checkbox.addEventListener("change", async () => {
        const currentSettings = await loadSettings();
        currentSettings[settingKey] = checkbox.checked;
        await saveSettings(currentSettings);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
