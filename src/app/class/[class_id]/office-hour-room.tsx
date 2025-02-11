// OfficeHourRoom.tsx
import RoomStateViewer from "@/components/queue/room-state-viewer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Student {
    id: string;
    name: string;
}

interface TA {
    id: string;
    name: string;
}

interface Session {
    session_id: string;
    session_tas: string[];
    session_students: string[];
}

interface RoomState {
    class_id: string;
    students: Student[];
    tas: TA[];
    queue: Student[];
    sessions: Session[];
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
    const [roomState, setRoomState] = useState<RoomState | null>(null);

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
        socket?.send(JSON.stringify({ action: "join_session" }));
    }
    function leaveSession() {
        socket?.send(JSON.stringify({ action: "leave_session" }));
    }
    function assign_student_to_session(studentId: string) {
        socket?.send(
            JSON.stringify({
                action: "assign_student_to_session",
                student_id: studentId
            })
        );
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
                roomState={roomState}
                sendMessage={sendWebSocketMessage}
            />
            <div className="flex gap-4 mt-4">
                <Button onClick={joinQueue}>Join Queue</Button>
                <Button onClick={leaveQueue} variant="destructive">
                    Leave Queue
                </Button>
                <Button onClick={createSession}>Create Session</Button>
                <Button onClick={leaveSession}>Leave Session</Button>
                {userType === "TA" && roomState && (
                    <div className="flex flex-col gap-2">
                        <h3>Assign Student to Session:</h3>
                        {roomState.queue.map((student) => (
                            <Button
                                key={student.id}
                                onClick={() =>
                                    assign_student_to_session(student.id)
                                }
                            >
                                Assign {student.name}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default OfficeHourRoom;
