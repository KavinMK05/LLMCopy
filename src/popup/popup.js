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
  try {
    console.log("[AI Chat Exporter] Loading settings...");
    console.log("[AI Chat Exporter] browser object:", typeof browser);
    console.log("[AI Chat Exporter] browser.storage:", browser?.storage);
    console.log("[AI Chat Exporter] browser.storage.sync:", browser?.storage?.sync);
    console.log("[AI Chat Exporter] browser.storage.local:", browser?.storage?.local);
    
    const result = await browser.storage.local.get("aiChatExporterSettings");
    console.log("[AI Chat Exporter] Loaded result:", result);
    return result.aiChatExporterSettings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error("[AI Chat Exporter] Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings) {
  try {
    console.log("[AI Chat Exporter] Saving settings:", settings);
    await browser.storage.local.set({ aiChatExporterSettings: settings });
    console.log("[AI Chat Exporter] Settings saved successfully");
  } catch (error) {
    console.error("[AI Chat Exporter] Error saving settings:", error);
  }
}

async function init() {
  console.log("[AI Chat Exporter] init() called");
  console.log("[AI Chat Exporter] document.readyState:", document.readyState);
  
  try {
    const settings = await loadSettings();
    console.log("[AI Chat Exporter] Loaded settings:", settings);

    for (const [optId, settingKey] of Object.entries(OPTIONS)) {
      const checkbox = document.getElementById(optId);
      if (checkbox) {
        checkbox.checked = settings[settingKey] !== false;
        console.log(`[AI Chat Exporter] Set ${optId} to ${checkbox.checked}`);

        checkbox.addEventListener("change", async () => {
          console.log(`[AI Chat Exporter] Change event for ${optId}`);
          try {
            const currentSettings = await loadSettings();
            currentSettings[settingKey] = checkbox.checked;
            await saveSettings(currentSettings);
          } catch (error) {
            console.error(`[AI Chat Exporter] Error handling change for ${optId}:`, error);
          }
        });
      } else {
        console.error(`[AI Chat Exporter] Checkbox not found: ${optId}`);
      }
    }
  } catch (error) {
    console.error("[AI Chat Exporter] Error in init():", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
console.log("[AI Chat Exporter] DOMContentLoaded listener registered");
