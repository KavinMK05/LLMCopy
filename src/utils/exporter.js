window.AIChatExporter = window.AIChatExporter || {};

// Default settings
const DEFAULT_SETTINGS = {
  timestamp: true,
  scrapedAt: true,
  url: true,
  source: true,
  title: true,
  role: true,
};

/**
 * Get current settings from storage
 */
window.AIChatExporter.getSettings = async function () {
  try {
    const result = await browser.storage.local.get("aiChatExporterSettings");
    return { ...DEFAULT_SETTINGS, ...result.aiChatExporterSettings };
  } catch (e) {
    console.log("AI Chat Exporter: Could not load settings, using defaults", e);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Apply settings to filter the data
 */
async function applySettings(data) {
  let settings = DEFAULT_SETTINGS;
  try {
    const result = await browser.storage.local.get("aiChatExporterSettings");
    settings = { ...DEFAULT_SETTINGS, ...result.aiChatExporterSettings };
  } catch (e) {
    console.log("AI Chat Exporter: Using default settings", e);
  }

  const output = {};

  if (settings.title && data.title) output.title = data.title;
  if (settings.source && data.source) output.source = data.source;
  if (settings.url && data.url) output.url = data.url;
  if (settings.scrapedAt && data.scrapedAt) output.scrapedAt = data.scrapedAt;

  output.messages = data.messages.map((msg) => {
    const m = { content: msg.content };
    if (settings.role) m.role = msg.role;
    if (settings.timestamp && msg.timestamp) m.timestamp = msg.timestamp;
    return m;
  });

  return output;
}

/**
 * Download JSON file
 */
window.AIChatExporter.downloadJSON = async function (data, filename = "conversation") {
  const output = await applySettings(data);
  const jsonStr = JSON.stringify(output, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copy JSON to clipboard
 * Supports two modes based on user settings:
 * - "text": Copy as plain text (default)
 * - "file": Copy as a JSON file blob
 */
window.AIChatExporter.copyJSON = async function (data) {
  const output = await applySettings(data);
  const jsonStr = JSON.stringify(output, null, 2);
  const settings = await window.AIChatExporter.getSettings();
  const copyMode = settings.copyMode || "text";

  try {
    if (copyMode === "file") {
      // Copy as JSON file - creates a blob that can be pasted as a file
      const blob = new Blob([jsonStr], { type: "application/json" });
      const clipboardItem = new ClipboardItem({
        "application/json": blob,
        // Also include text/plain as fallback for apps that don't support JSON
        "text/plain": new Blob([jsonStr], { type: "text/plain" }),
      });
      await navigator.clipboard.write([clipboardItem]);
    } else {
      // Copy as plain text (default)
      await navigator.clipboard.writeText(jsonStr);
    }
    return true;
  } catch (e) {
    console.error("AI Chat Exporter: Failed to copy to clipboard", e);
    // Fallback to plain text if file copy fails
    try {
      await navigator.clipboard.writeText(jsonStr);
      return true;
    } catch (fallbackError) {
      console.error("AI Chat Exporter: Fallback copy also failed", fallbackError);
      return false;
    }
  }
};

// SVG Icons
const DOWNLOAD_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
  <polyline points="7 10 12 15 17 10"/>
  <line x1="12" y1="15" x2="12" y2="3"/>
</svg>`;

const COPY_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
</svg>`;

const CHECK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`;

/**
 * Create icon button helper
 */
function createButton(icon, title, onClick, options = {}) {
  const btn = document.createElement("button");
  btn.innerHTML = icon;
  btn.className = options.className || "ai-chat-exporter-btn";
  btn.title = title;
  btn.setAttribute("aria-label", title);

  const styles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    padding: "6px",
    backgroundColor: "transparent",
    color: options.iconColor || "currentColor",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.2s",
    flexShrink: "0",
    ...options.styles,
  };

  Object.assign(btn.style, styles);

  btn.onmouseenter = () => {
    btn.style.backgroundColor = options.hoverBg || "rgba(255,255,255,0.1)";
  };
  btn.onmouseleave = () => {
    btn.style.backgroundColor = "transparent";
  };

  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(btn);
  };

  return btn;
}

/**
 * Create download button
 */
window.AIChatExporter.createDownloadButton = function (onClick, options = {}) {
  return createButton(DOWNLOAD_ICON, "Download JSON", onClick, {
    className: "ai-chat-exporter-btn ai-chat-exporter-download",
    ...options,
  });
};

/**
 * Create copy button
 */
window.AIChatExporter.createCopyButton = function (onClick, options = {}) {
  const btn = createButton(
    COPY_ICON,
    "Copy JSON to clipboard",
    async (btnEl) => {
      const success = await onClick();
      if (success) {
        // Show checkmark temporarily
        btnEl.innerHTML = CHECK_ICON;
        btnEl.style.color = "#4ade80";
        setTimeout(() => {
          btnEl.innerHTML = COPY_ICON;
          btnEl.style.color = options.iconColor || "currentColor";
        }, 1500);
      }
    },
    {
      className: "ai-chat-exporter-btn ai-chat-exporter-copy",
      ...options,
    },
  );
  return btn;
};

/**
 * Legacy: Create icon button (download)
 */
window.AIChatExporter.createIconButton = function (onClick, options = {}) {
  return window.AIChatExporter.createDownloadButton(onClick, options);
};
