/**
 * @fileoverview Chrome extension background service worker for Ollama integration.
 */

const CONFIG = {
  // Changed to /api/chat because the payload uses the 'messages' array format.
  OLLAMA_URL: "http://localhost:11434/api/chat",
  MODEL_NAME: "qwen3:8b",
  HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};

// Fixed typo: MESSSAGE -> MESSAGE
const MESSAGE_TYPES = {
  TRANSLATE: "translate",
  REWRITE: "rewrite",
};

// --- Initialization ---

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("[SidePanel Error]:", error));

// --- Message Listener ---

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // Wrap in an async function to guarantee sendResponse is always called, even on unexpected errors.
  const handleMessage = async () => {
    try {
      switch (msg.type) {
        case MESSAGE_TYPES.TRANSLATE:
          return await handleTranslate(msg);
        case MESSAGE_TYPES.REWRITE:
          return await handleRewrite(msg);
        default:
          throw new Error("Invalid request type.");
      }
    } catch (error) {
      console.error("[Extension Error]:", error);
      return { response: error.message || "An unexpected error occurred." };
    }
  };

  handleMessage().then(sendResponse);
  
  // Return true to keep the message channel open for the async response
  return true; 
});

// --- Core API Utility ---

/**
 * Handles the HTTP request to the local Ollama instance.
 * @param {Array<{role: string, content: string}>} messages 
 * @returns {Promise<string>} The assistant's response content.
 */
const callOllama = async (messages) => {
  const response = await fetch(CONFIG.OLLAMA_URL, {
    method: "POST",
    headers: CONFIG.HEADERS,
    body: JSON.stringify({
      model: CONFIG.MODEL_NAME,
      messages,
      stream: false,
    }),
  });

  // Read the body stream ONCE. 
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Ollama request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  const content = data?.message?.content;
  if (!content) {
    throw new Error("Invalid response from Ollama: Missing message content.");
  }

  return content;
};

// --- Action Handlers ---

const handleTranslate = async (msg) => {
  const { inputLanguage, targetLanguage, text } = msg;
  
  const messages = [
    {
      role: "system",
      content: "You are a text translator assistant. Your only task is to translate the user's text to the target language. Never explain, analyze, or give advice. Always return only the translated text."
    },
    {
      role: "user",
      content: `Translate this text from ${inputLanguage} to ${targetLanguage} while preserving its exact meaning. Improve grammar, clarity, and naturalness.\n\nText:\n${text}`
    }
  ];

  const result = await callOllama(messages);
  return { response: result };
};

const handleRewrite = async (msg) => {
  const { tone, format, length, text } = msg;

  const messages = [
    {
      role: "system",
      content: "You are a text rewriting assistant. Your only task is to rewrite the user's text. Never explain, analyze, or give advice. Always return only the rewritten text."
    },
    {
      role: "user",
      content: `Rewrite this text while preserving its exact meaning. Improve grammar, clarity, and naturalness.\n\nTone: ${tone}\nFormat: ${format}\nLength: ${length}\n\nText:\n${text}`
    }
  ];

  const result = await callOllama(messages);
  return { response: result };
};