import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import RoomStateViewer from "./room-state-viewer";

// Interfaces for WebSocket messages
export interface WSUser {
    id: string; // User ID
    columnId: string; // "queue" | "session-ID" | "none"
    name: string;
    type: string; // "student" | "TA"
}

export interface WSColumn {
    id: string; // "queue" | "session-ID"
    title: string;
}

export interface WSRoomState {
    classId: string;
    allUsers: WSUser[]; // List of all users in the room
    users: WSUser[]; // List of active users in the room (in queue or session)
    columns: WSColumn[]; // List of columns in the room
}

const OfficeHourRoom = ({
    classId,
    userId,
    userType,
    name
}: {
    classId: string;
    userId: string;
    userType: "student" | "TA";
    name: string;
}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomState, setRoomState] = useState<WSRoomState | null>(null);

    useEffect(() => {
        if (socket) return; // Prevent multiple connections
        console.log("Connecting to WebSocket");
        const ws = new WebSocket(
            `ws://localhost:8000/ws/${classId}/${userId}?user_type=${userType}&name=${name}`
        );
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRoomState(data);
        };
        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocket(ws);
        };
        return () => {
            console.log("Cleaning up WebSocket");
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [classId, userId, userType, name]);

    function joinQueue() {
        socket?.send(JSON.stringify({ action: "join_queue" }));
    }
    function leaveQueue() {
        socket?.send(JSON.stringify({ action: "leave_queue" }));
    }
    function createSession() {
        socket?.send(JSON.stringify({ action: "create_session" }));
    }
    function leaveSession() {
        socket?.send(JSON.stringify({ action: "leave_session" }));
    }

    const sendWebSocketMessage = (message: {
        action: string;
        [key: string]: any;
    }) => {
        if (socket) {
            socket.send(JSON.stringify(message));
            console.log("Sent:", message);
        }
    };

    return (
        <>
            <h1>You are currently viewing as a {userType}</h1>
            <RoomStateViewer
                newRoomState={roomState!}
                sendMessage={sendWebSocketMessage}
            />
            <div className="flex gap-4 mt-4">
                <Button onClick={joinQueue}>Join Queue</Button>
                <Button onClick={leaveQueue} variant="destructive">
                    Leave Queue
                </Button>
                <Button onClick={createSession}>Create Session</Button>
                <Button onClick={leaveSession}>Leave Session</Button>
            </div>
        </>
    );
};

export default OfficeHourRoom;
