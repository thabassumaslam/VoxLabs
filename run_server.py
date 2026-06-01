#!/usr/bin/env python
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    print("=" * 60)
    print("Starting KittenTTS Backend Server")
    print("=" * 60)
    
    # Import after adding to path
    from api.server import app
    import uvicorn

    print("\n[OK] Successfully imported FastAPI app")
    print("[OK] Starting uvicorn server on 127.0.0.1:8000\n")
    
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
    
except Exception as e:
    print(f"\n[ERROR] FATAL ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
