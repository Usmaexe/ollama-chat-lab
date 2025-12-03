# 🤖 Ollama Chat Lab

A local AI chat application with authentication, streaming responses, and conversation history.

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Ollama** installed and running - [Download here](https://ollama.com/)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Usmaexe/ollama-chat-lab.git
cd ollama-chat-lab
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start Ollama Service
Make sure Ollama is running on your system:
```bash
ollama serve
```

#### 4. Pull an AI Model
Download at least one model (recommended: gemma2:9b):
```bash
ollama pull gemma2:9b
```

Other available models:
```bash
ollama pull llama3.2:3b
ollama pull qwen2.5:7b
ollama pull mistral:7b
```

#### 5. Start the Application
```bash
npm start
```

#### 6. Open in Browser
Navigate to:
```
http://localhost:3000
```

You'll be redirected to the authentication page. Create an account to start chatting!

## 🐛 Troubleshooting

### Ollama not responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama service
ollama serve
```

### Model not found error
```bash
# List installed models
ollama list

# Pull the missing model
ollama pull gemma2:9b
```

### Port 3000 already in use
Edit `server.js` and change the port:
```javascript
const PORT = 3001; // Change to any available port
```

Then run: `npm start`

## 📁 Project Structure

```
ollama-chat-lab/
├── server.js              # Express backend server
├── public/
│   ├── index.html        # Main chat interface
│   ├── script.js         # Chat functionality
│   ├── styles.css        # Main styles
│   ├── auth.html         # Login/Signup page
│   ├── auth.js           # Authentication logic
│   └── auth.css          # Auth page styles
├── package.json          # Dependencies
└── README.md            # This file
```

## 📝 Default Login (Optional)

For testing, you can create an account with any email/password combination. Data is stored locally in your browser.

---

**Note:** All data (users, chats, sessions) is stored locally in your browser's localStorage. No data is sent to external servers.
