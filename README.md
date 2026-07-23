# 📘 My Grammar AI – Chrome Extension

**My Grammar AI** is a simple Chrome extension that improves your writing by correcting grammar, tone, and structure using a local [Ollama](https://ollama.com/) model. Whether you're writing emails, social posts, or reports, this tool helps you sound more natural, concise, and polished — all running locally on your machine.

---

## 🚀 Features

- ✅ Grammar correction
- ✍️ Tone adjustments (more casual or formal)
- 📏 Length control (shorter/longer output)
- 📝 Format options (plain text or markdown)
- 🧠 Enhanced clarity and readability
- 📋 One-click copy to clipboard
- 🔒 Runs locally via Ollama — no cloud API keys required

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

<img width="378" alt="image" src="https://github.com/user-attachments/assets/efbc4c5e-32a5-4d7e-b555-938755e2ac27" />
