# 📘 My Grammar AI – Chrome Extension

**My Grammar AI** is a simple Chrome extension that improves your writing by correcting grammar, tone, and structure using a local [Ollama](https://ollama.com/) model. Whether you're writing emails, social posts, or reports, this tool helps you sound more natural, concise, and polished — all running locally on your machine.

---

## 🚀 Features

*   📝 **Smart Rewrite:** Adjust the tone (casual/formal), length (shorter/longer), and format (plain text/markdown) of any text.
*   🌍 **Context-Aware Translation:** Translate text across 8 different languages. The AI is prompted with full language names to reduce hallucinations and ensure high-quality localization.
*   🔊 **Native Text-to-Speech (TTS):** Listen to your generated text with the click of a button. The extension automatically detects the target language and adjusts the pronunciation accent accordingly using the browser's native Web Speech API.
*   📋 **One-Click Copy:** Easily copy the generated response to your clipboard with visual confirmation.
*   ♿ **Fully Accessible:** Built with semantic HTML, ARIA attributes, keyboard navigation, and live regions (`aria-live="polite"`) for screen readers.
*   🎨 **Responsive Design:** A clean, modern UI powered by CSS variables that dynamically adapts to the width of the Chrome Side Panel.

---

## 🛠 Installation Instructions

### 1. Install and run Ollama

1. Download and install [Ollama](https://ollama.com/download).
2. Pull the model used by the extension:
   ```bash
   ollama pull qwen3:8b
   ```
3. Make sure Ollama is running and accepting request from all origins, or start it
   ```bash
   OLLAMA_ORIGINS="*" nohup ollama serve > /tmp/ollama.log 2>&1 &
   ```

It listens on `http://localhost:11434` by default.

### 2. Clone or download this repository

```bash
git clone https://github.com/your-username/my-grammar-ai.git
cd my-grammar-ai
```

Or download the `.zip` file and extract it.

### 3. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right corner)
3. Click **Load unpacked**
4. Select the folder containing the extension files

### 4. Usage

1. Click the extension icon to open the **side panel**
2. Paste or type your text
3. Select your desired options (tone, length, format)
4. Click **Rewrite**
5. Click the copy icon to grab your improved text

---

## ⚙️ Configuration

The extension uses Ollama's chat API at `http://localhost:11434/api/chat` with the `qwen3:8b` model. To use a different model, update the `model` field in `background.js`.

---

## 📋 Requirements

- Chrome 88+ or Chromium-based browser
- [Ollama](https://ollama.com/) installed and running locally
- The `qwen3:8b` model pulled via Ollama

---

## 📄 License

MIT License

---

## 📸 Screenshot

### Rewrite

<img width="382" height="690" alt="image" src="https://github.com/user-attachments/assets/1966f011-f30f-4998-aca6-cad95e38876f" />


### Translate

<img width="365" height="567" alt="image" src="https://github.com/user-attachments/assets/2a81a6de-fabe-4b29-8358-5f5135a17c73" />
