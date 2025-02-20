import { useClass } from "@/context/class-context";
import { useCallback, useEffect, useRef, useState } from "react";

import { TBoard } from "./data";
import DnD from "./dnd";
import { SettingsContextProvider } from "./settings-context";

const OfficeHourRoom = ({ currClassId }: { currClassId: string }) => {
    const { user } = useClass();
    const wsRef = useRef<WebSocket | null>(null);
    const [roomState, setRoomState] = useState<TBoard | null>(null);

    useEffect(() => {
        const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/ws/${currClassId}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connected for class:", currClassId);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.error) {
                    console.error("Server error:", data.error);
                } else {
                    setRoomState(data);
                }
            } catch (err) {
                console.error("Failed to parse message", err);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        wsRef.current = socket;

        return () => {
            socket.close();
        };
    }, [currClassId]);

    const sendBoardUpdate = useCallback((updatedBoard: TBoard) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(updatedBoard));
        }
    }, []);

    const handleRoomStateChange = useCallback(
        (newRoomState: TBoard) => {
            sendBoardUpdate(newRoomState);
        },
        [sendBoardUpdate]
    );

    if (!roomState) {
        return <div>Loading…</div>;
    }

    user.currentColumnId = roomState.allUsers.find(
        (card) => card.user.id === user.id
    )?.user.currentColumnId;

    return (
        <SettingsContextProvider>
            <DnD
                newRoomState={roomState!}
                handleRoomStateChange={handleRoomStateChange}
            />
        </SettingsContextProvider>
    );
};

export default OfficeHourRoom;
