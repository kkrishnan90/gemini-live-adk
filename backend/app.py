import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv(override=True)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from session_manager import SessionManager

app = FastAPI(title="Nomad: The Dreamstream Planner")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("DEBUG: WebSocket connection accepted")
    
    manager = SessionManager(websocket)
    try:
        await manager.start()
    except WebSocketDisconnect:
        print("DEBUG: WebSocket disconnected")
    except Exception as e:
        print(f"ERROR: WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
