const GEMINI_API_KEY = "your_gemini_api_key_here";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const copyButton = document.getElementById("copy-button");
const clearButton = document.getElementById("clear-button");
const responseElement = document.getElementById("response");
const loadingElement = document.getElementById("loading");

document
  .getElementById("button-rewrite")
  .addEventListener("click", async () => {
    const text = document.getElementById("input-prompt").value;
    const tone = document.getElementById("tone").value;
    const length = document.getElementById("length").value;
    const format = document.getElementById("format").value;
    const service = document.querySelector(
      'input[name="service"]:checked'
    )?.value;

    if (!text) {
      alert("Please enter some text.");
      return;
    }

    loadingElement.hidden = false;
    responseElement.innerText = "";
    copyButton.hidden = true;
    clearButton.hidden = true;

    if (service === "gemini") {
      try {
        let parts = [];

        if (tone !== "same") {
          parts.push(`with a focus on ${tone}`);
        }

        if (length !== "same") {
          parts.push(`making it ${length}`);
        }

        parts.push(`formatted as ${format}`);

        let promptText = `Improve the following text ${parts.join(
          ", "
        )}. The text to improve is: "${text}"`;

        const response = await fetch(GEMINI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}. Detail: ${
              errorData.error?.message || "Unknown error"
            }`
          );
        }

        const data = await response.json();

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          responseElement.innerText = generatedText;
          copyButton.hidden = false;
          clearButton.hidden = false;
        } else {
          responseElement.innerText =
            "Error: Could not extract generated text.";
        }
      } catch (error) {
        console.error("Error calling the Gemini API:", error);
        responseElement.innerText = `An error occurred: ${error.message}`;
      } finally {
        loadingElement.hidden = true;
      }
    } else if (service === "chrome") {
      chrome.runtime.sendMessage(
        { type: "improve", text, tone, length, format },
        (response) => {
          loadingElement.hidden = true;

          if (chrome.runtime.lastError) {
            console.error("Message failed:", chrome.runtime.lastError);
            responseElement.innerText = "Error communicating with extension.";
            return;
          }

          responseElement.innerText = response.response || "Error";

          if (response.response) {
            copyButton.hidden = false;
            clearButton.hidden = false;
          }
        }
      );
    }
  });

clearButton.addEventListener("click", () => {
  document.getElementById("input-prompt").value = "";
  responseElement.innerText = "";
  copyButton.hidden = true;
  clearButton.hidden = true;
});

const copyText = responseElement;
const confirmation = document.getElementById("confirmation");

copyButton.addEventListener("click", () => {
  navigator.clipboard
    .writeText(copyText.innerText)
    .then(() => {
      confirmation.style.display = "inline";
      setTimeout(() => {
        confirmation.style.display = "none";
      }, 1500);
    })
    .catch((err) => {
      console.error("Copy failed: ", err);

      alert("Failed to copy text. Check console for error.");
    });
});
