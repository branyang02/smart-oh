import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from src.auth.auth import authenticate_websocket
from src.websocket.state import TBoard, TCard
from src.websocket.websocket_manager import OfficeHourManager

# Load environment variables
load_dotenv()

logger = logging.getLogger("uvicorn.error")

# Load configuration from environment variables
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
ENV = os.getenv("ENV", "development")


@asynccontextmanager
async def lifespan(app: FastAPI):
    manager.cleanup_task = asyncio.create_task(
        manager.cleanup_empty_columns()
    )  # Start background task for cleaning up empty columns
    yield
    print("Shutting down websocket server...")
    manager.cleanup_task.cancel()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = OfficeHourManager(dev=ENV == "development")


@app.get("/")
async def home_endpoint():
    return {"message": "The webSocket server is running and ready to connect!"}


@app.websocket("/ws/{class_id}")
async def websocket_endpoint(websocket: WebSocket, class_id: str):
    logger.info(f"WebSocket connection for class: {class_id}")
    try:
        auth = await authenticate_websocket(websocket, class_id)
        if auth is None:
            return

        user, role = auth
        await websocket.accept()
        manager.add_connection(class_id, websocket)

        # Get or create the board for this class and add the user if not already present
        board = manager.get_or_create_room(class_id)
        if not any(c.user.id == user.id for c in board.allUsers):
            board.allUsers.append(TCard(user=user, role=role))

        await websocket.send_text(board.model_dump_json())

        while True:
            try:
                msg = await websocket.receive_text()
                new_state = TBoard.model_validate_json(msg)
                manager.rooms[class_id] = new_state
                await manager.broadcast(class_id, new_state.model_dump_json())
            except WebSocketDisconnect:
                raise
            except Exception as e:
                error_message = {"error": str(e)}
                logger.error(f"Error processing message: {error_message}")
                await websocket.send_text(json.dumps(error_message))

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for class {class_id}")
    finally:
        logger.info(f"Removing connection for class {class_id}")
        manager.remove_connection(class_id, websocket)
