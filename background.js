chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  rewrite(msg, sendResponse);
  return true;
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const rewrite = async (msg, sendResponse) => {
  const options = {
    sharedContext: msg.text,
    tone: msg.tone,
    format: msg.format,
    length: msg.length,
  };

  const OLLAMA_URL = "http://localhost:11434/api/generate";

  try {

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3:8b",
        messages: [
          {
            role: "system",
            content: "You are a text rewriting assistant. Your only task is to rewrite the user's text. Never explain, analyze, or give advice. Always return only the rewritten text."
          },
          {
            role: "user",
            content: `Rewrite this text while preserving its exact meaning. Improve grammar, clarity, and naturalness.
    Tone: ${msg.tone}
    Format: ${msg.format}
    Length: ${msg.length}

    Text:
    ${msg.text}`
          }
        ],
        stream: false,
        think: false,
      }),
    });
    
    const data = await response.json();
    console.log(data);
    sendResponse({ response: data.message.content });
  } catch (error) {
    sendResponse({ response: error.message });
  }
};
