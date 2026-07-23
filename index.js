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

    if (!text) {
      alert("Please enter some text.");
      return;
    }

    loadingElement.hidden = false;
    responseElement.innerText = "";
    copyButton.hidden = true;
    clearButton.hidden = true;
    
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
