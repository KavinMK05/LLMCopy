(function () {
  console.log("AI Chat Exporter: Grok adapter loaded");

  const SELECTORS = {
    MESSAGE: 'article[data-testid="tweet"]',
    HEADER: '[data-testid="primaryColumn"] h2[role="heading"]',
    TEXT_CONTENT: '[data-testid="tweetText"]',
  };

  function scrapeConversation() {
    const messages = [];
    const articles = document.querySelectorAll(SELECTORS.MESSAGE);

    articles.forEach((article) => {
      const userText = article.innerText;
      let role = "user";
      if (userText.includes("@grok") || userText.includes("Grok")) {
        role = "assistant";
      }

      const textDiv = article.querySelector(SELECTORS.TEXT_CONTENT);
      const content = textDiv ? textDiv.innerText : "";

      if (content) {
        messages.push({
          role: role,
          content: content,
          timestamp: new Date().toISOString(),
        });
      }
    });

    return {
      title: "Grok Conversation",
      source: "Grok (X.com)",
      url: window.location.href,
      scrapedAt: new Date().toISOString(),
      messages: messages,
    };
  }

  function injectButtons(targetEl) {
    const container =
      targetEl.closest('div[style*="flex"]') || targetEl.parentElement;

    if (container.querySelector(".ai-chat-exporter-btn")) return;

    const btnOptions = {
      iconColor: "#E7E9EA",
      hoverBg: "rgba(255,255,255,0.1)",
    };

    const wrapper = document.createElement("div");
    wrapper.className = "ai-chat-exporter-container";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    const copyBtn = window.AIChatExporter.createCopyButton(async () => {
      const data = scrapeConversation();
      if (data && data.messages.length > 0) {
        return await window.AIChatExporter.copyJSON(data);
      }
      alert("AI Chat Exporter: No Grok messages found.");
      return false;
    }, btnOptions);

    const downloadBtn = window.AIChatExporter.createDownloadButton(() => {
      const data = scrapeConversation();
      if (data && data.messages.length > 0) {
        window.AIChatExporter.downloadJSON(data, "grok_export");
      } else {
        alert("AI Chat Exporter: No Grok messages found.");
      }
    }, btnOptions);

    wrapper.appendChild(copyBtn);
    wrapper.appendChild(downloadBtn);
    container.appendChild(wrapper);
    console.log("AI Chat Exporter: Buttons injected in Grok");
  }

  window.AIChatExporter.observeAndInject(SELECTORS.HEADER, (header) => {
    injectButtons(header);
  });
})();
