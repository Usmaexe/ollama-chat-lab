// Initialize Icons
lucide.createIcons();

// Authentication Check
function checkAuthentication() {
    const session = localStorage.getItem('session') || sessionStorage.getItem('session');
    if (!session) {
        window.location.href = 'auth.html';
        return null;
    }
    
    try {
        const sessionData = JSON.parse(session);
        // Check if session is still valid
        const maxAge = sessionData.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
        if (Date.now() - sessionData.loginTime > maxAge) {
            // Session expired
            localStorage.removeItem('session');
            sessionStorage.removeItem('session');
            window.location.href = 'auth.html';
            return null;
        }
        return sessionData;
    } catch (e) {
        console.error('Invalid session data');
        window.location.href = 'auth.html';
        return null;
    }
}

const currentUser = checkAuthentication();
if (!currentUser) {
    // Will redirect, no need to continue
    throw new Error('Not authenticated');
}

const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const modelTrigger = document.getElementById('modelTrigger');
const modelOptions = document.getElementById('modelOptions');
const modelDropdown = document.getElementById('modelDropdown');
const newChatBtn = document.getElementById('newChatBtn');
const historyList = document.getElementById('historyList');
const logoutBtn = document.getElementById('logoutBtn');

// Display User Info
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userEmail').textContent = currentUser.email;

// Logout Handler
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('session');
        sessionStorage.removeItem('session');
        window.location.href = 'auth.html';
    }
});

// Chat History Management (now user-specific)
const storageKey = `chatHistory_${currentUser.userId}`;
let chatHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
let currentChatId = null;
let currentMessages = [];
let selectedModel = 'qwen2.5:0.5b';

// Custom Model Dropdown
modelTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    modelDropdown.classList.toggle('open');
    lucide.createIcons();
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!modelDropdown.contains(e.target)) {
        modelDropdown.classList.remove('open');
    }
});

// Handle model selection
document.querySelectorAll('.model-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const value = option.dataset.value;
        const title = option.querySelector('.model-title').textContent;
        const size = option.querySelector('.model-size').textContent;
        
        selectedModel = value;
        
        // Update trigger text
        modelTrigger.querySelector('.model-name').textContent = `${title} (${size.split(' - ')[0]})`;
        
        // Update active state
        document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Close dropdown
        modelDropdown.classList.remove('open');
        
        lucide.createIcons();
    });
});

// Set initial active state
document.querySelector('.model-option[data-value="qwen2.5:0.5b"]').classList.add('active');

// Helper: Enable/Disable Button based on input
userInput.addEventListener('input', () => {
    sendBtn.disabled = userInput.value.trim() === '';
});

// Initialize History Sidebar
function renderHistory() {
    historyList.innerHTML = '';
    if (chatHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No chat history yet</div>';
        return;
    }
    
    chatHistory.forEach((chat) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        if (chat.id === currentChatId) {
            div.classList.add('active');
        }
        
        div.innerHTML = `
            <i data-lucide="message-square"></i>
            <span class="history-title">${chat.title}</span>
            <button class="delete-chat-btn" data-id="${chat.id}">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-chat-btn')) {
                loadChat(chat.id);
            }
        });
        
        const deleteBtn = div.querySelector('.delete-chat-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });
        
        historyList.appendChild(div);
    });
    
    lucide.createIcons();
}

function saveCurrentChat() {
    if (currentMessages.length === 0) return;
    
    const chatIndex = chatHistory.findIndex(c => c.id === currentChatId);
    const firstUserMessage = currentMessages.find(m => m.sender === 'user')?.text || 'New Chat';
    const title = firstUserMessage.slice(0, 30) + (firstUserMessage.length > 30 ? '...' : '');
    
    const chatData = {
        id: currentChatId,
        title,
        messages: currentMessages,
        timestamp: Date.now()
    };
    
    if (chatIndex >= 0) {
        chatHistory[chatIndex] = chatData;
    } else {
        chatHistory.unshift(chatData);
    }
    
    // Keep only last 50 chats
    if (chatHistory.length > 50) {
        chatHistory = chatHistory.slice(0, 50);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(chatHistory));
    renderHistory();
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chat.id;
    currentMessages = chat.messages;
    
    // Clear and render messages
    chatContainer.innerHTML = '';
    chat.messages.forEach(msg => {
        addMessage(msg.text, msg.sender, false);
    });
    
    renderHistory();
    document.getElementById('chatTitle').textContent = chat.title;
}

function deleteChat(chatId) {
    if (confirm('Delete this chat?')) {
        chatHistory = chatHistory.filter(c => c.id !== chatId);
        localStorage.setItem(storageKey, JSON.stringify(chatHistory));
        
        if (currentChatId === chatId) {
            startNewChat();
        } else {
            renderHistory();
        }
    }
}

function startNewChat() {
    currentChatId = Date.now().toString();
    currentMessages = [];
    
    chatContainer.innerHTML = `
        <div class="welcome-screen">
            <div class="logo">
                <i data-lucide="bot" size="48"></i>
            </div>
            <h1>How can I help you today?</h1>
        </div>
    `;
    
    document.getElementById('chatTitle').textContent = 'New Conversation';
    lucide.createIcons();
    renderHistory();
}

// Helper: Auto-resize textarea (if you change input to textarea later)
// Current is input type="text", which is simple.

// 1. Handle Submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Clear input
    userInput.value = '';
    sendBtn.disabled = true;

    // Remove Welcome Screen if exists
    const welcome = document.querySelector('.welcome-screen');
    if (welcome) welcome.remove();

    // Add User Message
    addMessage(message, 'user');
    currentMessages.push({ text: message, sender: 'user' });

    // Create AI Placeholder
    const aiMessageDiv = addMessage('Thinking...', 'ai');
    const aiContentDiv = aiMessageDiv.querySelector('.message-content');
    aiContentDiv.innerHTML = ''; // Clear "Thinking..."

    // Fetch Stream
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                model: selectedModel 
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            
            // Ollama sends JSON objects in the stream. We need to parse them.
            // Note: raw stream from Ollama often comes as multiple JSON objects glued together
            // We'll do a simple regex fix for this demo or just split by newline
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (!line) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        fullText += json.response;
                        // Render Markdown
                        aiContentDiv.innerHTML = marked.parse(fullText);
                        // Highlight Code Blocks
                        aiContentDiv.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });
                        // Auto scroll
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                } catch (e) {
                    console.error("Error parsing JSON chunk", e);
                }
            }
        }
        
        // Save chat after AI response completes
        currentMessages.push({ text: fullText, sender: 'ai' });
        saveCurrentChat();

    } catch (err) {
        aiContentDiv.innerText = 'Error: ' + err.message;
    } finally {
        sendBtn.disabled = false;
    }
});

function addMessage(text, sender, shouldScroll = true) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    
    const iconName = sender === 'user' ? 'user' : 'bot';
    
    div.innerHTML = `
        <div class="avatar">
            <i data-lucide="${iconName}"></i>
        </div>
        <div class="message-content markdown-body">
            ${sender === 'user' ? text : ''} 
        </div>
    `;
    
    chatContainer.appendChild(div);
    lucide.createIcons(); // Refresh icons for new elements
    if (shouldScroll) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    return div;
}

newChatBtn.addEventListener('click', () => {
    startNewChat();
});

// Initialize on load
renderHistory();
if (chatHistory.length > 0 && !currentChatId) {
    // Optionally load the most recent chat
    // loadChat(chatHistory[0].id);
} else if (!currentChatId) {
    startNewChat();
}