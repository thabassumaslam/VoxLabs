# VoxLabs

A professional-grade voice synthesis application built with FastAPI backend and Electron frontend. VoxLabs provides real-time audio visualization, multiple voice options, and seamless audio export capabilities.

## Features

- Real-time frequency spectrum visualization with 128-band analysis
- Multiple voice synthesis engines with customizable tone options
- Adjustable speech speed control (0.5x to 2.0x)
- Dual audio format export (WAV for lossless, MP3 for compressed)
- Modern UI with dark/light mode support
- Cross-platform support (Windows, macOS, Linux)
- Local processing with no external API dependencies

## System Requirements

- **OS**: Windows 10+, macOS 10.13+, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 14.0 or higher
- **RAM**: 4GB minimum (8GB+ recommended for smooth operation)
- **Storage**: 2GB free space for machine learning models
- **FFmpeg**: Required for MP3 export functionality

## Installation

### Step 1: Clone Repository and Install Python Dependencies

```powershell
# Install Python dependencies
pip install -r requirements.txt
```

On Linux/macOS:
```bash
pip3 install -r requirements.txt
```

### Step 2: Install Node Dependencies

```powershell
npm install
```

### Step 3: Install FFmpeg

FFmpeg is required for MP3 audio conversion. Choose your installation method:

#### Windows via Chocolatey (Recommended)

```powershell
# Run PowerShell as Administrator
choco install ffmpeg
```

#### Windows Manual Installation

1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to a folder (example: `C:\ffmpeg`)
3. Add to System PATH:
   - Press Windows Key + X, select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "Path" and select "Edit"
   - Click "New" and add `C:\ffmpeg\bin`
   - Click "OK" to save
4. Restart PowerShell and verify:
   ```powershell
   ffmpeg -version
   ```

#### macOS

```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### Step 4: Verify Installation

Confirm all components are properly installed:

```powershell
# Check Python
python --version

# Check Node
node --version
npm --version

# Check FFmpeg
ffmpeg -version
```

## Running the Application

### Option 1: Launch Electron App (Recommended)

```powershell
npm start
```

This command will:
- Automatically start the Python FastAPI backend
- Launch the Electron desktop application
- Enable developer tools for debugging
- Automatically open the UI in the window

### Option 2: Manual Backend Start

If you prefer to run the backend separately:

```powershell
python run_server.py
```

The API will be available at `http://localhost:8000`

To access the UI, open a web browser and navigate to `http://localhost:8000`

## Usage Guide

### Basic Workflow

1. **Enter Text**
   - Type or paste text in the input field
   - Enable text normalization for automatic number/date handling

2. **Configure Settings**
   - Select voice by clicking on a voice card
   - Choose model architecture (Nano, Micro, or Mini)
   - Adjust speech speed with the slider (0.5x to 2.0x)

3. **Generate Audio**
   - Click the "Generate Audio" button
   - Wait for synthesis to complete (time depends on text length and model)

4. **Preview and Download**
   - Watch the real-time frequency spectrum visualization
   - Use playback controls to preview generated audio
   - Click "WAV Format" for lossless audio export
   - Click "MP3 Format" for compressed audio export (192 kbps)

5. **Toggle Theme**
   - Click the theme toggle icon in the header for dark/light mode

### Keyboard Shortcuts

- **Space**: Play/Pause audio
- **Click progress bar**: Seek to position in audio
- **Esc**: Close application (Electron mode only)

## Project Structure

```
VoxLabs/
├── main.js                      # Electron application launcher
├── run_server.py               # FastAPI server startup script
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── package-lock.json           # Node.js dependency lock file
├── LICENSE                     # Project license
├── README.md                   # This file
├── SETUP_GUIDE.md              # Detailed setup documentation
├── api/
│   ├── server.py              # FastAPI backend with TTS synthesis
│   └── __pycache__/           # Python cache (auto-generated)
├── ui/
│   ├── index.html             # Main UI interface
│   ├── renderer.js            # UI interaction logic
│   └── style.css              # UI styling
└── venv/                       # Python virtual environment (created after first run)
```

## Configuration

### Backend Configuration

Default settings in `api/server.py`:
- **Server Host**: 127.0.0.1
- **Server Port**: 8000
- **TTS Model**: KittenML/kitten-tts-mini-0.8
- **Audio Sample Rate**: 24000 Hz
- **MP3 Bitrate**: 192 kbps

### Frontend Configuration

Default settings in `ui/index.html`:
- **API Endpoint**: http://localhost:8000/api/synthesize
- **Canvas Resolution**: 100% width × 200px height
- **Visualization Update Frequency**: 60 FPS

## Dependencies

### Python Dependencies

- **fastapi** (>=0.109.0): Web framework for API
- **uvicorn** (>=0.27.0): ASGI server
- **soundfile** (>=0.12.1): WAV file writing
- **pydantic** (>=2.8.0): Data validation
- **python-multipart** (>=0.0.6): Form data parsing
- **pydub** (>=0.25.1): Audio format conversion
- **audioop-lts** (>=0.2.1): Audio operations

### Node.js Dependencies

- **electron**: Desktop application framework

## Troubleshooting

### Backend fails to start

**Problem**: Error message "Backend failed to start"

**Solution**:
1. Verify Python is installed: `python --version`
2. Check if port 8000 is available
3. Run backend manually to see error logs:
   ```powershell
   python run_server.py
   ```
4. Install KittenTTS if missing:
   ```powershell
   pip install git+https://github.com/KittenML/KittenTTS.git
   ```

### MP3 export fails

**Problem**: "MP3 conversion failed" error

**Solution**:
1. Verify FFmpeg is installed: `ffmpeg -version`
2. Ensure FFmpeg is in system PATH
3. Restart the application after installing FFmpeg
4. On Windows, manually verify PATH contains FFmpeg bin folder

### No audio visualization

**Problem**: Visualization bars don't appear when playing audio

**Solution**:
1. Open browser console (F12) to check for errors
2. Verify browser audio permissions are granted
3. Ensure audio file has been loaded before playback
4. Try generating audio again

### Model fails to load

**Problem**: "Model failed to load" or slow initial startup

**Solution**:
1. First model load takes 30-60 seconds - this is normal
2. Verify internet connection for model download
3. Install KittenTTS manually:
   ```powershell
   pip install git+https://github.com/KittenML/KittenTTS.git
   ```
4. Check system RAM availability

## Development Notes

### Audio Processing Pipeline

1. Text input is sent to KittenTTS model
2. Model generates PCM audio at 24kHz sample rate
3. PCM data is written to WAV file using soundfile
4. For MP3 export, WAV is converted using pydub and FFmpeg

### Visualization Pipeline

1. Audio element streams data to Web Audio API
2. AnalyserNode extracts frequency domain data
3. Canvas renders 128 frequency bars with gradient coloring
4. Updates at 60 FPS synchronous with audio playback

### File Download Process

1. Generate Blob from synthesized audio data
2. Create Object URL from Blob
3. Create temporary link element and trigger click
4. Revoke Object URL to free memory

## Performance Recommendations

- **Highest Quality**: Use Mini model (80M parameters) - quality priority
- **Real-time Performance**: Use Nano model (15M parameters) - speed priority
- **Balanced Approach**: Use Micro model - balance between quality and speed
- **Large File Exports**: Use MP3 format for smaller file sizes
- **Offline Use**: Download and store MP3 copies locally

## Support and Issues

For bug reports or feature requests:
1. Check application logs in terminal output
2. Verify all dependencies are correctly installed
3. Confirm FFmpeg is properly configured
4. Review error messages in browser console (F12)

## License

See LICENSE file for details.

## Technical Details

### API Endpoints

- **POST /api/synthesize**: Generate audio from text
- **GET /health**: Server health check

### Request/Response Format

Audio synthesis requests require:
- Text content
- Voice selection
- Speed parameter
- Model selection

Response includes synthesized audio in WAV format.

## Version Information

- **Application**: VoxLabs
- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: June 2026
