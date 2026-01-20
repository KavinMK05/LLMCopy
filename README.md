# 🤖 LLMCopy

<div align="center">

![Chrome](https://ziadoua.github.io/m3-Markdown-Badges/badges/Chrome/chrome1.svg)
![License](https://ziadoua.github.io/m3-Markdown-Badges/badges/LicenceMIT/licencemit1.svg)

**Export your AI conversations with ease.**  
_Seamlessly save chat history from ChatGPT, Gemini, and Grok to JSON._

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Privacy](#-privacy)

</div>

---

## 📖 Overview

**LLMCopy** is a lightweight, privacy-focused browser extension designed to help you archive and export your interactions with major AI language models. Whether you're saving research, code snippets, or creative writing, LLMCopy ensures you can take your data with you in a structured, machine-readable JSON format.

## ✨ Features

- **🚀 Multi-Platform Support**: Works instantly with **ChatGPT**, **Google Gemini**, and **X (Grok)**.
- **📥 Dual Export Options**:
  - **Copy to Clipboard**: Quick copy for pasting into editors or other tools.
  - **Download JSON**: Save a complete archive of the conversation with one click.
- **⚙️ Customizable Metadata**: Configure exactly what gets saved via the popup menu:
  - Timestamps
  - Source URL
  - Model Role
  - Page Title
  - Scrape Time
- **🔒 Privacy First**: All processing runs locally in your browser. No data is ever sent to external servers.
- **🎨 Native Integration**: Export buttons are injected seamlessly into the AI's interface for a native feel.

## 🛠️ Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/LLMCopy.git
    ```
2.  **Open Chrome Extensions**
    - Navigate to `chrome://extensions/` in your browser.
3.  **Enable Developer Mode**
    - Toggle the **Developer mode** switch in the top right corner.
4.  **Load Unpacked Extension**
    - Click **Load unpacked**.
    - Select the `LLMCopy` folder (the root directory containing `manifest.json`).

## 🚀 Usage

1.  **Navigate to an AI Chat**
    - Open a conversation on [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), or [Grok](https://x.com).
2.  **Locate the Buttons**
    - Look for the new **Copy** and **Download** icons injected into the page (usually near the top right or action bar).
3.  **Export Data**
    - Click **Copy** to save the JSON to your clipboard.
    - Click **Download** to save the conversation as a `.json` file.
4.  **Configure Settings**
    - Click the **LLMCopy extension icon** in your browser toolbar to toggle saved metadata fields (e.g., enable/disable timestamps or URLs).

## 📂 Project Structure

```
LLMCopy/
├── manifest.json       # Extension configuration
├── src/
│   ├── content/        # Content scripts for specific platforms
│   │   ├── chatgpt.js
│   │   ├── gemini.js
│   │   └── grok.js
│   ├── popup/          # Extension popup UI (Settings)
│   ├── styles/         # Shared CSS
│   └── utils/          # Core logic (Exporter, Observer)
```

## 🔒 Privacy

LLMCopy operates **offline** and **locally** within your browser instance.

- **No Analytics**: We do not track your usage.
- **No Data Collection**: Your conversation data stays between you and the AI provider.
- **Permission Transparency**: We only request permissions necessary to inject the export buttons (`activeTab`, `scripting`) and save your preferences (`storage`).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
