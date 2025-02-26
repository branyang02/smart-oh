import asyncio
import logging
from typing import Dict, List

from fastapi import WebSocket

from .state import TBoard

logger = logging.getLogger("uvicorn.error")


class OfficeHourManager:
    def __init__(self):
        self.rooms: Dict[str, TBoard] = {}  # class_id -> TBoard
        self.connections: Dict[
            str, List[WebSocket]
        ] = {}  # class_id -> list of active WebSocket connections

        self.lock = asyncio.Lock()
        asyncio.create_task(self.cleanup_empty_columns())

    def get_or_create_room(self, class_id: str) -> TBoard:
        if class_id not in self.rooms:
            self.rooms[class_id] = TBoard(
                classId=class_id,
                allUsers=[],
                columns=[{"id": "queue", "title": "Queue", "cards": []}],
            )
        return self.rooms[class_id]

    def add_connection(self, class_id: str, websocket: WebSocket) -> None:
        if class_id not in self.connections:
            self.connections[class_id] = []
        self.connections[class_id].append(websocket)

    def remove_connection(self, class_id: str, websocket: WebSocket) -> None:
        if class_id in self.connections:
            self.connections[class_id].remove(websocket)
            if not self.connections[class_id]:
                del self.connections[class_id]

    async def broadcast(self, class_id: str, data: str) -> None:
        """Send `data` to all clients connected to a particular class."""
        if class_id in self.connections:
            to_remove = []
            for connection in self.connections[class_id]:
                try:
                    await connection.send_text(data)
                except Exception:
                    to_remove.append(connection)
            for connection in to_remove:
                self.remove_connection(class_id, connection)

    async def cleanup_empty_columns(self):
        """Background task to remove empty columns (except 'queue') every 10 minutes."""
        while True:
            await asyncio.sleep(600)  # Run every 10 minutes (600 seconds)
            logger.info("Cleaning up empty columns")

            async with self.lock:
                for class_id, board in list(self.rooms.items()):
                    updated_columns = [
                        col for col in board.columns if col.id == "queue" or col.cards
                    ]

                    if len(updated_columns) != len(
                        board.columns
                    ):  # Only update if columns were removed
                        board.columns = updated_columns
                        await self.broadcast(class_id, board.model_dump_json())
