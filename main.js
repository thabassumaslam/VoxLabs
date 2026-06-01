const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let mainWindow;
let pythonProcess;

function startPythonServer() {
    const pythonVenvPath = process.platform === 'win32'
        ? path.join(__dirname, 'venv', 'Scripts', 'python.exe')
        : path.join(__dirname, 'venv', 'bin', 'python');

    console.log('Starting Python server with:', pythonVenvPath);

    pythonProcess = spawn(pythonVenvPath, ['run_server.py'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUNBUFFERED: '1' }
    });

    pythonProcess.stdout.on('data', d => console.log(`[PYTHON] ${d.toString().trim()}`));
    pythonProcess.stderr.on('data', d => console.log(`[PYTHON] ${d.toString().trim()}`));
    pythonProcess.on('error', err => console.error('[ERROR] Python spawn failed:', err));
    pythonProcess.on('close', code => console.log(`[INFO] Python exited with code ${code}`));
}

// Resolve as soon as the server answers /health at all (server is bound).
// The model may still be loading in the background — the UI handles that.
function waitForServerUp(retries = 40, delay = 500) {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const attempt = () => {
            attempts++;
            const req = http.get('http://127.0.0.1:8000/health', res => {
                res.resume();
                if (res.statusCode === 200) {
                    console.log('[OK] Server is up — opening window');
                    resolve();
                } else {
                    retry();
                }
            });
            req.on('error', retry);
            req.setTimeout(400, () => { req.destroy(); retry(); });
        };

        const retry = () => {
            if (attempts >= retries) reject(new Error('Server did not bind in time'));
            else setTimeout(attempt, delay);
        };

        attempt();
    });
}

const LOADING_HTML = `data:text/html,<html><body style="background:#0a0a0a;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;color:#fff"><div style="text-align:center"><h2 style="font-size:2rem;margin:0 0 .5rem">VoxLabs</h2><p style="color:#666">Starting engine...</p></div></body></html>`;

app.whenReady().then(async () => {
    startPythonServer();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        backgroundColor: '#0a0a0a',
        webPreferences: { nodeIntegration: true, contextIsolation: false }
    });

    mainWindow.loadURL(LOADING_HTML);

    try {
        await waitForServerUp();
        mainWindow.loadFile('ui/index.html');
    } catch (err) {
        console.error('[ERROR]', err.message);
        mainWindow.loadURL(`data:text/html,<html><body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h2 style="color:#ff453a">Backend failed to start</h2><p style="color:#666">Check the terminal logs.</p></div></body></html>`);
    }
});

app.on('will-quit', () => { if (pythonProcess) pythonProcess.kill(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
