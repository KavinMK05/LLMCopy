window.LLMCopy = window.LLMCopy || {};

/**
 * Watches for an element matching the selector and triggers the callback when found.
 * Ensures the callback is only called once per element using a data attribute.
 * @param {string} selector - CSS selector to find the target element.
 * @param {Function} callback - Function to run when the element is found. Passed the element and the observer.
 * @param {Object} options - Optional settings (e.g., continuous observation).
 */
window.LLMCopy.observeAndInject = function (selector, callback, options = {}) {
  // Flag to mark elements as processed
  const MARKER = "data-llmcopy-injected";

  const handleMutations = () => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (!element.getAttribute(MARKER)) {
        element.setAttribute(MARKER, "true");
        callback(element);
      }
    });
  };

  const observer = new MutationObserver((mutations) => {
    handleMutations();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check in case it's already there
  handleMutations();

  return observer;
};
