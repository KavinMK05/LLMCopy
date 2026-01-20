window.LLMCopy = window.LLMCopy || {};

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
window.LLMCopy.getSettings = async function () {
  try {
    const result = await chrome.storage.sync.get("llmcopySettings");
    return { ...DEFAULT_SETTINGS, ...result.llmcopySettings };
  } catch (e) {
    console.log("LLMCopy: Could not load settings, using defaults");
    return DEFAULT_SETTINGS;
  }
};

/**
 * Apply settings to filter the data
 */
async function applySettings(data) {
  let settings = DEFAULT_SETTINGS;
  try {
    const result = await chrome.storage.sync.get("llmcopySettings");
    settings = { ...DEFAULT_SETTINGS, ...result.llmcopySettings };
  } catch (e) {
    console.log("LLMCopy: Using default settings");
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
window.LLMCopy.downloadJSON = async function (data, filename = "conversation") {
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
 */
window.LLMCopy.copyJSON = async function (data) {
  const output = await applySettings(data);
  const jsonStr = JSON.stringify(output, null, 2);

  try {
    await navigator.clipboard.writeText(jsonStr);
    return true;
  } catch (e) {
    console.error("LLMCopy: Failed to copy to clipboard", e);
    return false;
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
  btn.className = options.className || "llmcopy-btn";
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
window.LLMCopy.createDownloadButton = function (onClick, options = {}) {
  return createButton(DOWNLOAD_ICON, "Download JSON", onClick, {
    className: "llmcopy-btn llmcopy-download",
    ...options,
  });
};

/**
 * Create copy button
 */
window.LLMCopy.createCopyButton = function (onClick, options = {}) {
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
      className: "llmcopy-btn llmcopy-copy",
      ...options,
    },
  );
  return btn;
};

/**
 * Legacy: Create icon button (download)
 */
window.LLMCopy.createIconButton = function (onClick, options = {}) {
  return window.LLMCopy.createDownloadButton(onClick, options);
};
