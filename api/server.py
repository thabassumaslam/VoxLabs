from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import io
import os
import threading
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model cache
models = {}
default_model = None
model_loaded = False
model_loading = False
load_error = None

DEFAULT_MODEL_PATH = "KittenML/kitten-tts-nano-0.8"


def load_models():
    """Load the TTS model. Runs in a background thread so the HTTP server
    can bind to its port immediately and answer /health while loading."""
    global models, default_model, model_loaded, model_loading, load_error

    model_loading = True
    print("\n" + "=" * 70)
    print("LOADING KITTENTTS MODEL (background thread)")
    print("=" * 70)
    sys.stdout.flush()

    try:
        print("[IMPORT] Importing KittenTTS library...")
        sys.stdout.flush()
        from kittentts import KittenTTS
        import soundfile as sf  # noqa: F401  (validate availability early)
        print("[IMPORT] [OK] KittenTTS imported")
        sys.stdout.flush()
    except ImportError as e:
        load_error = f"Import failed: {e}"
        print(f"[ERROR] {load_error}")
        sys.stdout.flush()
        model_loading = False
        return

    try:
        t0 = time.time()
        print(f"[MODEL] Loading {DEFAULT_MODEL_PATH} ...")
        sys.stdout.flush()

        model = KittenTTS(DEFAULT_MODEL_PATH)
        models[DEFAULT_MODEL_PATH] = model
        default_model = model
        model_loaded = True

        print(f"[MODEL] [OK] Loaded in {time.time() - t0:.1f}s")
        sys.stdout.flush()
    except Exception as e:
        load_error = f"Model load failed: {e}"
        print(f"[ERROR] {load_error}")
        import traceback
        traceback.print_exc()
        sys.stdout.flush()
    finally:
        model_loading = False


@app.on_event("startup")
def start_background_load():
    print("\n[INIT] Server is up. Starting model load in background...")
    sys.stdout.flush()
    threading.Thread(target=load_models, daemon=True).start()


class TTSRequest(BaseModel):
    text: str
    voice: str = "Jasper"
    model: str = DEFAULT_MODEL_PATH
    speed: float = 1.0
    clean_text: bool = True
    format: str = "wav"  # "wav" or "mp3"


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_ready": model_loaded,
        "model_loading": model_loading,
        "error": load_error,
        "available_models": list(models.keys()),
    }


def convert_wav_to_mp3(wav_buffer):
    from pydub import AudioSegment

    wav_buffer.seek(0)
    audio = AudioSegment.from_wav(wav_buffer)

    mp3_buffer = io.BytesIO()
    audio.export(mp3_buffer, format="mp3", bitrate="128k")
    mp3_buffer.seek(0)
    return mp3_buffer.read()


@app.post("/api/synthesize")
async def synthesize(req: TTSRequest):
    try:
        if not model_loaded or not default_model:
            if model_loading:
                raise Exception("Model is still loading, please wait a moment...")
            raise Exception(load_error or "Model not loaded - check backend logs")

        print(f"[REQUEST] '{req.text[:40]}' voice={req.voice} speed={req.speed}x fmt={req.format}")
        sys.stdout.flush()

        model = models.get(req.model, default_model)

        audio = model.generate(req.text, voice=req.voice, speed=req.speed)

        import soundfile as sf

        wav_buffer = io.BytesIO()
        sf.write(wav_buffer, audio, 24000, format="WAV")
        wav_buffer.seek(0)

        if req.format.lower() == "mp3":
            audio_data = convert_wav_to_mp3(wav_buffer)
            return Response(content=audio_data, media_type="audio/mpeg")

        return Response(content=wav_buffer.read(), media_type="audio/wav")

    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(f"[FAIL] {error_msg}")
        sys.stdout.flush()
        return Response(content=error_msg, status_code=500, media_type="text/plain")


print("[BOOT] FastAPI module loaded - uvicorn will bind the port now")
sys.stdout.flush()
