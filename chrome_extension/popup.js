document.addEventListener('DOMContentLoaded', async () => {
    const ingestBtn = document.getElementById('ingestBtn');
    const askBtn = document.getElementById('askBtn');
    const videoIdInput = document.getElementById('videoIdInput');
    const questionInput = document.getElementById('questionInput');
    const chatHistory = document.getElementById('chatHistory');
    const toastContainer = document.getElementById('toastContainer');
    const connectionStatus = document.getElementById('connectionStatus');
    const notesBtn = document.getElementById('notesBtn');
    const pptBtn = document.getElementById('pptBtn');

    let sessionId = `s_${Date.now()}`;
    const API = 'http://localhost:3001';

    const parseYouTubeId = (text) => {
        const match = text.match(/(?:v=|\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : (text.length === 11 ? text : null);
    };

    const addMsg = (text, user = false) => {
        // Remove welcome message
        chatHistory.querySelector('.welcome-message')?.remove();

        const div = document.createElement('div');
        div.className = `message ${user ? 'user' : 'ai'}`;

        let content;
        if (user) {
            content = text; // User text stays plain
        } else {
            // Parse Markdown for AI messages
            if (typeof marked !== 'undefined') {
                content = marked.parse(text);
            } else {
                content = text;
            }
        }

        div.innerHTML = `
        <div class="message-avatar">${user ? '🧑' : '🤖'}</div>
        <div class="message-content ${!user ? 'markdown-content' : ''}">${content}</div>
    `;

        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const toast = (msg, type = 'info') => {
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<span>${msg}</span>`;
        toastContainer.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    };

    const ingestVideo = async (videoId) => {
        ingestBtn.classList.add('loading');
        try {
            const res = await fetch(`${API}/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video_id: videoId })
            });
            if (!res.ok) throw new Error('Ingest failed');
            toast('Video indexed!', 'success');
            addMsg("✅ Video ingested! Ask me anything.", false);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            ingestBtn.classList.remove('loading');
        }
    };

    // ==== Auto-inject video ID from YouTube tab ====
    if (chrome?.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url;
            const videoId = parseYouTubeId(url);
            if (videoId) {
                videoIdInput.value = videoId;
                ingestVideo(videoId);
            }
        });
    }

    const ask = async () => {
        const q = questionInput.value.trim();
        if (!q) return;
        addMsg(q, true);
        questionInput.value = '';

        const typing = document.createElement('div');
        typing.className = 'message ai';
        typing.innerHTML = `<div class="message-avatar">🤖</div><div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatHistory.appendChild(typing);

        try {
            const res = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, question: q })
            });
            const data = await res.json();
            typing.remove();
            if (res.ok) addMsg(data.answer, false);
            else addMsg("I need data! Please ingest a video first.", false);
        } catch (e) {
            typing.remove();
            addMsg("Error connecting to server.", false);
        }
    };

    askBtn.onclick = ask;
    questionInput.onkeypress = (e) => { if (e.key === 'Enter') ask(); };

    // Connection Check
    fetch(`${API}/health`).then(() => {
        connectionStatus.innerHTML = '<span class="status-dot" style="background:var(--success)"></span><span>Online</span>';
        questionInput.disabled = false;
        askBtn.disabled = false;
    }).catch(() => { });
});

const downloadNotes = async () => {
    const videoId = parseYouTubeId(videoIdInput.value);
    if (!videoId) {
        toast("No video detected", "error");
        return;
    }

    try {
        const res = await fetch(`${API}/generate-notes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ video_id: videoId })
        });

        if (!res.ok) throw new Error("Failed to generate notes");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "video-notes.pdf";
        a.click();

        URL.revokeObjectURL(url);
        toast("Notes downloaded!", "success");

    } catch(e) {
        toast(e.message, "error");
    }
};


const downloadPPT = async () => {
    const videoId = parseYouTubeId(videoIdInput.value);
    if (!videoId) {
        toast("No video detected", "error");
        return;
    }

    try {
        const res = await fetch(`${API}/generate-ppt`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ video_id: videoId })
        });

        if (!res.ok) throw new Error("Failed to generate PPT");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "video-presentation.pptx";
        a.click();

        URL.revokeObjectURL(url);
        toast("PPT downloaded!", "success");

    } catch(e) {
        toast(e.message, "error");
    }
};

notesBtn.onclick = downloadNotes;
pptBtn.onclick = downloadPPT;

fetch(`${API}/health`).then(() => {
    connectionStatus.innerHTML =
    '<span class="status-dot" style="background:var(--success)"></span><span>Online</span>';

    questionInput.disabled = false;
    askBtn.disabled = false;

    notesBtn.disabled = false;
    pptBtn.disabled = false;
}).catch(() => {});