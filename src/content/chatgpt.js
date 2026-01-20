(function () {
  console.log("LLMCopy: ChatGPT adapter loaded");

  const SELECTORS = {
    HEADER_ACTIONS: "#conversation-header-actions",
    MESSAGE_BLOCK: "[data-message-author-role]",
    CONTENT: ".markdown",
  };

  function scrapeConversation() {
    const messages = [];
    const messageElements = document.querySelectorAll(SELECTORS.MESSAGE_BLOCK);

    if (messageElements.length === 0) {
      return null;
    }

    messageElements.forEach((el) => {
      const role = el.getAttribute("data-message-author-role");
      const contentEl = el.querySelector(SELECTORS.CONTENT) || el;
      const textContent = contentEl.innerText;

      messages.push({
        role: role,
        content: textContent,
        timestamp: new Date().toISOString(),
      });
    });

    return {
      title: document.title.replace("ChatGPT", "").trim() || "Conversation",
      source: "ChatGPT",
      url: window.location.href,
      scrapedAt: new Date().toISOString(),
      messages: messages,
    };
  }

  function injectButtons(headerActions) {
    if (headerActions.querySelector(".llmcopy-btn")) return;

    const btnOptions = {
      iconColor: "currentColor",
      hoverBg: "var(--token-surface-hover, rgba(255,255,255,0.1))",
    };

    // Create button container
    const container = document.createElement("div");
    container.className = "llmcopy-container";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.marginLeft = "4px";

    // Copy button
    const copyBtn = window.LLMCopy.createCopyButton(async () => {
      const data = scrapeConversation();
      if (data && data.messages.length > 0) {
        return await window.LLMCopy.copyJSON(data);
      } else {
        alert("LLMCopy: No messages found.");
        return false;
      }
    }, btnOptions);

    // Download button
    const downloadBtn = window.LLMCopy.createDownloadButton(() => {
      const data = scrapeConversation();
      if (data && data.messages.length > 0) {
        window.LLMCopy.downloadJSON(
          data,
          `chatgpt_${data.title.substring(0, 20)}`,
        );
      } else {
        alert("LLMCopy: No messages found.");
      }
    }, btnOptions);

    container.appendChild(copyBtn);
    container.appendChild(downloadBtn);
    headerActions.appendChild(container);
    console.log("LLMCopy: Buttons injected in ChatGPT header");
  }

  window.LLMCopy.observeAndInject(SELECTORS.HEADER_ACTIONS, (container) => {
    injectButtons(container);
  });
})();
