(function () {
  console.log("AI Chat Exporter: Gemini adapter loaded");

  if (!window.AIChatExporter) {
    console.error("AI Chat Exporter: Utilities not loaded.");
    return;
  }

  const SELECTORS = {
    TOP_BAR_ACTIONS: ".top-bar-actions .right-section",
    CHAT_HISTORY: "infinite-scroller.chat-history, .chat-history",
    USER_MESSAGE: "user-query",
    MODEL_MESSAGE: "model-response",
    USER_TEXT: ".query-text, .user-query-bubble-with-background",
    MODEL_TEXT: ".markdown, message-content",
  };

  function scrapeConversation() {
    const allMessages = [];
    const chatHistory = document.querySelector(SELECTORS.CHAT_HISTORY);

    if (chatHistory) {
      const allMsgElements = chatHistory.querySelectorAll(
        `${SELECTORS.USER_MESSAGE}, ${SELECTORS.MODEL_MESSAGE}`,
      );
      allMsgElements.forEach((el) => {
        const isUser = el.tagName.toLowerCase() === "user-query";
        const textSelector = isUser
          ? SELECTORS.USER_TEXT
          : SELECTORS.MODEL_TEXT;
        const textEl = el.querySelector(textSelector);
        const content = textEl ? textEl.innerText.trim() : el.innerText.trim();

        if (content) {
          allMessages.push({
            role: isUser ? "user" : "assistant",
            content: content,
            timestamp: new Date().toISOString(),
          });
        }
      });
    }

    if (allMessages.length === 0) {
      const allMsgElements = document.querySelectorAll(
        `${SELECTORS.USER_MESSAGE}, ${SELECTORS.MODEL_MESSAGE}`,
      );
      allMsgElements.forEach((el) => {
        const isUser = el.tagName.toLowerCase() === "user-query";
        const textSelector = isUser
          ? SELECTORS.USER_TEXT
          : SELECTORS.MODEL_TEXT;
        const textEl = el.querySelector(textSelector);
        const content = textEl ? textEl.innerText.trim() : el.innerText.trim();
        if (content) {
          allMessages.push({
            role: isUser ? "user" : "assistant",
            content,
            timestamp: new Date().toISOString(),
          });
        }
      });
    }

    return allMessages;
  }

  function getData() {
    const messages = scrapeConversation();
    if (!messages || messages.length === 0) return null;
    return {
      title:
        document.title.replace("- Google Gemini", "").trim() || "Gemini Chat",
      source: "Gemini",
      url: window.location.href,
      scrapedAt: new Date().toISOString(),
      messages: messages,
    };
  }

  function injectButtons(container) {
    if (container.querySelector(".ai-chat-exporter-btn")) return;

    const btnOptions = {
      iconColor: "#E8EAED",
      hoverBg: "rgba(255,255,255,0.08)",
    };

    const wrapper = document.createElement("div");
    wrapper.className = "ai-chat-exporter-container";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    const copyBtn = window.AIChatExporter.createCopyButton(async () => {
      const data = getData();
      if (data) return await window.AIChatExporter.copyJSON(data);
      alert("AI Chat Exporter: No messages found.");
      return false;
    }, btnOptions);

    const downloadBtn = window.AIChatExporter.createDownloadButton(() => {
      const data = getData();
      if (data) window.AIChatExporter.downloadJSON(data, "gemini_export");
      else alert("AI Chat Exporter: No messages found.");
    }, btnOptions);

    wrapper.appendChild(copyBtn);
    wrapper.appendChild(downloadBtn);
    container.appendChild(wrapper);
    console.log("AI Chat Exporter: Buttons injected in Gemini");
  }

  window.AIChatExporter.observeAndInject(SELECTORS.TOP_BAR_ACTIONS, (container) => {
    injectButtons(container);
  });
})();
