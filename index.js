/**
 * @fileoverview Chrome extension side panel UI logic.
 */

const MESSAGE_TYPES = {
  TRANSLATE: "translate",
  REWRITE: "rewrite",
};

// --- DOM Elements Cache ---
// Querying the DOM once at initialization improves performance and readability.
const DOM = {
  inputPrompt: document.getElementById("input-prompt"),
  response: document.getElementById("response"),
  loading: document.getElementById("loading"),
  copyBtn: document.getElementById("copy-button"),
  ttsBtn: document.getElementById("tts-button"),
  clearBtn: document.getElementById("clear-button"),
  confirmation: document.getElementById("confirmation"),
  
  
  tabs: document.querySelectorAll(".tab"),
  tabContents: document.querySelectorAll(".tab-content"),
  
  btnRewrite: document.getElementById("button-rewrite"),
  btnTranslate: document.getElementById("button-translate"),
  
  // Settings Inputs
  tone: document.getElementById("tone"),
  length: document.getElementById("length"),
  format: document.getElementById("format"),
  inputLang: document.getElementById("input-language"),
  targetLang: document.getElementById("target-language"),
};

// --- UI State Management ---

/**
 * Centralized function to manage UI states during fetching.
 * @param {Object} state 
 * @param {boolean} state.isProcessing - Shows loader, clears response, hides buttons.
 * @param {boolean} state.hasSuccess - Shows the copy/clear buttons.
 */
const setUIState = ({ isProcessing = false, hasSuccess = false }) => {
  DOM.loading.hidden = !isProcessing;
  DOM.copyBtn.hidden = !hasSuccess;
  DOM.ttsBtn.hidden = !hasSuccess;
  DOM.clearBtn.hidden = !hasSuccess;
  
  if (isProcessing) {
    DOM.response.innerText = "";
    window.speechSynthesis.cancel();
  }
};

// --- API Communication ---

/**
 * Wraps chrome.runtime.sendMessage in a Promise for async/await usage.
 * @param {Object} payload 
 * @returns {Promise<string>}
 */
const sendExtensionMessage = (payload) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(payload, (response) => {
      // Handle extension-level connection errors
      if (chrome.runtime.lastError) {
        console.error("[Runtime Error]:", chrome.runtime.lastError);
        return reject(new Error("Error communicating with extension."));
      }
      
      // Handle application-level errors returned from the background script
      if (!response || !response.response || response.response.toLowerCase().includes("error")) {
        return reject(new Error(response?.response || "Unknown error occurred."));
      }
      
      resolve(response.response);
    });
  });
};

// --- Action Handlers ---

/**
 * Generic handler for text processing actions to keep code DRY.
 * @param {string} type - The action type (rewrite/translate)
 * @param {Function} getPayloadData - Returns specific data needed for the payload
 */
const handleProcessText = async (type, getPayloadData) => {
  const text = DOM.inputPrompt.value.trim();
  
  if (!text) {
    alert("Please enter some text.");
    return;
  }

  setUIState({ isProcessing: true });

  try {
    const payload = { type, text, ...getPayloadData() };
    const result = await sendExtensionMessage(payload);
    
    DOM.response.innerText = result;
    setUIState({ isProcessing: false, hasSuccess: true });
  } catch (error) {
    DOM.response.innerText = error.message;
    setUIState({ isProcessing: false, hasSuccess: false });
  }
};

// --- Event Listeners ---

// 1. Tab Switching
DOM.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    // Remove active classes
    DOM.tabs.forEach((t) => t.classList.remove("active"));
    DOM.tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked tab and corresponding content
    tab.classList.add("active");
    document.getElementById(`tab-content-${target}`).classList.add("active");
  });
});

// 2. Process Actions
DOM.btnRewrite.addEventListener("click", () => {
  handleProcessText(MESSAGE_TYPES.REWRITE, () => ({
    tone: DOM.tone.value,
    length: DOM.length.value,
    format: DOM.format.value,
  }));
});

DOM.btnTranslate.addEventListener("click", () => {
  handleProcessText(MESSAGE_TYPES.TRANSLATE, () => ({
    inputLanguage: DOM.inputLang.value,
    targetLanguage: DOM.targetLang.value,
  }));
});

// 3. Clear UI
DOM.clearBtn.addEventListener("click", () => {
  DOM.inputPrompt.value = "";
  DOM.response.innerText = "";
  window.speechSynthesis.cancel();
  setUIState({ isProcessing: false, hasSuccess: false });
});

// 4. Copy to Clipboard
DOM.copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(DOM.response.innerText);
    
    DOM.confirmation.style.display = "inline";
    setTimeout(() => {
      DOM.confirmation.style.display = "none";
    }, 1500);
  } catch (err) {
    console.error("[Clipboard Error]: ", err);
    alert("Failed to copy text. Check console for error.");
  }
});

DOM.ttsBtn.addEventListener("click", () => {
  const text = DOM.response.innerText;
  if (!text) return;

  // Toggle behavior: If it is already speaking, stop it.
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Determine if we are on the translate tab to set the correct accent/language
  const isTranslateTab = document.querySelector('.tab[data-tab="translate"]').classList.contains("active");
  
  if (isTranslateTab) {
    // Map your dropdown values to BCP 47 language codes
    const langMap = {
      "English": "en-US",
      "Spanish": "es-ES",
      "French": "fr-FR",
      "German": "de-DE",
      "Italian": "it-IT",
      "Portuguese": "pt-PT",
      "Russian": "ru-RU",
      "Chinese": "zh-CN"
    };
    const targetLang = DOM.targetLang.value;
    if (langMap[targetLang]) {
      utterance.lang = langMap[targetLang];
    }
  } else {
    // Default to english for rewrites
    utterance.lang = "en-US";
  }

  // Play the audio
  window.speechSynthesis.speak(utterance);
});