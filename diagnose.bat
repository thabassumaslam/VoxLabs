@echo off
echo.
echo ========================================
echo KITTEN TTS - DIAGNOSTIC CHECK
echo ========================================
echo.

echo [1/5] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)

echo.
echo [2/5] Checking venv...
if exist venv\Scripts\python.exe (
    echo OK: venv found
) else (
    echo ERROR: venv not found! Run: python -m venv venv
    pause
    exit /b 1
)

echo.
echo [3/5] Checking KittenTTS installation...
venv\Scripts\python -c "import kittentts; print('OK: KittenTTS installed')" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: KittenTTS not installed!
    echo Installing now...
    venv\Scripts\pip install git+https://github.com/KittenML/KittenTTS.git
    if %errorlevel% neq 0 (
        echo Installation failed!
        pause
        exit /b 1
    )
)

echo.
echo [4/5] Checking FastAPI...
venv\Scripts\python -c "import fastapi, uvicorn; print('OK: FastAPI and uvicorn installed')" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: FastAPI/uvicorn not installed!
    echo Installing now...
    venv\Scripts\pip install fastapi uvicorn
)

echo.
echo [5/5] Testing backend server start...
echo Starting server for 5 seconds...
timeout /t 2 /nobreak >nul
venv\Scripts\python run_server.py >server_test.log 2>&1 &
set SERVER_PID=%errorlevel%
timeout /t 5 /nobreak >nul
taskkill /PID %SERVER_PID% /F 2>nul

echo.
echo Server output:
type server_test.log
del server_test.log

echo.
echo ========================================
echo DIAGNOSTIC COMPLETE
echo ========================================
echo.
pause
