# 🐱 Kitten TTS - Complete Setup Guide

## ✨ Features

✅ **Real-time Sound Wave Visualization** - Animated frequency spectrum bars that react to the audio  
✅ **Dual Format Downloads** - Download synthesized audio as WAV or MP3  
✅ **Beautiful UI** - Modern glassmorphism design with dark/light mode toggle  
✅ **Multiple Voices** - 8 different voice options with various tones  
✅ **Speed Control** - Adjust speech pacing from 0.5x to 2.0x  
✅ **Playback Controls** - Play/pause, progress tracking, time display  

---

## 📦 Installation Steps

### 1. **Install Python Dependencies**

```bash
pip install -r requirements.txt
```

### 2. **Install FFmpeg** (Required for MP3 Conversion)

#### Windows (via Chocolatey)
```powershell
# Run PowerShell as Administrator first!
choco install ffmpeg
```

#### Windows (Manual)
1. Download from: https://ffmpeg.org/download.html
2. Extract to folder (e.g., `C:\ffmpeg`)
3. Add to PATH:
   - Windows Key + X → System → Advanced system settings
   - Environment Variables → Path → Edit
   - Add: `C:\ffmpeg\bin`
4. Restart terminal and verify:
```bash
ffmpeg -version
```

#### macOS
```bash
brew install ffmpeg
```

#### Linux
```bash
sudo apt-get install ffmpeg
```

### 3. **Verify Installation**

```bash
ffmpeg -version
```

---

## 🚀 Running the Application

### Option 1: Using Node.js (Electron App)
```bash
npm start
```
This will:
- Launch the Python FastAPI backend automatically
- Open the Electron desktop app with the UI
- Enable DevTools for debugging

### Option 2: Manual Backend Start
```bash
python run_server.py
```
Then access the UI at: `http://localhost:8000`

---

## 📝 How to Use

### 1. **Enter Text**
   - Type or paste text in the input field
   - Use the text normalization checkbox for automatic number/date handling

### 2. **Select Settings**
   - **Voice**: Click any voice card to select (8 options)
   - **Model**: Choose between Nano, Micro, Mini architectures
   - **Speed**: Use the slider to adjust speech pacing (0.5x - 2.0x)

### 3. **Generate Audio**
   - Click "Generate Audio" button
   - Wait for synthesis to complete

### 4. **Preview & Download**
   - **Visualizer**: Watch the real-time frequency spectrum animation
   - **Playback Controls**: 
     - Click play button to start playback
     - Track progress with the progress bar
     - See current/total time in the display
   - **Download**:
     - Click "WAV Format" for lossless audio
     - Click "MP3 Format" for compressed audio (192 kbps)

### 5. **Toggle Theme**
   - Click the sun/moon icon in the header for dark/light mode

---

## 🎨 Visual Features

### Sound Wave Visualization
- **Frequency Bars**: 128 colorful bars representing audio frequency spectrum
- **Gradient Colors**: Bars change color based on frequency (red → green → blue)
- **Glow Effect**: Subtle glow around active bars for enhanced visuals
- **Real-time Response**: Updates 60 FPS to audio playback
- **Dynamic Height**: Bar heights increase/decrease based on tone intensity

### Playback Controls
- **Play/Pause Button**: Large, centered circular button
- **Progress Bar**: Click anywhere to seek
- **Time Display**: Shows current time / total duration
- **Auto-updates**: Displays adjust in real-time

---

## 🔧 Configuration

### Backend (api/server.py)
- **Host**: 127.0.0.1
- **Port**: 8000
- **Model**: KittenML/kitten-tts-mini-0.8 (default)
- **Sample Rate**: 24000 Hz
- **MP3 Bitrate**: 192 kbps

### Frontend (ui/index.html)
- **API Endpoint**: http://localhost:8000/api/synthesize
- **Canvas Resolution**: 100% width × 200px height
- **Update Frequency**: 60 FPS (requestAnimationFrame)

---

## 📊 File Structure

```
kitten/
├── main.js                 # Electron app launcher
├── run_server.py          # FastAPI server starter
├── requirements.txt       # Python dependencies
├── package.json           # Node dependencies
├── api/
│   └── server.py          # FastAPI backend with TTS synthesis
├── ui/
│   └── index.html         # Complete UI with visualizer
└── venv/                  # Python virtual environment
```

---

## 🐛 Troubleshooting

### Issue: "Backend failed to start"
**Solution**: 
- Ensure Python is installed and in PATH
- Check if port 8000 is available
- Run: `python run_server.py` manually to see error logs

### Issue: "MP3 conversion failed"
**Solution**:
- Install FFmpeg (see Installation section)
- Verify: `ffmpeg -version` works in terminal
- Restart the application

### Issue: "No audio from visualizer"
**Solution**:
- Allow microphone/audio permissions in browser
- Check browser console for errors (F12)
- Ensure audio player has audio loaded before playing

### Issue: "Model failed to load"
**Solution**:
- Install KittenTTS: `pip install git+https://github.com/KittenML/KittenTTS.git`
- First model load takes 30-60 seconds
- Check internet connection for model download

---

## 🎯 Keyboard Shortcuts

- **Space**: Play/Pause (when in app)
- **Click progress bar**: Seek to position
- **Esc**: Close app (Electron)

---

## 💡 Tips & Tricks

1. **Best Voice Quality**: Use the Mini model (80M) - highest quality
2. **Fastest Synthesis**: Use the Nano model (15M) - real-time capable
3. **Large Downloads**: Use MP3 format (smaller file size)
4. **Offline Use**: Download and keep MP3 copies
5. **Dark Mode**: Better for eyes during night use

---

## 📋 System Requirements

- **OS**: Windows 10+, macOS 10.13+, Linux
- **Python**: 3.8+
- **Node.js**: 14+ (for Electron app)
- **RAM**: 4GB minimum, 8GB+ recommended
- **Storage**: 2GB free space (for ML models)
- **FFmpeg**: Required for MP3 export

---

## 📄 Dependencies

See `requirements.txt` for complete list:
- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **pydub**: Audio format conversion
- **soundfile**: WAV file handling
- **pydantic**: Data validation
- **kittentts**: TTS synthesis engine

---

## 🎓 Technical Details

### Audio Pipeline
1. Text → KittenTTS Model → PCM Audio (24kHz)
2. PCM → Soundfile → WAV Buffer
3. WAV → Pydub → MP3 (if requested)

### Visualization Pipeline
1. Audio Element → Web Audio API
2. AnalyserNode → Frequency Data
3. Canvas → Render Bars with Gradients

### File Download
1. Blob Creation → Object URL
2. Dynamic Link Creation
3. Programmatic Click → Auto-download
4. URL Revocation → Memory cleanup

---

## 🤝 Support

For issues:
1. Check terminal logs for error messages
2. Verify all dependencies are installed
3. Ensure FFmpeg is properly installed
4. Check internet connection for model downloads

---

## 📝 Version Info

- **App**: Kitten TTS Studio
- **Version**: 1.0.0
- **Last Updated**: 2024
- **Status**: Production Ready

---

Enjoy your audio synthesis! 🎉
