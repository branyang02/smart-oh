import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import RoomStateViewer from "./room-state-viewer";

// Interfaces for WebSocket messages
export interface WSUser {
    id: string;
    name: string;
    type: string;
    location?: string; // "queue" or "session-<session_id>"
}

export interface WSSession {
    id: string;
    users: WSUser[]; // List of users in the session
}

export interface WSRoomState {
    class_id: string;
    all_users: WSUser[]; // List of all users in the room
    queue: WSUser[]; // List of users in the queue
    sessions: Map<string, WSSession>; // Map of session_id to session
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
