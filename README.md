# 🤖 Ollama Chat Lab

A modern, feature-rich chat interface for Ollama AI models with streaming responses, conversation memory, and model selection.

## ✨ Features

### 🎯 Core Features (Distinction Level)

#### 1. **Conversation Memory** ✅
- Full conversation history maintained throughout the session
- Context-aware responses using previous messages
- Persistent storage using localStorage
- Last 10 messages included in context to avoid token limits
- Clear conversation button to start fresh

#### 2. **Model Selection** ✅
- Dynamic model selector dropdown
- Pre-configured popular models:
  - Qwen 2.5 (0.5B) - Default, fast responses
  - Llama 3.2 (1B, 3B) - Balanced performance
  - Phi 3 (3.8B) - Microsoft's efficient model
  - Mistral (7B) - High quality responses
- Easy to add more models

#### 3. **Streaming Output** ✅
- Real-time token-by-token streaming
- Server-Sent Events (SSE) implementation
- Smooth visual feedback with typing indicator
- Auto-scroll to latest message

#### 4. **Modern UI** ✅
- Beautiful gradient design
- Responsive layout
- Animated message bubbles
- Smooth transitions and hover effects
- Custom scrollbar styling
- Emoji support
- Mobile-friendly design

### 🛡️ Security & Performance

#### 5. **Rate Limiting** ✅
- 10 requests per minute per IP address
- Automatic cleanup of old records
- 429 status code with retry-after header
- Protection against abuse

#### 6. **Error Handling** ✅
- Network error handling
- Visual error messages
- Graceful degradation
- Form validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Ollama installed and running locally
- At least one Ollama model pulled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ollama-chat-lab
```

2. Install dependencies:
```bash
npm install
```

3. Make sure Ollama is running:
```bash
ollama serve
```

4. Pull a model (if you haven't already):
```bash
ollama pull qwen2.5:0.5b
```

5. Start the server:
```bash
npm start
```

6. Open your browser to:
```
http://localhost:3000
```

## 📁 Project Structure

```
ollama-chat-lab/
├── server.js           # Express server with streaming & rate limiting
├── public/
│   ├── index.html     # Main HTML with model selector
│   ├── script.js      # Client-side logic with conversation memory
│   └── styles.css     # Modern, responsive styling
├── package.json       # Dependencies
└── README.md         # This file
```

## 🎓 Assessment Criteria Coverage

### ✅ Pass: Non-streaming GUI works
- Functional chat interface
- Message sending and receiving
- Basic UI elements

### ✅ Merit: Streaming output implemented
- Real-time SSE streaming
- Token-by-token display
- Smooth user experience

### ✅ Distinction: All requirements met
- ✅ Conversation memory with context
- ✅ Model selection dropdown
- ✅ Improved modern UI with animations
- ✅ Rate limiting for production readiness

## 🔧 Configuration

### Available Models
Edit `public/index.html` to add more models:
```html
<option value="your-model:tag">Model Name</option>
```

### Rate Limiting
Adjust in `server.js`:
```javascript
const RATE_LIMIT = 10;           // requests per window
const RATE_WINDOW = 60 * 1000;   // time window in ms
```

### Ollama URL
Change in `server.js` if needed:
```javascript
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
```

## 🎨 UI Features

- **Gradient Header**: Purple gradient theme
- **Message Bubbles**: Distinct user (purple) and assistant (white) messages
- **Typing Indicator**: Blinking cursor while AI responds
- **Smooth Animations**: Fade-in effects for new messages
- **Auto-scroll**: Automatically scrolls to latest message
- **Responsive Design**: Works on desktop and mobile
- **Custom Scrollbar**: Styled scrollbar for better aesthetics

## 🔐 Security Features

- Rate limiting to prevent abuse
- Input validation
- Error handling for malformed requests
- CORS enabled for flexibility
- No exposed API keys (local Ollama)

## 🚀 Future Enhancements

### Potential Additions:
- **WebSocket Implementation**: Replace SSE with WebSockets for bidirectional communication
- **Authentication**: User login system
- **Multiple Conversations**: Save and switch between different chats
- **Export Chat**: Download conversation as text/JSON
- **Dark Mode**: Toggle between light and dark themes
- **Voice Input**: Speech-to-text integration
- **Code Highlighting**: Syntax highlighting for code blocks
- **Image Support**: For vision-capable models

## 📝 API Endpoints

### `POST /api/stream`
Stream AI responses in real-time.

**Request:**
```json
{
  "message": "Your question",
  "model": "qwen2.5:0.5b"
}
```

**Response:** Server-Sent Events stream

### `POST /api/chat`
Non-streaming chat endpoint.

### `GET /api/models`
Get list of available Ollama models.

## 🐛 Troubleshooting

### Ollama not responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### Model not found
```bash
# List available models
ollama list

# Pull missing model
ollama pull qwen2.5:0.5b
```

### Port already in use
Change port in `server.js`:
```javascript
app.listen(3001, () => ...
```

## 📄 License

MIT License - feel free to use for educational purposes.

## 👨‍💻 Author

Created for the Ollama Chat Lab assignment - demonstrating full-stack development with modern web technologies.

---

**Status:** ✅ All Distinction criteria implemented and tested
