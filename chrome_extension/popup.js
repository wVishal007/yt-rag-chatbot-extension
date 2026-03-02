document.addEventListener('DOMContentLoaded', () => {
  const ingestBtn = document.getElementById('ingestBtn');
  const askBtn = document.getElementById('askBtn');
  const questionInput = document.getElementById('questionInput');
  const chatHistory = document.getElementById('chatHistory');
  const toastContainer = document.getElementById('toastContainer');
  
  let sessionId = `s_${Date.now()}`, ingested = false;
  const API = 'http://localhost:3001';

  // 🎀 Utilities
  const toast = (msg, type='info') => {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span>`;
    toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  const addMsg = (text, user=false, sources=[]) => {
    chatHistory.querySelector('.welcome-message')?.remove();
    const div = document.createElement('div');
    div.className = `message ${user?'user':'ai'}`;
    div.innerHTML = `
      <div class="message-avatar">${user?'🧑':'🤖'}</div>
      <div class="message-content">${text}
        ${!user && sources.length ? `<div class="message-sources">${sources.slice(0,2).map((s,i)=>`<a href="#">[${i+1}]</a>`).join(' ')}</div>`:''}
        ${!user ? '<button class="copy-btn">📋</button>' : ''}
      </div>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    div.querySelector('.copy-btn')?.addEventListener('click', async () => {
      await navigator.clipboard.writeText(text);
      toast('Copied!', 'success');
    });
  };

  const showTyping = () => {
    const el = document.createElement('div');
    el.id = 'typing';
    el.className = 'message ai';
    el.innerHTML = `<div class="message-avatar">🤖</div><div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatHistory.appendChild(el);
    return el;
  };

  // 🎬 Auto-extract video ID from current tab
  const getVideoId = async () => {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      const url = tab.url || '';
      const match = url.match(/(?:v=|\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    } catch { return null; }
  };

  // 📥 Ingest
  const ingest = async () => {
    const videoId = await getVideoId();
    if (!videoId) return toast('Open a YouTube video first', 'warning');
    
    ingestBtn.classList.add('loading'); ingestBtn.disabled = true;
    try {
      const res = await fetch(`${API}/ingest`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({video_id: videoId})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed');
      
      ingested = true;
      questionInput.disabled = false; askBtn.disabled = false;
      toast(`✓ ${data.chunks} chunks indexed`, 'success');
      addMsg(`_Ready!_ Asked about **${data.chunks}** segments. 🎬`, false);
    } catch(e) {
      toast(e.message, 'error');
    } finally {
      ingestBtn.classList.remove('loading'); ingestBtn.disabled = false;
    }
  };

  // 💬 Ask
  const ask = async () => {
    const q = questionInput.value.trim();
    if (!q || !ingested) return;
    
    addMsg(q, true);
    questionInput.value = '';
    const typing = showTyping();
    askBtn.disabled = true; questionInput.disabled = true;

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id: sessionId, question: q})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error');
      
      typing.remove();
      addMsg(data.answer, false, data.sources || []);
    } catch(e) {
      typing.remove();
      addMsg(`Error: ${e.message} 😅`, false);
      toast('Request failed', 'error');
    } finally {
      askBtn.disabled = false; questionInput.disabled = false; questionInput.focus();
    }
  };

  // 🎀 Events
  ingestBtn.onclick = ingest;
  askBtn.onclick = ask;
  questionInput.onkeypress = (e) => e.key === 'Enter' && ask();
  
  // Init
  (async () => {
    try {
      await fetch(`${API}/health`);
      document.getElementById('connectionStatus').innerHTML = '<span class="status-dot"></span><span>Connected</span>';
    } catch {
      toast('Backend offline', 'warning');
    }
  })();
});