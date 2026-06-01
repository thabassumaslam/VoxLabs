async function waitForServer() {
    const maxRetries = 20;
    let retries = 0;
    const baseUrl = 'http://localhost:8000';

    console.log(`%c>>> Connecting to backend at ${baseUrl}...`, 'color: blue; font-weight: bold');

    while (retries < maxRetries) {
        try {
            const response = await fetch(`${baseUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('%c✓ Backend connected!', 'color: green; font-weight: bold', data);
                return true;
            }
        } catch (error) {
            // Not ready yet
        }
        retries++;
        if (retries % 5 === 0) {
            console.log(`%cWaiting... (${retries}/${maxRetries})`, 'color: orange');
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error("Backend failed to start. Check that Python server is running.");
}

// Wait for server to be ready when page loads
window.addEventListener('DOMContentLoaded', async () => {
    console.log('%cPage loaded, checking backend...', 'color: blue');
    try {
        await waitForServer();
    } catch (error) {
        console.error('%c✗ ' + error, 'color: red; font-weight: bold');
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.textContent = error.message;
    }
});

async function synthesizeAudio(text, model, voice, speed, cleanText) {
    const payload = {
        text: text,
        model: model,
        voice: voice,
        speed: speed,
        clean_text: cleanText
    };

    console.log("Sending synthesis request:", payload);

    const response = await fetch('http://localhost:8000/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    return await response.blob();
}

// Theme Switch System Configuration
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root = document.documentElement;

const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;

themeToggle.addEventListener('click', () => {
    root.classList.toggle('light-mode');
    const isLight = root.classList.contains('light-mode');
    themeIcon.innerHTML = isLight ? moonIcon : sunIcon;
});

// Voice Card Definitions
const voices = [
    { id: 'Bella', gender: 'Female', tone: 'Warm & Conversational' },
    { id: 'Jasper', gender: 'Male', tone: 'Deep & Authoritative' },
    { id: 'Luna', gender: 'Female', tone: 'Joyful & Energetic' },
    { id: 'Bruno', gender: 'Male', tone: 'Calm & Professional' },
    { id: 'Rosie', gender: 'Female', tone: 'Soft & Soothing' },
    { id: 'Hugo', gender: 'Male', tone: 'Raspy & Expressive' },
    { id: 'Kiki', gender: 'Female', tone: 'Bright & Playful' },
    { id: 'Leo', gender: 'Male', tone: 'Friendly & Upbeat' }
];

let selectedVoice = 'Jasper';
const voiceGrid = document.getElementById('voice-grid');

function renderVoices() {
    voiceGrid.innerHTML = '';
    voices.forEach(voice => {
        const card = document.createElement('div');
        card.className = `voice-card ${voice.id === selectedVoice ? 'active' : ''}`;
        card.onclick = () => {
            selectedVoice = voice.id;
            console.log(`Selected voice: ${selectedVoice}`);
            renderVoices();
        };
        
        card.innerHTML = `
            <div class="voice-header">
                <span class="voice-name">${voice.id}</span>
                <span class="voice-gender">${voice.gender}</span>
            </div>
            <div class="voice-desc">${voice.tone}</div>
        `;
        voiceGrid.appendChild(card);
    });
}

renderVoices();

// Data Binding Integrations
const speedSlider = document.getElementById('speed');
const speedVal = document.getElementById('speed-val');
const generateBtn = document.getElementById('generate-btn');
const errorMsg = document.getElementById('error-msg');
const resultSection = document.getElementById('result-section');
const audioPlayer = document.getElementById('audio-player');
const downloadLink = document.getElementById('download-link');

speedSlider.addEventListener('input', (e) => {
    speedVal.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
});

generateBtn.addEventListener('click', async () => {
    const text = document.getElementById('text').value.trim();
    if (!text) {
        errorMsg.textContent = "Please enter some text to synthesize.";
        return;
    }

    const model = document.getElementById('model').value;
    const speed = parseFloat(speedSlider.value);
    const cleanText = document.getElementById('clean_text').checked;

    generateBtn.disabled = true;
    generateBtn.innerHTML = `Generating...`;
    errorMsg.textContent = "";
    resultSection.style.display = "none";

    console.log(`Generating with: voice=${selectedVoice}, model=${model}, speed=${speed}`);

    try {
        const audioBlob = await synthesizeAudio(text, model, selectedVoice, speed, cleanText);
        const audioUrl = URL.createObjectURL(audioBlob);

        audioPlayer.src = audioUrl;
        downloadLink.href = audioUrl;
        downloadLink.download = `kitten-tts-${Date.now()}.wav`;
        resultSection.style.display = "block";
        
        console.log("✓ Audio generated successfully");
        audioPlayer.play().catch(e => console.log("Autoplay prevented by browser:", e));
        
    } catch (error) {
        console.error("Synthesis error:", error);
        errorMsg.textContent = `Error: ${error.message}`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `Generate Audio`;
    }
});
