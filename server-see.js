const form = document.getElementById('msgForm');
const chat = document.getElementById('chat');
const input = document.getElementById('msg');

function addBubble(text, cls = 'user') {
  const el = document.createElement('div');
  el.className = 'bubble ' + cls;
  el.innerText = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight; // Auto-scroll to bottom
  return el;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  input.disabled = true;
  
  // Add user message
  addBubble(text, 'user');
  
  // Add empty assistant bubble
  const assistantBubble = addBubble('', 'assistant');
  
  try {
    const r = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split('\n\n');
      
      while (parts.length > 1) {
        const ev = parts.shift();
        const lines = ev.split('\n');
        const dataLine = lines.find(l => l.startsWith('data:'));
        
        if (dataLine) {
          const data = dataLine.replace('data: ', '').trim();
          
          if (data === '[DONE]') {
            break;
          }
          
          try {
            const json = JSON.parse(data);
            if (json.response) {
              assistantBubble.innerText += json.response;
              chat.scrollTop = chat.scrollHeight;
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
      
      buf = parts[0];
    }
  } catch (err) {
    assistantBubble.innerText = 'Error: ' + err.message;
    assistantBubble.classList.add('error');
  } finally {
    input.disabled = false;
    input.focus();
  }
});